import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { icons, weatherDescriptions } from "../utils/data";

const WeatherInfo = ({ selectedMarker, weatherData, regionName }) => {
    if (!selectedMarker) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No marker selected</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 마커 정보 */}
            <View style={styles.infoRow}>
                <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
                <Text style={styles.markerDate}> / {selectedMarker.date}</Text>
            </View>

            {/* 날씨 정보 */}
            <View style={styles.weatherContainer}>
                {weatherData?.weather?.[0]?.icon ? (
                    <>
                        <Fontisto
                            name={icons[weatherData?.weather[0]?.main]}
                            size={40}
                            color="black"
                        />
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

            {/* 지역 이름 및 설명 */}
            <Text style={styles.regionName}>{regionName}</Text>
            <Text style={styles.markerDescription}>{selectedMarker.description}</Text>
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginRight: 20,
    },
    infoDescription: {
        fontWeight: "bold",
        color: "#333",
    },
    weatherContainer: {
        alignSelf: "flex-start",
        marginTop: 30,
        marginLeft: 40
    },
    weatherDetail: {
        alignSelf: "flex-start"
    },

    infoDescription: {
        fontSize: 14,
        color: "#666",
    },
    selectButton: {
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
});

export default WeatherInfo;