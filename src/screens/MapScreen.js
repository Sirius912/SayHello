import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";

export default function MapScreen() {
  const [location, setLocation] = useState(null); // 현재 위치 저장
  const [errorMsg, setErrorMsg] = useState(null); // 오류 메시지
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 Marker 정보
  const bottomSheetRef = useRef(null); // Bottom Sheet 참조

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

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.snapToIndex(0); // Bottom Sheet 열기
  };

  return (
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
          showsUserLocation={true} // 현재 위치 표시
          onPress={() => bottomSheetRef.current?.close()} // 지도 클릭시 Bottom Sheet 닫기
        >
          {/* Marker 렌더링 */}
          {filteredMarkers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: location.latitude + marker.latitudeOffset,
                longitude: location.longitude + marker.longitudeOffset,
              }}
              title={marker.title}
              description={marker.description}
              onPress={() => handleMarkerPress(marker)} // Marker 클릭 시 정보 저장
            >
              {/* 커스텀 Marker 스타일 */}
              <View style={[styles.markerContainer, marker.id === "1" && styles.currentUserMarker]}>
                <Text style={[styles.markerText, marker.id === "1" && styles.currentUserText]}>
                  {marker.title}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <Text>{errorMsg || "Loading..."}</Text>
      )}

      

      {/* 선택된 Marker 정보 표시 */}
      {/* {selectedMarker && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>{selectedMarker.title}</Text>
          <Text style={styles.infoDescription}>{selectedMarker.description}</Text>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
      )} */}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef} 
        index={0} 
        snapPoints={["25%", "50%"]}
        enablePanDownToClose={true}
        onChange={(index) => {
          console.log("BottomSheet index changed:", index);
          if (index === -1) console.log("Bottom Sheet is closed");
          else console.log("Bottom Sheet is open");
        }}
      >
        <View style={styles.contentContainer}>
          {selectedMarker ? (
            <>
              <Text style={styles.infoTitle}>{selectedMarker.title}</Text>
              <Text style={styles.infoDescription}>
                {selectedMarker.description}
              </Text>
              <TouchableOpacity style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>No marker selected</Text>
          )}
        </View>
      </BottomSheet>
    </View>
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
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color:"#333"
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

})
