import React from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapComponent({ 
    location,
    selectedMarker,
    filteredMarkers,
    contactsData,
    bottomSheetModalRef,
    currentUserNickname,
    handleMarkerPress,
}) {

    // console.log(contactsData[0].coordinate['latitude']);
    return (
        <View style={styles.mapContainer}>
            <MapView
                style={{ borderRadius: 8, flex: selectedMarker ? 0.6 : 1 }}
                initialRegion={location}
                showsUserLocation={false}
                onPress={() => bottomSheetModalRef.current?.dismiss()}
            >

                {/* 현재 사용자 마커 */}
                {location && (
                    <Marker coordinate={location}>
                        <View style={[styles.markerContainer, styles.currentUserMarker]}>
                            <Text style={[styles.markerText, styles.currentUserText]}>
                                {currentUserNickname}
                            </Text>
                        </View>
                    </Marker>
                )}

                {/* Marker 렌더링 */}
                {contactsData.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.coordinate['latitude'],
                            longitude: marker.coordinate['longitude'],
                        }}
                        onPress={() => handleMarkerPress(marker)} // Marker 클릭 시 정보 저장
                    >
                        {/* 커스텀 Marker 스타일 */}
                        <View style={[styles.markerContainer]}>
                            <Text style={[styles.markerText]}>
                                {marker.name}
                            </Text>
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 10,
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
})