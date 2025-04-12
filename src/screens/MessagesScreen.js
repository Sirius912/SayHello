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
            Mugunghwa: require('../../assets/fonts/radioFont.ttf'),
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
        '재해': `할아버지와 할머니께 😊
지진 이후에 두 분 다 잘 계시죠? 많이 놀라셨을 텐데, 별일 없으셨길 정말 바라요!!
오늘은 날씨가 좀 쌀쌀해요🥶 기온은 4도고, 비 올 확률은 2%밖에 안 되지만 습도가 68%라서 조금 습하게 느껴질 수도 있을 것 같아요.
바람은 시속 2m로 살랑살랑 불고 있어요🍃 두 분 꼭 따뜻하게 입고 건강 잘 챙기세요🧣🧤
항상 많이 사랑하고 곧 소식 들을 수 있으면 좋겠어요!💕
몸 조심하시고 또 연락드릴게요! 😊💌`,

        '날씨 보고': `할머니, 할아버지께 😊
오늘의 날씨를 알려드립니다. 현재 기온은 18°C로 선선하며, 구름이 약간 낀 흐린 날씨입니다.☁
강수 확률은 20%이며 미세먼지 수치는 '보통' 단계입니다. 산책하시기에 좋은 날씨지만, 가벼운 외투를 준비하시면 좋을 것 같습니다. 🥹
항상 건강에 유의하시고, 다음에 뵐 때까지 행복한 일들만 가득하시길 바랍니다. 😊💌`,

        '미세먼지': `사랑하는 할머니와 할아버지! 😊
오늘 미세먼지 수치가 '나쁨' 수준으로 올라갔습니다. 외출 시 마스크를 꼭 착용하시고, 😷
가능한 실내에서 보내시는 것이 좋을 것 같습니다. 공기청정기를 가동해두시고 창문은 닫아두세요. 🪟
건강 관리에 특히 신경 써주시길 부탁드립니다. 항상 건강하세요! 😊💌`,

        '없음': `사랑하는 할아버지, 😊
항상 건강하신지요? 오늘은 특별한 소식 없이 안부를 전하고 싶어 편지를 씁니다. 
요즘 날씨가 추워지고 있으니 감기 조심하시고, 건강 관리에 유의하세요.
곧 찾아뵐 수 있기를 바라며, 그때까지 행복한 일들만 가득하시길 바랍니다.
항상 건강하세요! 😊💌`
    };

    const message = selectedButton ? messages[selectedButton] : "안부를 전달할 메시지 내용을 선택해주세요!";

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
                                    <Text style={styles.text2}>재해</Text>
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
                        </View>
                        <View style={styles.shadowView}>

                        <Text style={styles.text1}>메시지 미리보기</Text>
                        <View style={styles.divider}></View>
                        <View>
                            <Text style={styles.messageText}>{message}</Text>
                        </View>
                    </View>
                    <View style={styles.copy_view}>
                        <TouchableOpacity
                            style={styles.copy_button} onPress={copyToClipboard}>
                            <Text style={styles.copyText}>복사</Text>
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
        marginTop: 10,
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
    copyText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'NanumSquareRoundEB',
      },
    messageText: {
        padding: 5,
        // backgroundColor: '#41BA6B',
        marginTop: 3,
        fontFamily: 'Mugunghwa',
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 20,
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
});