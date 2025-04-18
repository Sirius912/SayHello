import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Modal, ImageBackground, Image } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../api/firebase'; // Firebase 설정 파일
import HealthInfoPicker from '../components/HealthInfoPicker';
import { getAuth } from 'firebase/auth';
import AddressSearch from '../components/AddressSearch';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pickImage } from "../utils/imagePicker";
import { Feather } from '@expo/vector-icons';

export default function EditPersonScreen({ route, navigation }) {
    const { contactId } = route.params; // PeopleScreen에서 전달받은 연락처 ID
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedHealthInfo, setSelectedHealthInfo] = useState(null);
    const [selectedRelationship, setSelectedRelationship] = useState(null);
    const [selectedContactTerm, setSelectedContactTerm] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false); // 모달 상태 관리
    const [imageUri, setImageUri] = useState(null);

    // Firestore에서 연락처 데이터 불러오기
    useEffect(() => {
        const fetchContact = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert('오류', '로그인이 필요합니다.');
                return;
            }

            const userId = user.uid;
            try {
                const docRef = doc(db, `users/${userId}/contacts`, contactId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name);
                    setPhoneNumber(data.phone);
                    setSelectedLocation(data.location);
                    setSelectedHealthInfo(data.healthInfo);
                    setSelectedRelationship(data.relationship);
                    setSelectedContactTerm(data.contactTerm.split(', '));
                    setImageUri(data.image);
                    // console.log("Fetched image URI:", data.imageUri);
                } else {
                    Alert.alert('오류', '문서를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('Error fetching contact:', error);
                Alert.alert('오류', '데이터를 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContact();
    }, [contactId]);

    const handlePickImage = async () => {
        const uri = await pickImage();
        if (uri) {
            setImageUri(uri); // 선택된 이미지 URI를 상태로 저장
        }
    };

    // 저장 버튼 핸들러
    const handleSave = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('오류', '로그인이 필요합니다.');
            return;
        }

        const userId = user.uid;

        if (!name || !phoneNumber) {
            Alert.alert('오류', '이름과 전화번호는 필수 입력 항목입니다.');
            return;
        }

        try {
            const docRef = doc(db, `users/${userId}/contacts`, contactId);
            await updateDoc(docRef, {
                name,
                phone: phoneNumber,
                location: selectedLocation,
                healthInfo: selectedHealthInfo,
                relationship: selectedRelationship,
                contactTerm: selectedContactTerm.join(', '),
                imageUri: imageUri,
            });
            Alert.alert('성공', '변경 사항이 저장되었습니다.');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating document:', error);
            Alert.alert('오류', '저장에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <ScrollView showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <ImageBackground
                    source={require('../../assets/headerTab_round.png')}
                    style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' }}
                    resizeMode="cover">
                    <Text style={styles.title}>프로필 수정</Text>
                </ImageBackground>
                <View style={styles.screen}>
                    {/* 프로필 이미지 영역*/}
                    <View style={styles.profile_image_container}>
                        <TouchableOpacity onPress={handlePickImage}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.profile_image} />
                            ) : (
                                <Image source={require('../../assets/default.jpg')}
                                    style={styles.profile_image}
                                />
                            )}
                            <View style={styles.profile_placeholder}>
                                <Feather name="camera" size={30} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider}></View>

                    {/* 이름 입력 섹션 */}
                    <View style={styles.type_view}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={styles.text1}>이름</Text>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <TextInput
                                style={styles.type_input}
                                placeholder={name}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>
                    <View style={styles.divider}></View>

                    {/* 전화번호 입력 섹션 */}
                    <View style={styles.type_view}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={styles.text1}>전화번호</Text>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <TextInput
                                style={styles.type_input}
                                placeholder='전화번호를 입력하세요.'
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                    <View style={styles.divider}></View>

                    {/* 지역 선택 섹션 */}
                    <View style={styles.inputSection}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={styles.label}>주소</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputText}>
                                {selectedLocation ? selectedLocation.address : '주소를 선택하세요'}
                            </Text>
                            <TouchableOpacity
                                style={styles.searchButton}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.searchButtonText}>주소 검색</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.divider}></View>

                    {/* 모달 */}
                    <Modal visible={isModalVisible} animationType="slide">
                        <AddressSearch
                            onSelectAddress={(address) => {
                                setSelectedLocation(address); // 선택된 주소 저장
                                setModalVisible(false); // 모달 닫기
                            }}
                        />
                    </Modal>
                    {/* 관계 선택 섹션 */}
                    <View>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginVertical: 9 }}>관계</Text>
                        <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row' }}>
                                {['친구', '가족', '직장', '기타'].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.option,
                                            selectedRelationship === item && styles.selectedButton
                                        ]}
                                        onPress={() => setSelectedRelationship(item)}
                                    >
                                        <Text style={[
                                            styles.buttonText,
                                            selectedRelationship === item && styles.selectedText
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.divider}></View>

                    {/* 건강 정보 선택 섹션 */}
                    <View style={styles.type_view}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={styles.text1}>건강 정보</Text>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <HealthInfoPicker onSelect={setSelectedHealthInfo} />
                        </View>
                    </View>
                    <View style={styles.divider}></View>

                    {/* 연락 주기 선택 섹션 */}
                    <View>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginVertical: 9 }}>연락 주기</Text>
                        <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row' }}>
                                {['1일', '3일', '1주', '1개월', '3개월'].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.option,
                                            selectedContactTerm == item && styles.selectedButton
                                        ]}
                                        onPress={() => setSelectedContactTerm(item)}
                                    >
                                        <Text style={[
                                            styles.buttonText,
                                            selectedContactTerm == item && styles.selectedText
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                    </View>

                    {/* 저장 버튼 (기존 디자인 유지) */}
                    <View style={styles.add_person_view}>
                        <TouchableOpacity
                            style={styles.add_person_button}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>저장하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'NanumSquareRoundEB',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 60,
    },
    safeArea: {
        backgroundColor: "#41BA6B",
        flex: 1,
    },
    add_person_view: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#ffffff'
    },
    add_person_button: {
        backgroundColor: '#41BA6B',
        padding: 8,
        borderRadius: 10,
        paddingHorizontal: 18,
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: 'NanumSquareRoundB',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 7,
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
    profile_image_container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profile_image: {
        width: 100,
        height: 100,
        borderRadius: 40,
    },
    profile_placeholder: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#41BA6B',
    },
    selectedText: {
        fontFamily: 'NanumSquareRoundB',
        color: 'white',
    },
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,

    },
    text1: {
        fontFamily: 'NanumSquareRoundEB',
        fontSize: 17,
        fontWeight: 'bold',
    },
    type_input: {
        fontFamily: 'NanumSquareRoundR',
        marginVertical: 7,
        fontSize: 16,
        color: 'gray'
    },
    type_view: {
        flexDirection: 'row',
    },
    inputSection: {
        flexDirection: 'row'
    },
    label: {
        fontFamily: 'NanumSquareRoundEB',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    inputRow: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        alignSelf: 'flex-end',
    },
    inputText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    searchButton: {
        marginLeft: 8,
        backgroundColor: '#41BA6B',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    searchButtonText: {
        fontFamily: 'NanumSquareRoundEB',
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'NanumSquareRoundEB',
    },
});