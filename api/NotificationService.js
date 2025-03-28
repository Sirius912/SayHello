import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";


// 푸시 알림을 즉시 보내는 함수
export async function sendPushNotification(expoPushToken, message) {
    const messagePayload = {
        to: expoPushToken,  // 푸시 알림을 받을 대상의 푸시 토큰
        sound: 'default',
        title: '내가 해냈다악',
        body: message,  // 여기서 message는 푸시 알림 본문 내용
        data: { someData: 'someValue' },
    };

    console.log("푸시 알림 전송을 위한 Payload:", messagePayload); // 메시지와 토큰 확인

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messagePayload),
        });

        const responseData = await response.json();
        console.log("푸시 알림 응답 데이터: ", responseData);

        if (response.ok) {
            console.log('푸시 알림 전송 성공:', responseData);
        } else {
            console.error('푸시 알림 전송 실패:', responseData);
        }
    } catch (error) {
        console.error('알림 보내기 중 오류 발생:', error);
    }
}

export async function resetNotificationPermissions() {
    await Notifications.requestPermissionsAsync({ revoke: true }); // 🚀 권한 초기화
    console.log("알림 권한이 초기화되었습니다.");
}

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        // 권한 상태 확인
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log("현재 권한 상태:", existingStatus); // 권한 상태 확인

        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            Alert.alert("푸시 알림을 받으려면 권한이 필요합니다.");
            return;
        }

        // Expo 푸시 토큰을 받아오기 전에 로그 출력
        try {
            token = await Notifications.getExpoPushTokenAsync();
            console.log("Expo Push Token:", token.data); // 반환된 토큰을 콘솔에 출력
            return token.data; // Expo 푸시 토큰을 리턴
        } catch (error) {
            console.error("푸시 알림 토큰을 가져오는 중 오류 발생:", error);
        }
    } else {
        Alert.alert("푸시 알림은 실제 기기에서만 동작합니다.");
    }
}

export function setupNotificationListeners() {
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
        console.log("푸시 알림 수신:", notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("푸시 알림 클릭:", response);
    });

    return { notificationListener, responseListener };
}
