import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { fetchWeatherData } from "../api";
import { GOOGLE_MAPS_API_KEY } from '@env';
import axios from 'axios';
import { Fontisto } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "../api/firebase";
import { getAuth } from 'firebase/auth';
import * as Font from 'expo-font';
import { Dropdown } from "react-native-element-dropdown";

export default function MapScreen() {
  const [location, setLocation] = useState(null); // 현재 위치 저장
  const [errorMsg, setErrorMsg] = useState(null); // 오류 메시지
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 Marker 정보
  const [weatherData, setWeatherData] = useState(null); // 날씨 데이터 상태
  const [regionName, setRegionName] = useState(""); // 지역 이름 상태
  const [currentUserNickname, setCurrentUserNickname] = useState("");
  const [contacts, setContacts] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const [filterValue, setFilterValue] = useState(null);
  const [sortValue, setSortValue] = useState(null);

  // 샘플 데이터 (나중에 수정해야함)
  const markers = [
    {
      id: "1",
      title: "할아버지",
      date: "2025-03-01",
      description: "지진 7.1",
      latitudeOffset: 0.001,
      longitudeOffset: -0.001,
    },
    {
      id: "2",
      title: "부모님",
      date: "2025-02-20",
      description: "홍수",
      latitudeOffset: -0.001,
      longitudeOffset: 0.001,
    },
    {
      id: "3",
      title: "형",
      date: "2025-01-10",
      description: "천둥",
      latitudeOffset: 0.002,
      longitudeOffset: -0.002,
    },
    {
      id: "4",
      title: "제인",
      date: "2025-01-05",
      description: "폭염",
      latitudeOffset: -0.002,
      longitudeOffset: 0.002,
    },
  ];

  const filterOptions = [
    { label: "모두 보기", value: "all" },
    { label: "지진", value: "지진" },
    { label: "홍수", value: "홍수" },
    { label: "천둥", value: "천둥" },
    { label: "폭염", value: "폭염" },
  ];

  const sortOptions = [
    { label: "최신순", value: "latest" },
    { label: "오래된순", value: "oldest" },
  ];

  const filteredMarkers = markers.filter((marker) =>
    marker.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleFilterChange = (value) => {
    setFilterValue(value);
    if (value === "all") {
      setFilteredMarkers(markers);
    } else {
      const filtered = markers.filter((marker) => marker.description === value);
      setFilteredMarkers(filtered);
    }
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    const sorted = [...markers].sort((a, b) => {
      if (value === "latest") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });
    setFilteredMarkers(sorted);
  };

  useEffect(() => {
    (async () => {
      // 위치 권한 요청
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // 현재 위치 가져오기
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // Firestore 실시간 업데이트 설정
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("사용자가 로그인되어 있지 않습니다.");
      return;
    }

    const userId = user.uid; // 현재 로그인한 사용자의 uid
    const userDocRef = doc(db, "users", userId);
    const contactsRef = collection(db, `users/${userId}/contacts`);

    // 사용자 닉네임 가져오기
    const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUserNickname(docSnap.data().nickname || "Unknown"); // 닉네임 설정
      } else {
        console.error("사용자 문서를 찾을 수 없습니다.");
      }
    });

    const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "No Name", // 이름 필드가 없을 경우 기본값 설정
        image: doc.data().image || require('../../assets/default.jpg'),
      }));
      setContacts(contactsData);
    });
  
    return () => {
      unsubscribeUserDoc();
      unsubscribe();
    }; // 컴포넌트 언마운트 시 구독 해제
  }, []);

  

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setSelectedMarker(null);
      setWeatherData(null);
      setRegionName("");
    }
  }, []);

  const getRegionName = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        const regionName = response.data.results[0].formatted_address;
        const addressParts = regionName.split(' '); // 공백 기준으로 나누기
        const simplifiedAddress = addressParts.slice(1, 4).join(' '); // 지역명만 뜨게 하기 (예: 서울특별시 강남구 역삼동)
        setRegionName(simplifiedAddress);
      } else {
        setRegionName("Unknown");
      }
    } catch (error) {
      console.error(error);
      setRegionName("Failed to load");
    }
  };

  const handleMarkerPress = async (marker) => {
    setSelectedMarker(marker);
    const data = await fetchWeatherData(
      location.latitude + marker.latitudeOffset,
      location.longitude + marker.longitudeOffset
    );
    // console.log(data);
    setWeatherData(data);
    // console.log(weatherData);

    // 지역 이름 가져오기
    await getRegionName(
      location.latitude + marker.latitudeOffset,
      location.longitude + marker.longitudeOffset
    );
    // console.log(regionName);

    bottomSheetModalRef.current?.present(); // BottomSheetModal 열기
  };

  const icons = {
    "Thunderstorm": "lightning",
    "Drizzle": "rains",
    "Rain": "rain",
    "Snow" : "snowflake",
    "Atmosphere": "cloudy-gusts",
    "Clear" : "day-sunny",
    "Clouds": "cloudy",
  }

  const weatherDescriptions = {
    "clear sky": "맑은 하늘",
    "few clouds": "구름 조금",
    "scattered clouds": "흩어진 구름",
    "broken clouds": "조각 구름",
    "overcast clouds": "흐린 구름",
    "light rain": "약한 비",
    "moderate rain": "보통 비",
    "heavy intensity rain": "강한 비",
    "very heavy rain": "매우 강한 비",
    "extreme rain": "극심한 비",
    "freezing rain": "얼어붙는 비",
    "light intensity shower rain": "약한 소나기성 비",
    "shower rain": "소나기성 비",
    "heavy intensity shower rain": "강한 소나기성 비",
    "ragged shower rain": "불규칙적인 소나기성 비",
    "thunderstorm with light rain": "약한 비를 동반한 뇌우",
    "thunderstorm with rain": "비를 동반한 뇌우",
    "thunderstorm with heavy rain": "강한 비를 동반한 뇌우",
    "light thunderstorm": "약한 뇌우",
    "thunderstorm": "뇌우",
    "heavy thunderstorm": "강한 뇌우",
    "ragged thunderstorm": "불규칙한 뇌우",
    "thunderstorm with light drizzle": "약한 이슬비를 동반한 뇌우",
    "thunderstorm with drizzle": "이슬비를 동반한 뇌우",
    "thunderstorm with heavy drizzle": "강한 이슬비를 동반한 뇌우",
    "light snow": "약한 눈",
    "snow": "눈",
    "heavy snow": "많은 눈",
    "sleet": "진눈깨비",
    "light shower sleet": "약한 소나기성 진눈깨비",
    "shower sleet": "소나기성 진눈깨비",
    "light rain and snow": "약한 비와 눈",
    "rain and snow": "비와 눈",
    "light shower snow": "약한 소나기성 눈",
    "shower snow": "소나기성 눈",
    "heavy shower snow": "많은 소나기성 눈",
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          {/* 검색창 및 필터/정렬 */}
          <Text style={styles.title}>지도</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#777" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="찾고자 하는 사람을 입력하세요"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>

          {/* 필터/정렬 및 결과 */}
          <View style={styles.filterSortRow}>
            <View style={styles.filterSortContainer}>
              {/* 필터 버튼 */}
              <Dropdown
                data={filterOptions}
                labelField="label"
                valueField="value"
                placeholder="필터"
                value={filterValue}
                onChange={(item) => handleFilterChange(item.value)}
                style={styles.dropdown}
              />

              {/* 정렬 버튼 */}
              <Dropdown
                data={sortOptions}
                labelField="label"
                valueField="value"
                placeholder="정렬"
                value={sortValue}
                onChange={(item) => handleSortChange(item.value)}
                style={styles.dropdown}
              />
            </View>

            {/* 결과 개수 */}
            <Text style={styles.resultCount}>{filteredMarkers.length} results</Text>
          </View>

          {/* 지도 표시 */}
          {location ? (
            <MapView
              style={{ flex: selectedMarker ? 0.6 : 1 }} // Marker 선택 여부에 따라 지도 크기 조정
              initialRegion={location}
              showsUserLocation={false} // 현재 위치 표시
              onPress={() => bottomSheetModalRef.current?.dismiss()} // 지도 클릭시 Bottom Sheet 닫기
            >

              {/* 현재 사용자 마커 */}
              {location && (
                <Marker coordinate={location}>
                  <View style={[styles.markerContainer, styles.currentUserMarker]}>
                    <Text style={[styles.markerText, styles.currentUserText]}>
                      {currentUserNickname}
                    </Text>
                  </View>
                </Marker>
              )}
              
              {/* Marker 렌더링 */}
              {filteredMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: location.latitude + marker.latitudeOffset,
                    longitude: location.longitude + marker.longitudeOffset,
                  }}
                  onPress={() => handleMarkerPress(marker)} // Marker 클릭 시 정보 저장
                >
                  {/* 커스텀 Marker 스타일 */}
                  <View style={[styles.markerContainer]}>
                    <Text style={[styles.markerText]}>
                      {marker.title}
                    </Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          ) : (
            <Text>{errorMsg || "Loading..."}</Text>
          )}

          {/* Bottom Sheet Modal */}
          <BottomSheetModal
              ref={bottomSheetModalRef}
              snapPoints={["40%", "40%"]}
              // enableDynamicSizing={true}
              enablePanDownToClose={true}
              onChange={handleSheetChanges}
            >
              <View style={styles.contentContainer}>
                {selectedMarker ? (
                  <>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoTitle}>
                        {selectedMarker.title}
                      </Text>
                      <Text style={styles.infoDescription}>
                        / {selectedMarker.date}
                      </Text>
                      
                    </View>
                    <View style={styles.weatherContainer}>
                      {weatherData?.weather?.[0]?.icon ? (
                        <>
                          {/* <Image
                            source={{
                              uri: `http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`,
                            }}
                            style={styles.weatherIcon}
                          /> */}

                          <Fontisto name={icons[weatherData?.weather[0]?.main]} size={24} color="black" />
                          
                          <Text style={styles.weatherDetail}>
                            기온: {weatherData?.main?.temp ? `${Math.round(weatherData.main.temp)}°C` : "N/A"}
                          </Text>
                          <Text style={styles.weatherDetail}>
                            날씨: {weatherDescriptions[weatherData.weather[0].description]}
                          </Text>
                          <Text style={styles.weatherDetail}>
                            습도: {weatherData.main.humidity}%
                          </Text>
                          <Text style={styles.weatherDetail}>
                            풍속: {weatherData.wind.speed} m/s
                          </Text>
                        </>
                        ) : (
                          <Text>No weather data available</Text>
                        )}
          
                    </View>
                    
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectButtonText}>선택</Text>
                    </TouchableOpacity>

                    <Text style={styles.infoDescription}>
                        {regionName}
                    </Text>
                    <Text style={styles.infoDescription}>
                        {selectedMarker.description}
                    </Text>
                  </>
                ) : (
                  <Text>No marker selected</Text>
                )}
              </View>
            </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
    // zIndex: 0,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 13,
    marginBottom: -10,

  },
  searchContainer: {
    flexDirection: "row", // 검색창 및 버튼을 가로로 배치
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    height: 40,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  filterSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 필터/정렬과 결과 개수를 양쪽 끝으로 배치
    marginLeft: 10,
  },
  filterSortContainer: {
    flexDirection: 'row', // 필터와 정렬 버튼을 가로로 배치
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#eaeaea",
    borderRadius: 8,
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: "#333",
  },
  sortButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#eaeaea",
    borderRadius: 5,
    marginRight: 10,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: "#333",
  },
  resultCount: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
    marginRight: 10,
    marginBottom: 10,
  },
  map: {
    flex: 0.6, // Marker 선택 시 지도 크기 조정
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row", // 가로로 배치
    alignItems: "center", // 세로 축에서 중앙 정렬
    justifyContent: "space-between",
    // marginBottom: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 30,
    color:"#333",
    marginRight: 20,
  },
  infoDescription: {
    fontWeight: "bold",
    color:"#333",
    // marginBottom: 40,
  },
  weatherContainer: {
    alignSelf: "flex-start",
    marginTop: 30,
    marginLeft: 40
  },
  weatherDetail: {
    alignSelf: "flex-start"
  },
  markerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  markerText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  currentUserMarker: {
    backgroundColor: "#000",
    borderWidth: 0,
  },
  currentUserText: {
    color: "#fff",
  },
  infoDescription: {
    fontSize: 14,
    color: "#666",
  },
  selectButton: {
    // alignSelf: "",
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#41BA6B",
    borderRadius: 5,
    marginLeft: 30,
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 75,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 10,
  },
})
