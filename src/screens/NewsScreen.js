import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, } from "react-native";
import useFonts from '../hooks/useFonts';
import { info } from "../utils/data";

export default function WhatsUpScreen({ navigation }) {
  const fontsLoaded = useFonts();
  const [selectedCategory, setSelectedCategory] = useState("재해");

  if (!fontsLoaded) {
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
        <Image
          source={require('../../assets/logo_image.png')} // 캐릭터 이미지 경로
          style={styles.logoImage}
          resizeMode="contain"
        />
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
          {info[selectedCategory]?.map((msg) => (
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
    marginTop: 15,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareRoundEB',
    marginBottom: 5,
  },
  logoImage: {
    position: 'absolute',
    top: '-1%',
    left: '25%',
    width: 30,
    height: 30,
    opacity: 1,
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