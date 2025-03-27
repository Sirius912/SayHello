import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { fetchWeatherData } from "../api";

export default function MapScreen() {
  const [location, setLocation] = useState(null); // 현재 위치 저장
  const [errorMsg, setErrorMsg] = useState(null); // 오류 메시지
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 Marker 정보
  const [weatherData, setWeatherData] = useState(null); // 날씨 데이터 상태
  const bottomSheetModalRef = useRef(null);

  // 샘플 데이터 (나중에 수정해야함)
  const markers = [
    {
      id: "1",
      title: "GrandParents",
      description: "Earthquake 7.1 - 2025-03-01",
      latitudeOffset: 0.001,
      longitudeOffset: -0.001,
    },
    {
      id: "2",
      title: "Parents",
      description: "Flood - 2025-02-15",
      latitudeOffset: -0.001,
      longitudeOffset: 0.001,
    },
    {
      id: "3",
      title: "Brother1",
      description: "Storm - 2025-01-10",
      latitudeOffset: 0.002,
      longitudeOffset: -0.002,
    },
    {
      id: "4",
      title: "Jane",
      description: "Heatwave - 2025-01-05",
      latitudeOffset: -0.002,
      longitudeOffset: 0.002,
    },
  ];

  const filteredMarkers = markers.filter((marker) =>
    marker.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setSelectedMarker(null);
      setWeatherData(null);
    }
  }, []);

  
  const handleMarkerPress = async (marker) => {
    setSelectedMarker(marker);
    const data = await fetchWeatherData(
      location.latitude + marker.latitudeOffset,
      location.longitude + marker.longitudeOffset
    );
    // console.log(data);
    setWeatherData(data);
    // console.log(weatherData);
    bottomSheetModalRef.current?.present(); // BottomSheetModal 열기
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* 검색창 및 필터/정렬 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for person or map"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>
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
                  <Text style={[styles.markerText, styles.currentUserText]}>Me</Text>
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
                    <Text style={styles.infoTitle}>{selectedMarker.title}</Text>
                    <Text style={styles.infoDescription}>{selectedMarker.description}</Text>
                  </View>
                  <View style={styles.weatherContainer}>
                    {weatherData?.weather?.[0]?.icon ? (
                      <>
                        <Image
                          source={{
                            uri: `http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`,
                          }}
                          style={styles.weatherIcon}
                        />
                        
                        <Text style={styles.weatherDetail}>
                          Temperature: {weatherData.main.temp}°C
                        </Text>
                        <Text style={styles.weatherDetail}>
                          Condition: {weatherData.weather[0].description}
                        </Text>
                        <Text style={styles.weatherDetail}>
                          Humidity: {weatherData.main.humidity}%
                        </Text>
                        <Text style={styles.weatherDetail}>
                          Wind Speed: {weatherData.wind.speed} m/s
                        </Text>
                      </>
                      ) : (
                        <Text>No weather data available</Text>
                      )}
         
                  </View>
                  
                  <TouchableOpacity style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Select</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text>No marker selected</Text>
              )}
            </View>
          </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
    // zIndex: 0,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row", // 검색창 및 버튼을 가로로 배치
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 14,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#eaeaea",
    borderRadius: 5,
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 12,
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
    fontSize: 12,
    color: "#333",
  },
  resultCount: {
    fontSize: 12,
    color: "#666",
  },
  map: {
    flex: 0.6, // Marker 선택 시 지도 크기 조정
    width: "100%",
    height: "100%",
  },
  // infoContainer: {
  //   flexDirection: "column",
  //   flex: 0.4, // 선택된 Marker가 있을 때 정보 창 표시
  //   backgroundColor: "#fff",
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   paddingHorizontal: 20,
  //   paddingVertical: 15,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: -2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 5,
  //   elevation: 10, // Android 그림자 효과
  // },
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
    alignSelf: "flex-start",
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    borderRadius: 5,
    marginLeft: 30,
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
