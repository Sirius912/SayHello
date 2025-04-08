import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase";
import { getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  // 현재 위치 가져오기
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
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
    const contactsRef = collection(db, `users/${userId}/contacts`);
  
    const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "No Name", // 이름 필드가 없을 경우 기본값 설정
        image: doc.data().image || require('../../assets/default.jpg'),
      }));
      setContacts(contactsData);
    });
  
    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  const otherUsers = [
    { id: 1,
      name: "제인",
      latitude: 0.003,
      longitude: 0.003},
    { id: 2, 
      name: "형",
      latitude: 0.003,
      longitude: 0.003 },
  ];

  const newsData = [
    {
      id: "1",
      title: "지진 7.1",
      sender: "할아버지",
      image: require("../../assets/earthquake.jpg"),
    },
    {
      id: "2",
      title: "홍수",
      sender: "제인",
      image: require("../../assets/flood.jpg"),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* 검색 창 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#999"
          />
        </View>

        {/* Navigation Tabs */}
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} // 스크롤바 숨김
        contentContainerStyle={styles.tabsContainer}
        style={{ maxHeight: 50 }}
        >
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="heart-outline" size={18} color="#333" />
            <Text style={styles.tabText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}
            onPress={() => navigation.navigate("News")}
          >
            <Ionicons name="newspaper-outline" size={18} color="#333" />
            <Text style={styles.tabText}>What's up?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}
            onPress={() => navigation.navigate("People")}
          >
            <Ionicons name="people-outline" size={18} color="#333" />
            <Text style={styles.tabText}>People</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}
            onPress={() => navigation.navigate("Message")}
          >
            <Ionicons name="chatbubbles-outline" size={18} color="#333" />
            <Text style={styles.tabText}>Message</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Map</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Map")}>
              <Ionicons name="chevron-forward-circle-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Map")}>
            <MapView
              style={styles.map}
              region={currentLocation} // 현재 위치를 지도에 반영
              showsUserLocation={false} // 사용자 위치 표시
            >
              {/* 현재 사용자 마커 */}
              {currentLocation && (
                <Marker coordinate={currentLocation}>
                  <View style={[styles.markerContainer, styles.currentUserMarker]}>
                    <Text style={[styles.markerText, styles.currentUserText]}>Me</Text>
                  </View>
                </Marker>
              )}
              {/* 다른 사용자 마커 */}
              {otherUsers.map((user) => (
                <Marker
                  key={user.id}
                  coordinate={{ latitude: user.latitude, longitude: user.longitude }}
                >
                  <View style={styles.markerContainer}>
                    <Text style={styles.markerText}>{user.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          </TouchableOpacity>
        </View>

        {/* People Section */}
        <View style={styles.peopleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>People</Text>
            <TouchableOpacity onPress={() => navigation.navigate("People")}>
              <Ionicons
                name="chevron-forward-circle-outline"
                size={20} // 화살표 크기
                color="#333"
              />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={contacts}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.personCard}>
                {/* 프로필 이미지 */}
                {typeof item.image === 'string' ? (
                  <Image source={{ uri: item.image }} style={styles.personImage} />
                ) : (
                  <Image source={item.image} style={styles.personImage} />
                )}
                {/* 이름 */}
                <Text style={styles.personName}>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* What's up? Section */}
        <View style={styles.newsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What's up?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("News")}>
              <Ionicons
                name="chevron-forward-circle-outline"
                size={20} // 화살표 크기
                color="#333"
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={newsData}
            keyExtractor={(item) => item.id}
            numColumns={2} // 두 개의 열로 배치
            renderItem={({ item }) => (
              <View style={styles.newsCard}>
                <View style={styles.newsImageContainer}>
                  <Image source={item.image} style={styles.newsImage} />
                </View>
                <View style={styles.newsContent}>
                  <Text style={styles.sender}>{item.sender}</Text>
                  <Text style={styles.title}>{item.title}</Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate("Messages")}
                    style={styles.messageButton}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      메시지 보내기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingTop: 20, // 상단 여백
  },
  searchContainer: {
    flexDirection: "row", // 아이콘과 입력창을 가로로 배치
    alignItems: "center", // 세로 정렬
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    marginRight: 8, // 아이콘과 입력창 간격
  },
  input: {
    flex: 1, // 입력창이 남은 공간을 차지하도록 설정
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  tabs: {
    flexDirection: "row", // 탭을 가로로 배치
    justifyContent: "space-around", // 탭 간격 균등 배치
    marginVertical: 10,
  },
  tab: {
    flexDirection: "row", // 아이콘과 텍스트를 가로로 배치
    alignItems: "center", // 세로 정렬
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  tabText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5, // 아이콘과 텍스트 간격
  },
  sectionHeader: {
    flexDirection: "row", // 제목과 화살표를 같은 행에 배치
    alignItems: "center", // 세로 중앙 정렬
  },
  map: {
    width: "100%", // 화면 너비를 가득 채움
    height: 150,   // 지도 섹션 높이 설정
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24, // 텍스트 크기 조정
    fontWeight: "bold", // 텍스트 두께 설정
    color: "#333", // 텍스트 색상 설정
    marginLeft: 10, // 왼쪽 벽하고 간격 추가
    marginRight: 5, // 화살표 아이콘과 간격 추가
    marginTop: 5,
  },
  peopleSection: {
    marginVertical: 10,
  },
  personCard: {
    alignItems: "center",
    marginRight: 20, // 카드 간격 조정
    marginTop: 10,
    marginLeft: 10,
  },
  personImage: {
    width: 80, // 원형 이미지 너비 증가
    height: 80, // 원형 이미지 높이 증가
    borderRadius: 40, // 원형으로 유지
  },
  personName: {
    fontSize: 14, // 텍스트 크기 조정
    marginTop: 5,
    color: "#333",
  },
  newsSection: {
    marginVertical: 5,
  },
  newsContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sender: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  newsCard: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    overflow: "hidden", // 둥근 모서리 효과를 적용
  },
  newsImageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
  },
  newsImage: {
    width: "100%",
    height: "100%",
  },
  
  title: {
    fontSize: 12,
    color: "#666",
  },
  messageButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50", // 초록색 버튼
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
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
  currentUserMarker: {
    backgroundColor: "#000",
    borderWidth: 0,
  },
  markerText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  currentUserText: {
    color: "#fff",
  },
});