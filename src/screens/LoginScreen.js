import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useGoogleAuth } from '../services/googleAuth';
import { handleKakaoLogin } from '../services/kakaoAuth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // 이름 필드 추가
  const [nickname, setNickname] = useState(''); // 닉네임 필드 추가
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 관리
  const [isSignUpMode, setIsSignUpMode] = useState(false); // 로그인/회원가입 모드 관리
  const { promptAsync, handleGoogleLogin, response } = useGoogleAuth();

  useEffect(() => {
    const processLogin = async () => {
      if (response?.type === "success") {
        try {
          const result = await handleGoogleLogin();
          if (result.success) {
            setUserInfo(result.user);
            Alert.alert("로그인 성공!", `사용자 정보: ${result.user.name}`);
            navigation.replace('Main');
          }
        } catch (error) {
          Alert.alert("로그인 실패", error.message);
        }
      }
    };
    processLogin();
  }, [response]);

  const handleKakao = async () => {
    try {
      const result = await handleKakaoLogin();
      if (result.success) {
        setUserInfo(result.user);
        Alert.alert("로그인 성공!", `사용자 정보: ${result.user.properties.nickname}`);
        navigation.replace('Main');
      }
    } catch (error) {
      Alert.alert("로그인 실패", error.message);
    }
  };

  const handleEmailLogin = async () => {
    try {
      // 이메일/비밀번호로 로그인 시도
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('로그인 성공!', `사용자 이메일: ${user.email}`);
      navigation.replace('Main');
    } catch (error) {
      console.error("로그인 실패:", error); // 전체 오류 로그 출력
      if (error.code === 'auth/user-not-found') {
        Alert.alert('로그인 실패', '사용자를 찾을 수 없습니다. 회원가입을 진행하세요.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('로그인 실패', '비밀번호가 잘못되었습니다.');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert( // 잘못된 자격 증명 오류 처리
          '로그인 실패',
          '사용자를 찾을 수 없습니다. 회원가입을 진행하세요.'
        );
      } else {
        Alert.alert('로그인 실패', error.message);
      }
    }
  };

  const handleSignUp = async () => {
    try {
      // 이메일/비밀번호로 회원가입 시도
      const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = newUserCredential.user;

      // Firestore에 추가 정보를 저장
      await setDoc(doc(db, "users", newUser.uid), {
        name: name,
        nickname: nickname,
        email: email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('회원가입 성공!', `사용자 이메일: ${newUser.email}`);
      navigation.replace('Main');
    } catch (signupError) {
      console.error("회원가입 실패:", signupError); // 회원가입 실패 로그 출력
      Alert.alert('회원가입 실패', signupError.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Own Account</Text>
      <Text style={styles.subtitle}>
        Stay connected with your loved ones and make it easier to send greetings and check in.
      </Text>

      {/* 이메일 로그인 버튼 */}
      <TouchableOpacity
        style={[styles.button, styles.emailButton]}
        onPress={() => setModalVisible(true)} // 모달 열기
      >
        <Text style={styles.buttonText}>이메일 로그인</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.kakaoButton]}
        onPress={handleKakao}
      >
        <Text style={styles.buttonText}>카카오 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>구글 로그인</Text>
      </TouchableOpacity>

      {/* 로그인/회원가입 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isSignUpMode ? "회원가입" : "로그인"}
            </Text>
            
            {/* 회원가입 모드에서만 추가 정보 입력 */}
            {isSignUpMode && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>이름</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChangeText={(text) => setName(text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>닉네임</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChangeText={(text) => setNickname(text)}
                  />
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="이메일을 입력하세요"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
            </View>

            {/* 버튼 스타일 개선 */}
            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={isSignUpMode ? handleSignUp : handleEmailLogin}
            >
              <Text style={[styles.buttonText, styles.modalButtonText]}>
                {isSignUpMode ? "회원가입" : "로그인"}
              </Text>
            </TouchableOpacity>

            {/* 모드 전환 버튼 */}
            <TouchableOpacity
              onPress={() => setIsSignUpMode(!isSignUpMode)} // 모드 변경
            >
              <Text style={[styles.switchMode]}>
                {isSignUpMode ? "이미 계정이 있으신가요? 로그인하기" : "계정이 없으신가요? 회원가입하기"}
              </Text>
            </TouchableOpacity>

            {/* 닫기 버튼 */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)} // 모달 닫기
              style={[styles.closeButton]}
            >
              <Text style={[styles.closeButtonLabel]}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },

  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },

  emailButton: {
    backgroundColor: '#4CAF50',
  },

  kakaoButton: {
    backgroundColor: '#FEE500',
  },

  googleButton: {
    backgroundColor: '#4285F4',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },

  modalTitle:{
    fontSize :18 ,
    fontWeight:"bold",
    marginBottom :10
  },

  modalButtonText:{
     color:'#fff'
   },
  
   modalButton:{
      backgroundColor:'#007BFF'
   },
  
   closeButton:{
     marginTop :10
   },
   closeButtonLabel :{
     color:'red'
},
switchMode:{
color:"#007BFF"}
});