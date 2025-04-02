import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import LocationPicker from "../api/LocationPicker";
import HealthInfoPicker from "../api/HealthInfoPicker";
import { db } from '../api/firebase'; // Firebase 설정 파일 가져오기
import { collection, addDoc } from 'firebase/firestore';

export default function AddPersonScreen({ navigation }) {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedHealthInfo, setSelectedHealthInfo] = useState(null);
    const [selectedRelationship, setSelectedRelationship] = useState(null);
    const [selectedContactTerm, setSelectedContactTerm] = useState([]);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
  
    // 연락 주기 토글 함수
    const toggleContactTerm = (item) => {
      setSelectedContactTerm((prev) =>
        prev.includes(item) ? prev.filter(term => term !== item) : [...prev, item]
      );
    };
  
    // 저장 버튼 핸들러
    const handleSave = async () => {
        if (!name || !phoneNumber) {
            alert('이름과 전화번호를 입력하세요.');
            return;
        }

        try {
            await addDoc(collection(db, 'contacts'), {
                name,
                phone: phoneNumber,
                location: selectedLocation || 'Unknown',
                healthInfo: selectedHealthInfo || 'None',
                relationship: selectedRelationship || 'ETC',
                contactTerm: selectedContactTerm.join(', '),
                image: 'default_image_url', // 이미지 저장 구현 해야함.
            });
            alert('지인이 성공적으로 추가되었습니다.');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('지인을 추가하는 데 실패했습니다.');
        }
    };
  
    return (
      <View style={styles.screen}>
        {/* 프로필 이미지 영역 (기존 디자인 유지) */}
        <View style={styles.profile_image}></View>
        <View style={styles.divider}></View>
  
        {/* 이름 입력 섹션 */}
        <View style={styles.type_view}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.text1}>이름</Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <TextInput 
              style={styles.type_input} 
              placeholder='이름을 입력하세요.'
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
  
        {/* 위치 선택 섹션 */}
        <View style={styles.type_view}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.text1}>지역</Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <LocationPicker onSelect={setSelectedLocation} />
          </View>
        </View>
        <View style={styles.divider}></View>
  
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
          <Text style={{ fontSize: 17, fontWeight: 'bold', marginVertical: 9 }}>Contact Term</Text>
          <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row' }}>
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
            </View>
          </ScrollView>
        </View>
  
        {/* 저장 버튼 (기존 디자인 유지) */}
        <View style={styles.add_person_view}>
          <TouchableOpacity
            style={styles.add_person_button}
            onPress={handleSave}
          >
            <Text style={{ color: '#ffffff', fontSize: 16 }}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  add_person_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#ffffff'
  },
  add_person_button: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: 'center'
  },
  buttonText: {
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
    marginHorizontal: 4,        // space between butons
    paddingHorizontal: 12       // space between text and border
  },

  profile_image: {
    height: 100,
    backgroundColor: '#ccc'
  },
  selectedButton: {
    backgroundColor: 'black',
  },
  selectedText: {
    color: 'white',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  text1: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 17,
    marginVertical: 7,
    color: '#777'
  },
  type_input: {
    marginVertical: 7,
    fontSize: 16
  },
  type_view: {
    flexDirection: 'row',
  },
});