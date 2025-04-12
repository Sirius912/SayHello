import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { icons, weatherDescriptions } from "../utils/data";
import useFonts from "../hooks/useFonts";

const WeatherInfo = ({ selectedMarker, weatherData, regionName }) => {
    if (!selectedMarker) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No marker selected</Text>
            </View>
        );
    }
    // console.log(weatherData.main);

    const fontsLoaded = useFonts();

    return (
        <View style={styles.container}>
            {/* 마커 정보 */}
            <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>{selectedMarker.name}</Text>
                <Text style={styles.regionName}> {regionName}</Text>
            </View>

            {/* 날씨 정보 */}
            <View style={styles.weatherContainer}>
                {weatherData?.weather?.[0]?.icon ? (
                    <>
                        <Fontisto
                            name={icons[weatherData?.weather[0]?.main]}
                            size={30}
                            color="black"
                            resizeMode="contain"
                            alignSelf="center"
                        />
                        <Text style={styles.weatherDetail}>
                            🌡️ 기온: {weatherData?.main?.temp ? `${Math.round(weatherData.main.temp)}°C` : "N/A"}
                        </Text>
                        <Text style={styles.weatherDetail}>
                            🌦️ 날씨: {weatherDescriptions[weatherData.weather[0].description]}
                        </Text>
                        <Text style={styles.weatherDetail}>
                            💧 습도: {weatherData.main.humidity}%
                        </Text>
                        <Text style={styles.weatherDetail}>
                            🌬️풍속: {weatherData.wind.speed} m/s
                        </Text>
                    </>
                ) : (
                    <Text>No weather data available</Text>
                )}
            </View>

            {/* 지역 이름 및 설명 */}
            <View style={styles.regionContainer}>
                <Text style={styles.markerDescription}>지진 7.1</Text>
            </View>

            {/* 선택 버튼 */}
            <TouchableOpacity style={styles.selectButton}>
                <Text style={styles.selectButtonText}>선택</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    infoTitle: {
        fontFamily: "NanumSquareRoundEB",
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginRight: 20,
    },
    weatherContainer: {
        alignSelf: "center",
        marginTop: 30,
    },
    weatherDetail: {
        fontFamily: "NanumSquareRoundB",
        fontSize: 16,
        color: "#333",
        marginVertical: 5,
        textAlign: "center",
    },
    regionContainer: {
        marginTop: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    regionName: {
        fontFamily: "NanumSquareRoundB",
        fontSize: 15,
        color: "#333",
        fontWeight: "bold",
        textAlign: "center",
    },
    markerDescription: {
        fontFamily: "NanumSquareRoundEB",
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    selectButton: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: "#41BA6B",
        borderRadius: 8,
        alignSelf: "center",
    },
    selectButtonText: {
        fontFamily: "NanumSquareRoundEB",
        color: "#fff",
        fontWeight: "bold",
    },
});

export default WeatherInfo;