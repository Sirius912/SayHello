import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../api/firebase'; // Firebase 설정 파일
import LocationPicker from '../api/LocationPicker';
import HealthInfoPicker from '../api/HealthInfoPicker';
import { getAuth } from 'firebase/auth';

export default function EditPersonScreen({ route, navigation }) {
    const { contactId } = route.params; // PeopleScreen에서 전달받은 연락처 ID
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedHealthInfo, setSelectedHealthInfo] = useState(null);
    const [selectedRelationship, setSelectedRelationship] = useState(null);
    const [selectedContactTerm, setSelectedContactTerm] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                // console.log("Fetching contact:", contactId);
                // console.log("Document path:", `users/${user.uid}/contacts/${contactId}`);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name);
                    setPhoneNumber(data.phone);
                    setSelectedLocation(data.location);
                    setSelectedHealthInfo(data.healthInfo);
                    setSelectedRelationship(data.relationship);
                    setSelectedContactTerm(data.contactTerm.split(', '));
                } else {
                    Alert.alert('오류', '문서를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('Error fetching contact:', error);
                Alert.alert('오류', '데이터를 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false); // 로딩 상태 해제
            }
        };

        fetchContact();
    }, [contactId]);

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
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {/* 이름 입력 */}
            <View style={styles.type_view}>
                <Text style={styles.text1}>이름</Text>
                <TextInput
                    style={styles.type_input}
                    placeholder='이름을 입력하세요.'
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={styles.divider}></View>

            {/* 전화번호 입력 */}
            <View style={styles.type_view}>
                <Text style={styles.text1}>전화번호</Text>
                <TextInput
                    style={styles.type_input}
                    placeholder='전화번호를 입력하세요.'
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>
            <View style={styles.divider}></View>

            {/* 위치 선택 */}
            <View style={styles.type_view}>
                <Text style={styles.text1}>지역</Text>
                <LocationPicker
                    onSelect={setSelectedLocation}
                    initialValue={selectedLocation}
                />
            </View>
            <View style={styles.divider}></View>

            {/* 관계 선택 */}
            <View>
                <Text style={styles.sectionTitle}>관계</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                </ScrollView>
            </View>
            <View style={styles.divider}></View>

            {/* 건강 정보 선택 */}
            <View style={styles.type_view}>
                <Text style={styles.text1}>건강 정보</Text>
                <HealthInfoPicker
                    onSelect={setSelectedHealthInfo}
                    initialValue={selectedHealthInfo}
                />
            </View>
            <View style={styles.divider}></View>

            {/* 연락 주기 선택 */}
            <View>
                <Text style={styles.sectionTitle}>연락 주기</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['1일', '3일', '1주', '1개월', '3개월'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.option,
                                selectedContactTerm.includes(item) && styles.selectedButton
                            ]}
                            onPress={() => toggleContactTerm(item)}
                        >
                            <Text style={[
                                styles.buttonText,
                                selectedContactTerm.includes(item) && styles.selectedText
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* 저장 버튼 */}
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>프로필 수정 완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    type_view: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    text1: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    type_input: {
        flex: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
    },
    selectedButton: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    selectedText: {
        color: '#fff',
    },
    buttonText: {
        fontSize: 14,
    },
    saveButtonContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    saveButton: {
        backgroundColor: '#41BA6B',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderRadius: 10,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
