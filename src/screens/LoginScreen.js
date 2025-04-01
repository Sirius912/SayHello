import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useGoogleAuth } from '../services/googleAuth';
import { handleKakaoLogin } from '../services/kakaoAuth';
import { auth } from '../api/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';


export default function LoginScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        // 아이디가 없으면 회원가입 진행
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = newUserCredential.user;
          Alert.alert('회원가입 성공!', `사용자 이메일: ${newUser.email}`);
          navigation.replace('Main');
        } catch (signupError) {
          console.error("회원가입 실패:", signupError); // 회원가입 실패 로그 출력
          Alert.alert('회원가입 실패', signupError.message);
        }
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('로그인 실패', '비밀번호가 잘못되었습니다.');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert(
          '로그인 실패',
          '잘못된 자격 증명입니다. Firebase 초기화를 확인하세요.'
        );
      } else {
        Alert.alert('로그인 실패', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Own Account</Text>
      <Text style={styles.subtitle}>
        Stay connected with your loved ones and make it easier to send greetings and check in.
      </Text>
      {/* 이메일 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      {/* 이메일 로그인 버튼 */}
      <TouchableOpacity
        style={[styles.button, styles.emailButton]}
        onPress={handleEmailLogin}
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

      {userInfo && (
        <View style={styles.userInfo}>
          <Text>Logged in as:</Text>
          <Text>{userInfo.name || userInfo.properties.nickname}</Text>
          <Text>{userInfo.email || 'No email provided'}</Text>
        </View>
      )}
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
});
