import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";

export default function SearchFilterSort({
    searchQuery, setSearchQuery,
    filterValue, setFilterValue,
    sortValue, setSortValue,
    filteredMarkers
}) {

    const handleFilterChange = (value) => {
        setFilterValue(value);
        if (value === "all") {
            setFilteredMarkers(markers);
        } else {
            const filtered = markers.filter((marker) => marker.description === value);
            setFilteredMarkers(filtered);
        }
    };

    const handleSortChange = (value) => {
        setSortValue(value);
        const sorted = [...markers].sort((a, b) => {
            if (value === "latest") {
                return new Date(b.date) - new Date(a.date);
            } else {
                return new Date(a.date) - new Date(b.date);
            }
        });
        setFilteredMarkers(sorted);
    };

    const filterOptions = [
        { label: "기본", value: "all" },
        { label: "지진", value: "지진" },
        { label: "홍수", value: "홍수" },
        { label: "천둥", value: "천둥" },
        { label: "폭염", value: "폭염" },
    ];

    const sortOptions = [
        { label: "최신순", value: "latest" },
        { label: "오래된순", value: "oldest" },
    ];

    return (
        <View>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.icon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="찾고자 하는 사람을 입력하세요"
                    placeholderTextColor={"#999"}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
            </View>
            <View style={styles.filterSortRow}>
                <View style={styles.filterSortContainer}>
                    {/* 필터 버튼 */}
                    <Dropdown
                        data={filterOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="필터"
                        value={filterValue}
                        onChange={(item) => handleFilterChange(item.value)}
                        style={styles.dropdown}
                    />

                    {/* 정렬 버튼 */}
                    <Dropdown
                        data={sortOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="정렬"
                        value={sortValue}
                        onChange={(item) => handleSortChange(item.value)}
                        style={styles.dropdown}
                    />
                </View>

                {/* 결과 개수 */}
                <Text style={styles.resultCount}>
                    {filteredMarkers.length}개의 결과
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
        // marginHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        // marginRight: 10,
        fontSize: 16,
    },
    filterSortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginLeft: 10,
    },
    filterSortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        width: 75,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: "white",
        borderRadius: 8,
        marginRight: 10,
    },
    resultCount: {
        fontSize: 16,
        color: "#666",
        fontWeight: "bold",
        marginRight: 10,
        marginBottom: 10,
    },
});