import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabBar from "./screens/TabBar";
import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { sendPushNotification, resetNotificationPermissions, registerForPushNotificationsAsync, setupNotificationListeners } from "./api/NotificationService";
import { Button } from 'react-native'; // Button import 추가

const Stack = createNativeStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // 알림 처리 방법 설정
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, // 알림을 화면에 표시할지 여부
        shouldPlaySound: true, // 소리 재생 여부
        shouldSetBadge: false, // 배지 표시 여부
      }),
    });

    // 푸시 알림 등록
    registerForPushNotificationsAsync().then(setExpoPushToken);

    const listeners = setupNotificationListeners();
    notificationListener.current = listeners.notificationListener;
    responseListener.current = listeners.responseListener;

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // 푸시 알림을 보내는 함수
  const handleSendPushNotification = () => {
    if (expoPushToken) {
      const message = "mama I made it"; // 메시지 설정
      sendPushNotification(expoPushToken, message); // message가 푸시 알림으로 보내짐
    } else {
      console.log("푸시 알림 토큰을 가져오지 못했습니다.");
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabBar" component={TabBar} />
      </Stack.Navigator>

      {/* 버튼을 추가하여 푸시 알림 보내기 */}
      <Button title="푸시 알림 보내기" onPress={handleSendPushNotification} />
    </NavigationContainer>
  );
}
