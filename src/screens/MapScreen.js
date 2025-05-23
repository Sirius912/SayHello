import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import * as Location from "expo-location";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { fetchWeatherData } from "../api";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "../api";
import { getAuth } from 'firebase/auth';
import SearchFilterSort from "../components/SearchFilterSort";
import MapComponent from "../components/MapComponent";
import WeatherInfo from "../components/WeatherInfo";

import useFonts from '../hooks/useFonts';

import { markers, icons, weatherDescriptions } from "../utils/data";
import { getRegionName } from "../utils/getRegionName";

export default function MapScreen() {
  const [location, setLocation] = useState(null); // 현재 위치 저장
  const [errorMsg, setErrorMsg] = useState(null); // 오류 메시지
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 Marker 정보
  const [weatherData, setWeatherData] = useState(null); // 날씨 데이터 상태
  const [regionName, setRegionName] = useState(""); // 지역 이름 상태
  const [currentUserNickname, setCurrentUserNickname] = useState("");
  const [contacts, setContacts] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const [filterValue, setFilterValue] = useState(null);
  const [sortValue, setSortValue] = useState(null);

  const fontsLoaded = useFonts();

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

  // Firestore 실시간 업데이트 설정
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("사용자가 로그인되어 있지 않습니다.");
      return;
    }

    const userId = user.uid;
    const userDocRef = doc(db, "users", userId);
    const contactsRef = collection(db, `users/${userId}/contacts`);

    const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUserNickname(docSnap.data().nickname || "Unknown");
      } else {
        console.error("사용자 문서를 찾을 수 없습니다.");
      }
    });

    const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "No Name",
        image: doc.data().image || require('../../assets/default.jpg'),
        location: doc.data().location || "No Address",
        coordinate: doc.data().coordinates
      }));
      setContacts(contactsData);
    });

    return () => {
      unsubscribeUserDoc();
      unsubscribe();
    };
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setSelectedMarker(null);
      setWeatherData(null);
      setRegionName("");
    }
  }, []);

  const handleMarkerPress = async (marker) => {
    setSelectedMarker(marker);
    const data = await fetchWeatherData(
      marker.coordinate['latitude'],
      marker.coordinate['longitude']
    );
    setWeatherData(data);
    const region = await getRegionName(
      marker.coordinate['latitude'],
      marker.coordinate['longitude']
    );
    setRegionName(region);
    bottomSheetModalRef.current?.present();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <BottomSheetModalProvider>
        <Image
          source={require('../../assets/headerTab_v.png')}
          style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}
        />
        <View style={styles.container}>
          {/* 검색창 및 필터/정렬 */}
          <Text style={styles.title}>지도</Text>
          <Image
            source={require('../../assets/logo_image.png')} // 캐릭터 이미지 경로
            style={styles.logoImage}
            resizeMode="contain"
          />
          <SearchFilterSort
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            sortValue={sortValue}
            setSortValue={setSortValue}
            filteredMarkers={filteredMarkers}
          />
          {/* 지도 표시 */}
          {location ? (
            <MapComponent
              location={location}
              selectedMarker={selectedMarker}
              filteredMarkers={filteredMarkers}
              contactsData={contacts}
              bottomSheetModalRef={bottomSheetModalRef}
              currentUserNickname={currentUserNickname}
              handleMarkerPress={handleMarkerPress}
            />
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
            <WeatherInfo
              selectedMarker={selectedMarker}
              weatherData={weatherData}
              regionName={regionName}
            />
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#41BA6B",
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
        paddingTop: 0,
        padding: 15,
        paddingBottom: -15,
        flex: 11
  },
  logoImage: {
    position: 'absolute',
    top: '-0.5%',
    left: '13%',
    width: 30,
    height: 30,
    opacity: 1,
  },
  title: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundEB',
  },
})
