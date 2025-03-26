import React, { useState, useEffect } from 'react';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import * as AuthSession from "expo-auth-session";

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true, // Expo Go 환경에서 Proxy 사용
});
console.log("Redirect URI:", redirectUri);

WebBrowser.maybeCompleteAuthSession();

const KAKAO_CLIENT_ID = "cbbc2ed9e711a63c37923983deea50a9";
const KAKAO_REDIRECT_URI = "https://auth.expo.io/@taehoo/SayHello";

export default function LoginScreen({ navigation }) {

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "1018343746579-2js033oh704kg1mkr8vjb3s9t53ot5u8.apps.googleusercontent.com", // 안드로이드 클라이언트 ID
    webClientId: "1018343746579-0rrlhl9e6g14u5kgud6mdo4grq4q5rbf.apps.googleusercontent.com",
    iosClientId: "1018343746579-dpcs1lhg0deftabhf4kk8p8u037mmg55.apps.googleusercontent.com",
    expoClientId: "1018343746579-8is4mh5v99cv5ngpprodlc7pej8lphnb.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    useProxy: true,
    // redirectUri: "https://auth.expo.io/@taehoo/SayHello",
  });

  const [userInfo, setUserInfo] = useState(null);

  const handleKakaoLogin = async () => {
    // 카카오 로그인 로직 추가 예정
    navigation.replace('Main'); // 임시로 메인 스크린
    console.log('카카오 로그인');
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "your-app-scheme", // 앱 스키마 설정
      });
      console.log("Redirect URI:", redirectUri);
      
      const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl);


      console.log("카카오 로그인 결과:", result);

      if (result.type === "success") {
        const code = result.url.split("code=")[1];

        const tokenResponse = await axios.post(
          "https://kauth.kakao.com/oauth/token",
          {
            grant_type: "authorization_code",
            client_id: KAKAO_CLIENT_ID,
            redirect_uri: KAKAO_REDIRECT_URI,
            code: code,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const user = userResponse.data;
        await AsyncStorage.setItem("@kakao_user", JSON.stringify(user));
        setUserInfo(user);
        console.log("카카오 유저 정보:", user);
        Alert.alert("로그인 성공!", `사용자 정보: ${user.properties.nickname}`);
        navigation.replace('Main');
      }
    } catch (error) {
      console.error(error);
      Alert.alert("로그인 실패", "카카오 로그인을 처리하는 중 오류가 발생했습니다.");
    }
  };

  const handleGoogleLogin = async () => {
    navigation.replace('Main'); // 임시로 메인 스크린
    console.log("Google OAuth 요청 URL:", request?.url);
    console.log("Redirect URI:", request?.redirectUri);
    const storedUser = await AsyncStorage.getItem("@user");
    if (!storedUser) {
      if (response?.type === "success") {
      await getUserInfo(response.authentication?.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(storedUser));
    }

  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
      console.log("유저 정보:", user);
      navigation.replace("Main");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@user");
    setUserInfo(null);
    console.log("로그아웃 완료");
  };

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleLogin();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Own Account</Text>
      <Text style={styles.subtitle}>
        Stay connected with your loved ones and make it easier to send greetings and check in.
      </Text>

      <TouchableOpacity style={[styles.button, styles.kakaoButton]} 
      onPress={() => {
        console.log("카카오 로그인 버튼 클릭됨"); // 디버깅 로그 추가
        handleKakaoLogin();
      }}
      >
        <Text style={styles.buttonText}>카카오 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={() => promptAsync()}
        disabled={!request} // 요청 준비가 안되었을 때 비활성화
      >
        <Text style={styles.buttonText}>구글 로그인</Text>
      </TouchableOpacity>

      {userInfo && (
        <TouchableOpacity style={[styles.button]} onPress={handleLogout}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
      )}

      {/* 유저 정보 출력 */}
      {userInfo && (
        <View style={styles.userInfo}>
          <Text>Logged in as:</Text>
          <Text>{userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
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
