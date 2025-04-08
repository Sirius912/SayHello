import React, { useState } from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar,} from "react-native";

// 각 카테고리별 메시지 정의
const messages = {
  "재해": [
    {
      id: 1,
      image: require("../../assets/earthquake.jpg"),
      sender: "할아버지",
      title: "지진 7.1도",
      date: "2025-03-01",
      desc: "강한 지진이 감지되었습니다. 즉시 안전한 장소로 대피하시고 공식 업데이트를 확인하세요.",
    },    
    {
      id: 2,
      image: require("../../assets/flood.jpg"),
      sender: "제인",
      title: "홍수",
      date: "2025-02-28",
      desc: "폭우로 인해 심각한 홍수가 발생했습니다. 저지대를 피하고 높은 지대로 이동하세요.",
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
  const [selectedCategory, setSelectedCategory] = useState("재해");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container}>

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
              onPress={() => navigation.navigate("Messages")}
            >
              <Text style={styles.messageText}>메시지</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardImageRow: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    borderRadius: 0,
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
    padding: 10,
    alignItems: "center",
  },
  container: {
    padding: 20,
  },
  date: {
    color: "#888",
  },
  filterTab: {
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginHorizontal: 4,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    marginBottom: 10,
  },
  filterTabActive: {
    backgroundColor: '#4CAF50',
  },
  filterTabText: {
    color: "#333",
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: 'white',
  },
  filterTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
    marginBottom: 16,
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
    color: "#444",
    fontSize: 12,
  },
  messageText: {
    color: "#fff",
  },
  messageTitle: {
    fontWeight: "bold",
  },
  safeArea: {
    backgroundColor: "#F5FBEF",
    flex: 1,
  },
  sender: {
    color: "#888",
    marginBottom: 4,
  },
});