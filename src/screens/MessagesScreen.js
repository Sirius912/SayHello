import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Clipboard, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';

export default function MessageScreen() {
    const [selectedButton, setSelectedButton] = useState([]);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
          await Font.loadAsync({
            NanumSquareRoundEB: require('../../assets/fonts/NanumSquareRoundOTFEB.otf'), // 가장 굵게
            NanumSquareRoundB: require('../../assets/fonts/NanumSquareRoundOTFB.otf'), // 두껍게
            NanumSquareRoundR: require('../../assets/fonts/NanumSquareRoundOTFR.otf'), // 보통
            NanumSquareRoundL: require('../../assets/fonts/NanumSquareRoundOTFL.otf'), // 얇게
            GeumUnBohwa: require('../../assets/fonts/GeumUnBohwa.ttf'),
            Mugunghwa: require('../../assets/fonts/Mugunghwa.ttf'),
          });
          setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (!fontsLoaded){
    return null;
    }

    const handlePress = (item) => {
        setSelectedButton(prev => prev === item ? null : item);
    };

    const messages = {
        '재해': `할아버지와 할머니께,
최근 지진 이후 잘 지내고 계신지요? 힘든 시간을 보내셨을 텐데, 안전하고 건강하시길 바랍니다.
오늘 날씨는 약간 쌀쌀하며 기온은 4°C입니다. 비 올 확률은 2%로 낮지만, 습도는 68%이며 바람은 2 m/s로 약하게 불고 있습니다. 따뜻하게 입으시고 건강에 유의하세요.
많은 사랑을 보내며 곧 소식을 듣길 기대합니다!
건강하세요.`,

        '날씨 보고': `할머니, 할아버지께,
오늘의 날씨를 알려드립니다. 현재 기온은 18°C로 선선하며, 구름이 약간 낀 흐린 날씨입니다.
강수 확률은 20%이며 미세먼지 수치는 '보통' 단계입니다. 산책하시기에 좋은 날씨지만, 가벼운 외투를 준비하시면 좋을 것 같습니다.
항상 건강에 유의하시고, 다음에 뵐 때까지 행복한 일들만 가득하시길 바랍니다.`,

        '미세먼지': `사랑하는 가족에게,
오늘 미세먼지 수치가 '나쁨' 수준으로 올라갔습니다. 외출 시 마스크를 꼭 착용하시고, 
가능한 실내에서 보내시는 것이 좋을 것 같습니다. 공기청정기를 가동해두시고 창문은 닫아두세요.
건강 관리에 특히 신경 써주시길 부탁드립니다. 항상 건강하세요!`,

        '없음': `사랑하는 가족 여러분,
항상 건강하신지요? 오늘은 특별한 소식 없이 안부를 전하고 싶어 편지를 씁니다.
요즘 날씨가 추워지고 있으니 감기 조심하시고, 건강 관리에 유의하세요.
곧 찾아뵐 수 있기를 바라며, 그때까지 행복한 일들만 가득하시길 바랍니다.`
    };

    const message = selectedButton ? messages[selectedButton] : "옵션을 선택해주세요 ▶";

    const copyToClipboard = () => {
        Clipboard.setString(message);
        Alert.alert('복사 완료!', '텍스트가 클립보드에 복사되었습니다.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.box}>
                <ScrollView style={{ padding: 5, paddingTop: -5 }} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text1}>이름</Text>
                            <Text style={styles.text1}>최근 연락</Text>
                            <Text style={styles.text1}>연락 주기</Text>
                        </View>
                        <View style={{ flex: 2, marginLeft: 10 }}>
                            <Text style={styles.text2}>케이트</Text>
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
                    <Text style={styles.text1}>추천 메시지</Text>
                    <Text style={styles.text1}>옵션 선택:</Text>
                    <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row' }}>
                            {['재해', '날씨 보고', '미세먼지', '없음'].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.option,
                                        selectedButton == item && styles.selectedButton,
                                    ]}
                                    onPress={() => handlePress(item)}
                                >
                                    <Text style={[styles.buttonText, selectedButton === item && styles.selectedText,]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={styles.divider}></View>
                    <Text style={styles.text1}>출력</Text>
                    <View style={styles.messageBox}>
                    <Text style={styles.messageText}>{message}</Text>
                    </View>

                    <Image
                        source={require('../../assets/bichon.png')} // 캐릭터 이미지 경로
                        style={styles.characterImage}
                    />
                    <View style={styles.copy_view}>
                        <TouchableOpacity
                            style={styles.copy_button} onPress={copyToClipboard}>
                            <Text style={styles.copyText}>복사하기</Text>
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
    box: {
        backgroundColor: '#ffffff',
        padding: 15,
    },
    buttonText: {
        fontFamily: 'NanumSquareRoundEB',
        fontWeight: '600',
    },
    copy_view: {
        paddingBottom: 35
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
        padding: 8,
        borderRadius: 8,
        paddingHorizontal: 18,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 4, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
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
        fontFamily: 'GeumUnBohwa',
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 20,
    },
    characterImage: {
        width: 100,
        height: 100,
        marginBottom: -15, // 말풍선과 겹치도록 조정
        zIndex: 1,
      },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    safeArea: {
        backgroundColor: "#fff",
        flex: 1,
    },
    selectedButton: {
        backgroundColor: '#41BA6B',
    },
    selectedText: {
        fontFamily: 'NanumSquareRoundEB',
        color: 'white',
    },
    text1: {
        fontFamily: 'NanumSquareRoundEB',
        fontSize: 17,
        marginVertical: 7,
        fontWeight: 'bold'
    },
    text2: {
        fontFamily: 'NanumSquareRoundB',
        fontSize: 17,
        marginVertical: 7,
        color: '#777'
    },
    text3: {
        fontFamily: 'NanumSquareRoundE',
        marginVertical: 3,
        fontSize: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -10
    },
    copyText: {
        fontFamily: 'NanumSquareRoundEB',
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    }
});