import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Switch, Image } from 'react-native';
import { useGoogleAuth } from '../services/googleAuth';
import { handleKakaoLogin } from '../services/kakaoAuth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // 이름 필드 추가
  const [nickname, setNickname] = useState(''); // 닉네임 필드 추가
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 관리
  const [isRemembered, setIsRemembered] = useState(false); // 로그인 상태 유지
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false); // 비밀번호 재설정 모달 상태 관리
  const { promptAsync, handleGoogleLogin, response } = useGoogleAuth();

  useEffect(() => {
    const loadEmail = async () => {
      const savedEmail = await AsyncStorage.getItem("savedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    };
    loadEmail();
  }, []);

  // 로그인 상태 유지 데이터 저장 함수
  const saveLoginState = async (userCredential) => {
    if (isRemembered) {
      await AsyncStorage.setItem('authToken', userCredential.user.uid);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7일 후 만료
      await AsyncStorage.setItem('tokenExpiry', expiryDate.toString());
    }
  };

  // expo go 앱에서 지원 X 
  useEffect(() => {
    const processGoogleLogin = async () => {
      if (response?.type === "success") {
        try {
          const result = await handleGoogleLogin();
          if (result.success) {
            navigation.replace('Main');
          }
        } catch (error) {
          Alert.alert("로그인 실패", error.message);
        }
      }
    };
    
    processGoogleLogin();
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
      if (isRemembered) {
        await saveLoginState(userCredential);
      }
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

  // 비밀번호 재설정
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("오류", "이메일을 입력하세요.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("비밀번호 재설정 이메일 발송", "입력한 이메일로 비밀번호 재설정 링크를 보냈습니다.");
    } catch (error) {
      console.error("비밀번호 재설정 실패:", error);
      Alert.alert("오류", error.message);
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
      <Text style={styles.title}>SayHello</Text>
      <Text style={styles.subtitle}>
        사랑하는 사람과 연락을 주고받는 방법을 찾고 계신가요?
        {'\n'}지금 바로 시작하세요!
      </Text>

      <TextInput
        style={styles.input}
        placeholder="이메일을 입력해주세요"
        placeholderTextColor={styles.placeholderColor.color}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* 비밀번호 입력 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor={styles.placeholderColor.color}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* 로그인 상태 유지 슬라이드 스위치 */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>로그인 상태 유지</Text>
        <Switch
          value={isRemembered}
          onValueChange={(value) => setIsRemembered(value)}
          trackColor={{ false: "#ccc", true: "#4CAF50" }}
          thumbColor={isRemembered ? "#fff" : "#f4f3f4"}
        />
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      {/* 비밀번호 재설정 | 회원가입 */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
          <Text style={styles.link}>비밀번호 재설정</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={[styles.link]}>회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* 구분선 */}
      <View style={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        width: '100%',
        marginVertical: 20,
        }} 
      />
       {/* SNS 계정으로 로그인 */}
      <View style={styles.socialLoginContainer}>
        <Text style={styles.socialLoginTitle}>SNS 계정으로 로그인</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '50%', marginTop: 20 }}>
          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity onPress={handleKakao}>
            <Image
              source={require('../../assets/kakao_login.png')} // 카카오 로그인 이미지 경로
              style={styles.socialImage}
            />
          </TouchableOpacity>
          {/* 구글 로그인 버튼 */}
          <TouchableOpacity onPress={() => promptAsync()}>
            <Image
              source={require('../../assets/google_login.png')} // 구글 로그인 이미지
              style={styles.socialImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 회원가입 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>회원가입</Text>
            
            {/* 이름 입력 */}
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력해주세요"
              placeholderTextColor={styles.placeholderColor.color}
              value={name}
              onChangeText={(text) => setName(text)}
            />

            {/* 닉네임 입력 */}
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor={styles.placeholderColor.color}
              value={nickname}
              onChangeText={(text) => setNickname(text)}
            />

            {/* 이메일 입력 */}
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor={styles.placeholderColor.color}
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* 비밀번호 입력 */}
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor={styles.placeholderColor.color}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              style={[styles.button, styles.signUpButton]}
              onPress={handleSignUp}
            >
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>

            {/* 모달 닫기 버튼 */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.closeButton]}>닫기</Text>
            </TouchableOpacity>
        
          </View>
        </View>
      </Modal>

      {/* Forgot Password 모달 */}
      <Modal animationType="slide"
        transparent={true}
        visible={forgotPasswordVisible}
        onRequestClose={() => setForgotPasswordVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              비밀번호 찾기
            </Text>

            <Text style={styles.modalInfo}>
              등록된 이메일 주소로 
              {'\n'}비밀번호 재설정 링크를 보내드립니다.
              {'\n'}회원님 이메일을 확인하신 후, 12시간 이내에
              {'\n'}비밀번호 재설정을 완료해주세요.
            </Text>

            {/* 이메일 입력 */}
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor={styles.placeholderColor.color}
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* 비밀번호 재설정 버튼 */}
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.buttonText]}>
                인증 메일 받기
              </Text>
            </TouchableOpacity>

            {/* 닫기 버튼 */}
            <TouchableOpacity onPress={() => setForgotPasswordVisible(false)}>
              <Text style={[styles.closeButton]}>
                닫기
              </Text>
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
    backgroundColor: '#F5FBEF',
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
  placeholderColor: {
    color: '#abb4bd',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'left',
  },
  
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButton: { 
    backgroundColor: "#4CAF50" 
  },
  signUpButton: { 
    backgroundColor: "#007BFF",
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: "#007BFF",
    marginTop: 10,
  },
  socialLoginContainer: {
    marginTop: 20 
  },
  socialButton: { 
    paddingVertical: 10, 
    borderRadius: 5, 
    alignItems: "center", 
    marginBottom: 10 
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    width: '48%',
  },

  googleButton: {
    backgroundColor: '#4285F4',
    width: '48%',
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
    // alignItems: 'center',
  },

  modalTitle:{
    fontSize :18 ,
    fontWeight:"bold",
    marginBottom: 30,
    textAlign: 'center',
  },

  modalInfo:{
    color: "#808080",
    marginBottom: 20,
    textAlign: 'center',
  },

  modalButtonText:{
     color:'#fff'
  },
  
  modalButton:{
    backgroundColor:'#007BFF'
  },
  
  closeButton:{
    marginTop :5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '20%',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'red',
  },
  closeButtonLabel :{
    color:'red'
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  link: {
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  socialLoginContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  socialLoginTitle:{
    fontSize:"15"
  },
  socialImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginVertical: 10,
    marginHorizontal: 15,
  },

});