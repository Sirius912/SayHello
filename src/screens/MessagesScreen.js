import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Clipboard, SafeAreaView } from 'react-native';

export default function MessageScreen() {
    const [selectedButtons, setSelectedButtons] = useState([]);

    const handlePress = (buttonName) => {
        if (selectedButtons.includes(buttonName)) {
            setSelectedButtons(selectedButtons.filter((item) => item !== buttonName));
        } else {
            setSelectedButtons([...selectedButtons, buttonName]);
        }
    };

    const message = `할아버지와 할머니께,
최근 지진 이후 잘 지내고 계신지요? 힘든 시간을 보내셨을 텐데, 안전하고 건강하시길 바랍니다.
오늘 날씨는 약간 쌀쌀하며 기온은 4°C입니다. 비 올 확률은 2%로 낮지만, 습도는 68%이며 바람은 2 m/s로 약하게 불고 있습니다. 따뜻하게 입으시고 건강에 유의하세요.
많은 사랑을 보내며 곧 소식을 듣길 기대합니다!
건강하세요.`;

    const copyToClipboard = () => {
        Clipboard.setString(message);
        Alert.alert('복사 완료!', '텍스트가 클립보드에 복사되었습니다.');
    };

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <Image
                source={require('../../assets/headerTab_v.png')}
                style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}
            />
            <View style={styles.box}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.header_title}>안부 메시지 작성</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.shadowView}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.text1}>안부 대상</Text>
                                <Text style={styles.text1}>최근 연락</Text>
                                <Text style={styles.text1}>연락 주기</Text>
                            </View>
                            <View style={{ flex: 2, marginLeft: 10 }}>
                                <Text style={styles.text2}>할아버지</Text>
                                <Text style={styles.text2}>2025-02-10</Text>
                                <Text style={styles.text2}>1개월</Text>
                            </View>
                        </View>
                        <View style={styles.divider}></View>
                        <Text style={styles.text1}>정보</Text>
                        <View style={{ marginVertical: 7 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Image source={require('../../assets/earthquake.jpg')} style={styles.photo}></Image>
                                </View>
                                <View style={{ flex: 2, marginLeft: 10 }}>
                                    <Text style={{ color: '#777', fontSize: 17, marginVertical: 3 }}>재해</Text>
                                    <Text style={styles.text3}>2025-03-01</Text>
                                    <Text style={styles.text3}>지진 7.1</Text>
                                </View>

                            </View>
                        </View>
                        <View style={styles.divider}></View>
                        <Text style={styles.text1}>메시지에 포함할 내용:</Text>
                        <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row' }}>
                                {['재해', '날씨 보고', '미세먼지', '없음'].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.option,
                                            selectedButtons.includes(item) && styles.selectedButton,
                                        ]}
                                        onPress={() => handlePress(item)}
                                    >
                                        <Text style={[styles.buttonText, selectedButtons.includes(item) && styles.selectedText]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                        </View>
                        <View style={styles.shadowView}>

                        <Text style={styles.text1}>메시지 미리보기</Text>
                        <View>
                            <Text style={styles.messageText}>{message}</Text>
                        </View>
                    </View>
                    <View style={styles.copy_view}>
                        <TouchableOpacity
                            style={styles.copy_button} onPress={copyToClipboard}>
                            <Text style={{ color: '#ffffff', fontSize: 19 }}>복사</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 30,
        backgroundColor: '#ffffff',
    },
    header_title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    box: {
        backgroundColor: '#ffffff',
        padding: 15,
    },
    buttonText: {
        fontWeight: '600',
    },
    copy_view: {
        paddingBottom: 65,
        padding: 10,
    },
    option: {
        padding: 5,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginHorizontal: 4,
        paddingHorizontal: 12
    },
    copy_button: {
        backgroundColor: '#41BA6B',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
    },
    shadowView: {
        marginHorizontal: 5,
        marginTop: 10,
        marginBottom: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingHorizontal: 15,
        paddingTop: 8,
        paddingBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 7,
    },
    messageBox: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 120,
        marginBottom: 16,
    },
    messageText: {
        fontSize: 13,
        lineHeight: 20,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    safeArea: {
        backgroundColor: "#41BA6B",
        flex: 1,
    },
    selectedButton: {
        backgroundColor: 'black',
    },
    selectedText: {
        color: 'white',
    },
    text1: {
        fontSize: 17,
        marginVertical: 7,
        fontWeight: 'bold'
    },
    text2: {
        fontSize: 17,
        marginVertical: 7,
        color: '#777'
    },
    text3: {
        marginVertical: 3,
        fontSize: 17
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -10
    },
});