import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useGoogleAuth } from '../services/googleAuth';
import { handleKakaoLogin } from '../services/kakaoAuth';

export default function LoginScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Own Account</Text>
      <Text style={styles.subtitle}>
        Stay connected with your loved ones and make it easier to send greetings and check in.
      </Text>

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
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
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
