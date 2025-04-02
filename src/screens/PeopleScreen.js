import React, { useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';

const PeopleScreen = ({ navigation }) => {

  const [contacts, setContacts] = useState([]);
  const [selectedButton, setSelectedButton] = useState();

  // Firestore 실시간 업데이트 설정
  useEffect(() => {
      const contactsRef = collection(db, 'contacts'); // 'contacts' 컬렉션 참조
      const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
          const contactsData = snapshot.docs.map(doc => ({
              id: doc.id, // 문서 ID
              ...doc.data(), // 문서 데이터
          }));
          setContacts(contactsData); // 상태 업데이트
      });

      return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  // 버튼 선택 핸들러 (기존 로직 유지)
  const handlePress = (buttonName) => {
      setSelectedButton(selectedButton === buttonName ? null : buttonName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.box}>
            <View>
                <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {/* 필터 탭 (기존 로직 유지) */}
                    <View style={{ flexDirection: 'row' }}>
                        {['친구', '가족', '직장', '기타'].map((item) => (
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

            {/* 지인 목록 렌더링 (Firestore 데이터 반영) */}
            <ScrollView showsHorizontalScrollIndicator={false}>
                {contacts.map((contact) => (
                    <View key={contact.id} style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image 
                            source={contact.image ? { uri: contact.image } : require('../../assets/mom.png')} 
                            style={styles.photo} 
                        />
                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{contact.name}</Text>
                                <Text style={{ fontSize: 16 }}>{contact.phone}</Text>
                            </View>
                            <View style={styles.edit_button_view}>
                                <TouchableOpacity
                                    style={styles.edit_button}
                                    onPress={() => navigation.navigate('EditPersonScreen', { contactId: contact.id })}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: 18 }}>편집</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>

        {/* 새 지인 추가 버튼 */}
        <View style={styles.add_person_view}>
            <TouchableOpacity
                onPress={() => navigation.navigate('AddPersonScreen')}
                style={styles.add_person_button}
            >
                <Text style={{ color: '#ffffff', fontSize: 16 }}>새 지인 추가</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    add_person_view: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#ffffff'
    },
    add_person_button: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 8,
        paddingHorizontal: 18,
        justifyContent: 'center'
    },
    buttonText: {
        fontWeight: '600',
    },
    box: {
        backgroundColor: '#ffffff',
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
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: -10,
    },
    option: {
        padding: 5,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginHorizontal: 4,        // space between butons
        paddingHorizontal: 12       // space between text and border
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#000000',
    },
    safeArea: {
        backgroundColor: "#fff",
        flex: 1,
    },
    selectedButton: {
        backgroundColor: 'black',
    },
    selectedText: {
        color: 'white',
    },
});

export default PeopleScreen;