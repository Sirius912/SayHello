import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Alert, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../api/firebase';
import { getAuth } from 'firebase/auth';
import { Swipeable } from 'react-native-gesture-handler';
import useFonts from '../hooks/useFonts';

const PeopleScreen = ({ navigation }) => {

    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]); // 필터링된 데이터
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedButton, setSelectedButton] = useState('전체'); // 기본값 '전체'
    const fontsLoaded = useFonts();

    // Firestore 실시간 업데이트 설정
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error("사용자가 로그인되어 있지 않습니다.");
            return;
        }

        const userId = user.uid; // 현재 로그인한 사용자의 uid
        const contactsRef = collection(db, `users/${userId}/contacts`);

        const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
            const contactsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContacts(contactsData);
            setFilteredContacts(contactsData);
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    }, []);

    if (!fontsLoaded){
      return null;
    }


    // 검색 및 필터링
    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text === '') {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter((contact) =>
                contact.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredContacts(filtered);
        }
    };


    const handlePress = (buttonName) => {
        // console.log("선택된 버튼:", buttonName);
        // console.log("전체 연락처 데이터:", contacts);
        setSelectedButton(buttonName); // 선택된 필터 업데이트

        if (buttonName === '전체') {
            setFilteredContacts(contacts); // 전체 데이터 표시
        } else {
            const filtered = contacts.filter((contact) => contact.relationship?.trim() === buttonName.trim());
            // console.log("필터링된 데이터:", filtered);
            setFilteredContacts(filtered);
        }
    };

    const handleDeleteContact = async (contactId) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert("알림", "로그인이 필요합니다.");
            return;
        }

        const userId = user.uid;

        try {
            await deleteDoc(doc(db, `users/${userId}/contacts`, contactId));
            Alert.alert("알림", "연락처가 성공적으로 삭제되었습니다!");
            setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId));
        } catch (error) {
            console.error("연락처 삭제 실패:", error);
            Alert.alert("실패", "연락처를 삭제하는 데 실패했습니다.");
        }
    };

    // 오른쪽 스와이프 액션 렌더링
    const renderRightActions = (contactId) => (
        <View style={styles.rightActions}>
            <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => navigation.navigate('EditPersonScreen', { contactId })}
            >
                <Ionicons name="create-outline" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteContact(contactId)}
            >
                <Ionicons name="trash-outline" size={30} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <Image
                source={require('../../assets/headerTab_v.png')}
                style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}
            />
            <View style={styles.box}>
                <Text style={styles.title}>주소록 설정</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#777" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="찾고자 하는 사람의 이름을 입력하세요"
                        placeholderTextColor="#999"
                    />
                </View>
                <View>
                    <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {/* 필터 탭 (기존 로직 유지) */}
                        <View style={{ flexDirection: 'row' }}>
                            {['전체', '친구', '가족', '직장', '기타'].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.option,
                                        selectedButton === item && styles.selectedButton
                                    ]}
                                    onPress={() => handlePress(item)}
                                >
                                    <Text style={[styles.buttonText, selectedButton === item && styles.selectedText]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.shadowView}>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    {filteredContacts.map((contact) => (
                        <Swipeable
                            key={contact.id}
                            renderRightActions={() => renderRightActions(contact.id)}
                        >
                            <View style={styles.contactItem}>
                                <Image
                                    source={contact.image ? { uri: contact.image } : require('../../assets/default.jpg')} // 임시 이미지
                                    style={styles.photo}
                                />
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                                    <Text style={styles.contactRelationship}>{contact.relationship || '기타'}</Text>
                                </View>
                            </View>
                        </Swipeable>
                    ))}
                </ScrollView>
                </View>
            </View>

            {/* 새 지인 추가 버튼 */}
            <View style={styles.add_person_view}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddPersonScreen')}
                    style={styles.add_person_button}
                >
                    <Text style={styles.addPersonText}>새로운 사람 등록하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily: 'NanumSquareRoundEB',
      marginBottom: 5,
    },
    shadowView: {
        marginHorizontal: 0,
        marginTop: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flex: 1
      },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: "#333",
      },
    icon: {
      marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#828282',
    },
    add_person_view: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 15,
        backgroundColor: 'white',
    },
    addPersonText: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 20,
      fontWeight: '600',
      fontFamily: 'NanumSquareRoundEB',
    },
    add_person_button: {
        backgroundColor: '#41BA6B',
        padding: 8,
        borderRadius: 8,
        paddingHorizontal: 18,
        width: '95%',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
    },
    buttonText: {
      fontFamily: 'NanumSquareRoundB',
      fontWeight: '600',
    },
    box: {
        backgroundColor: 'white',
        paddingTop: 0,
        padding: 15,
        paddingBottom: -15,
        flex: 11
    },
    edit_button: {
        backgroundColor: '#4CAF50',
        padding: 4,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    edit_button_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    option: {
        padding: 5,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginRight: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
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
    rightActions: {
        backgroundColor: "white",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        paddingVertical: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    contactInfo: {
        flex: 1,
        marginLeft: 12,
    },
    contactName: {
      fontFamily: 'NanumSquareRoundEB',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    contactPhone: {
        fontFamily: 'NanumSquareRoundR',
        fontSize: 16,
        color: '#6c757d',
    },
    contactRelationship: {
        fontFamily: 'NanumSquareRoundB',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    actionButton: {
        flexGrow: .5,
        marginHorizontal: 5
    },
});

export default PeopleScreen;