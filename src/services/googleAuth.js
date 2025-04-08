import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser'; // WebBrowser 추가
import { saveUserProfile } from '../api/userDatabase';

// WebBrowser 설정 완료
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "1018343746579-2js033oh704kg1mkr8vjb3s9t53ot5u8.apps.googleusercontent.com",
    webClientId: "1018343746579-0rrlhl9e6g14u5kgud6mdo4grq4q5rbf.apps.googleusercontent.com",
    iosClientId: "1018343746579-dpcs1lhg0deftabhf4kk8p8u037mmg55.apps.googleusercontent.com",
    expoClientId: "1018343746579-8is4mh5v99cv5ngpprodlc7pej8lphnb.apps.googleusercontent.com",
    scopes: ["profile", "email", "openid"], // 최신 OAuth 스코프
    useProxy: true,
  });

  // console.log("Redirect URI:", request?.redirectUri);

  const handleGoogleLogin = async () => {
    try {
      if (response?.type === "success") {
        // People API를 통해 사용자 정보 가져오기
        const res = await fetch("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses", {
          headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
        });
        const user = await res.json();

        // 사용자 데이터를 Firestore에 저장
        await saveUserProfile(user.resourceName, {
          name: user.names?.[0]?.displayName || "Unknown",
          email: user.emailAddresses?.[0]?.value || "No email",
          provider: 'google',
          lastLogin: new Date(),
        });

        return { success: true, user };
      }
      return { success: false };
    } catch (error) {
      throw new Error(`Google 로그인 실패: ${error.message}`);
    }
  };

  return { promptAsync, handleGoogleLogin, response };
};
