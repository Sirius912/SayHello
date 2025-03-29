import React, { useState } from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar,} from "react-native";

// 각 카테고리별 메시지 정의
const messages = {
  Disaster: [
    {
      id: 1,
      image: require("../../assets/earthquake.jpg"),
      sender: "GrandParents",
      title: "Earthquake 7.1",
      date: "2025-03-01",
      desc: "A strong earthquake has been detected in your area. Please evacuate to a safe zone immediately and stay tuned for official updates.",
    },    
    {
      id: 2,
      image: require("../../assets/flood.jpg"),
      sender: "Jane",
      title: "Flood",
      date: "2025-02-28",
      desc: "Severe flooding has occurred due to heavy rainfall. Avoid low-lying areas and seek shelter on higher ground.",
    },
  ],
  "Weather Report": [
    {
      id: 3,
      image: require("../../assets/snow.jpg"), 
      sender: "Dad",
      title: "Heavy Snow Alert",
      date: "2025-03-02",
      desc: "(Rainfall expected to exceed 100mm)",
    },
  ],
  "Fine Dust": [
    {
      id: 4,
      image: require("../../assets/dust.jpg"), 
      sender: "Health Center",
      title: "Fine Dust Warning",
      date: "2025-03-03",
      desc: "(Outdoor activity should be minimized)",
    },
  ],
};

export default function WhatsUpScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("Disaster");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>What's up</Text>

        <View style={styles.filterTabs}>
          {["Disaster", "Weather Report", "Fine Dust"].map((category) => (
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
              <Text style={styles.messageText}>message</Text>
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
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterTabActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterTabText: {
    color: "#333",
    fontSize: 12,
  },
  filterTabTextActive: {
    color: "#fff",
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
    backgroundColor: "#000",
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
    backgroundColor: "#fff",
    flex: 1,
  },
  sender: {
    color: "#888",
    marginBottom: 4,
  },
});
