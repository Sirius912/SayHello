import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, } from "react-native";
import * as Font from 'expo-font';
// 각 카테고리별 메시지 정의
const messages = {
  "재해": [
    {
      id: 1,
      image: require("../../assets/earthquake.jpg"),
      sender: "할아버지",
      title: "지진 7.1도",
      date: "2025-03-01",
      desc: "강한 지진이 감지되었습니다. 즉시 안전한 장소로 대피하시고 뉴스를 확인하세요.",
    },
    {
      id: 2,
      image: require("../../assets/flood.jpg"),
      sender: "제인",
      title: "홍수",
      date: "2025-02-28",
      desc: "폭우로 인해 심각한 홍수가 발생했습니다. 저지대를 피해 높은 지대로 이동하세요.",
    },
  ],
  "날씨": [
    {
      id: 3,
      image: require("../../assets/snow.jpg"),
      sender: "아빠",
      title: "폭설 경보",
      date: "2025-03-02",
      desc: "(100mm 이상의 강수량 예상)",
    },
  ],
  "미세먼지": [
    {
      id: 4,
      image: require("../../assets/dust.jpg"),
      sender: "보건소",
      title: "미세먼지 경보",
      date: "2025-03-03",
      desc: "(야외 활동을 최소화하세요)",
    },
  ],
};

export default function WhatsUpScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("재해");

  useEffect(() => {
      async function loadFonts() {
        await Font.loadAsync({
          NanumSquareRoundEB: require('../../assets/fonts/NanumSquareRoundOTFEB.otf'), // 가장 굵게
          NanumSquareRoundB: require('../../assets/fonts/NanumSquareRoundOTFB.otf'), // 두껍게
          NanumSquareRoundR: require('../../assets/fonts/NanumSquareRoundOTFR.otf'), // 보통
          NanumSquareRoundL: require('../../assets/fonts/NanumSquareRoundOTFL.otf'), // 얇게
          GeumUnBohwa: require('../../assets/fonts/GeumUnBohwa.ttf'),
        });
        setFontsLoaded(true);
      }
      loadFonts();
  }, []);

  if (!fontsLoaded){
    return null;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <Image
        source={require('../../assets/headerTab_v.png')}
        style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}
      />
      <View style={styles.box}>
        <Text style={styles.title}>주변 소식</Text>
        <View style={styles.filterTabs}>
          {["재해", "날씨", "미세먼지"].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterTab,
                selectedCategory === category && styles.filterTabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedCategory === category && styles.filterTabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          {messages[selectedCategory]?.map((msg) => (
            <View key={msg.id} style={styles.cardRowLayout}>
              <View style={styles.cardLeft}>
                <Image source={msg.image} style={styles.cardImageRow} />
                <Text style={styles.sender}>{msg.sender}</Text>
                <View style={styles.cardRow}>
                  <Text style={styles.messageTitle}>{msg.title}</Text>
                  <Text style={styles.date}>{msg.date}</Text>
                </View>
                <Text style={styles.messageDesc}>{msg.desc}</Text>
              </View>
              <TouchableOpacity
                style={styles.messageButtonRight}
                onPress={() => navigation.navigate("Message")}
              >
                <Text style={styles.messageText}>메시지</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#41BA6B",
    flex: 1,
  },
  box: {
    backgroundColor: 'white',
    paddingTop: 0,
    padding: 15,
    paddingBottom: -15,
    flex: 11
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundEB',
    marginBottom: 5,
  },
  cardImageRow: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 6,
  },
  cardLeft: {
    flex: 1,
    marginRight: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardRowLayout: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    alignItems: "center",
  },
  container: {
    backgroundColor: 'white',
  },
  date: {
    color: "#888",
    fontSize: 16
  },
  filterTab: {
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginRight: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  filterTabActive: {
    backgroundColor: '#4CAF50',
  },
  filterTabText: {
    fontFamily: 'NanumSquareRoundB',
    color: "#333",
    fontWeight: '600',
  },
  filterTabTextActive: {
    fontFamily: 'NanumSquareRoundEB',
    color: 'white',
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  messageButtonRight: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 7,
    marginTop: -100,
  },
  messageDesc: {
    fontFamily: 'NanumSquareRoundR',
    color: "#444",
    fontSize: 15,
  },
  messageText: {
    fontFamily: 'NanumSquareRoundEB',
    color: "#fff",
  },
  messageTitle: {
    fontFamily: 'NanumSquareRoundEB',
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 2,
  },
  sender: {
    fontFamily: 'NanumSquareRoundB',
    color: "#888",
    marginBottom: 4,
    fontSize: 16,
    marginTop: 2,
  },
});