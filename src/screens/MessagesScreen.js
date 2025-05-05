import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Clipboard, SafeAreaView } from 'react-native';
import useFonts from '../hooks/useFonts';
import { fetchOpenAIMessage } from '../api/openai';

export default function MessageScreen() {
    const [selectedButton, setSelectedButton] = useState(null);
    const [message, setMessage] = useState("안부를 전달할 메시지 내용을 선택해주세요!");
    const fontsLoaded = useFonts();
    const [loading, setLoading] = useState(false);

    if (!fontsLoaded) {
        return null;
    }

    const handlePress = async (item) => {
        if (selectedButton === item) {
            setSelectedButton(null);
            setMessage("안부를 전달할 메시지 내용을 선택해주세요!");
            return;
        }

        setSelectedButton(item);
        setLoading(true);

        try {
            const generatedMessage = await fetchOpenAIMessage(item);
            setMessage(generatedMessage);
        } catch (error) {
            console.error(error);
            Alert.alert('오류', '메시지 생성 중 문제가 발생했습니다.');
            setMessage("메시지를 생성할 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

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
                    <Image
                        source={require('../../assets/logo_image.png')} // 캐릭터 이미지 경로
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
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
                                        disabled={loading}
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
                        {loading ? (
                            <ActivityIndicator size="large" color="#41BA6B" />
                        ) : (
                            <ScrollView>
                                <Text style={styles.messageText}>{message}</Text>
                            </ScrollView>
                        )}
                    </View>
                    <View style={styles.copy_view}>
                        <TouchableOpacity style={styles.copy_button} onPress={copyToClipboard} disabled={loading}>
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
        fontFamily: 'NanumSquareRoundEB',
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    box: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    logoImage: {
        position: 'absolute',
        top: '-60%',
        left: '68%',
        width: 30,
        height: 30,
        opacity: 1,
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
        backgroundColor: "#41BA6B",
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