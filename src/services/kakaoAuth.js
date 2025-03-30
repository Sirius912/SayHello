import * as WebBrowser from "expo-web-browser";
import axios from 'axios';
import { saveUserProfile } from '../api/userDatabase';

const KAKAO_CLIENT_ID = "cbbc2ed9e711a63c37923983deea50a9";
const KAKAO_REDIRECT_URI = "https://auth.expo.io/@taehoo/SayHello";

export const handleKakaoLogin = async () => {
  try {
    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl);

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
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      });

      const user = userResponse.data;
      await saveUserProfile(user.id, {
        nickname: user.properties.nickname,
        email: user.kakao_account.email || null,
        provider: 'kakao',
        lastLogin: new Date(),
      });

      return { success: true, user };
    }
    return { success: false };
  } catch (error) {
    throw new Error(`Kakao 로그인 실패: ${error.message}`);
  }
};
