import 'react-native-gesture-handler';
import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/navigation/MainNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync, setupNotificationListeners } from "./src/api/NotificationService";
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   Notifications.setNotificationHandler({
  //     handleNotification: async () => ({
  //       shouldShowAlert: true,
  //       shouldPlaySound: false,
  //       shouldSetBadge: false,
  //     }),
  //   });

  //   registerForPushNotificationsAsync().then(setExpoPushToken);

  //   const listeners = setupNotificationListeners();
  //   notificationListener.current = listeners.notificationListener;
  //   responseListener.current = listeners.responseListener;

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  // const handleSendPushNotification = async () => {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "Say Hello",
  //       body: "아직 응답이 없어요. 다시 안부를 보내볼까요?",
  //     },
  //     trigger: {
  //       seconds: 10, // 5초 뒤에 알림
  //     },
  //   });
  // };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
        {/* <Button title="Send Push Notification" onPress={handleSendPushNotification} /> */}
      </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}