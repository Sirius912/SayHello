import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 라이브러리
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import PeopleScreen from '../screens/PeopleScreen';
import NewsScreen from '../screens/NewsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import EditPersonScreen from '../screens/EditPersonScreen';
import AddPersonScreen from '../screens/AddPersonScreen';

const Tab = createBottomTabNavigator();
const PeopleStack = createStackNavigator();

function PeopleStackNavigator() {
  return (
    <PeopleStack.Navigator>
      <PeopleStack.Screen name = "People" 
        component={PeopleScreen}
        options={{ headerShown: false }} 
      />
      <PeopleStack.Screen name="EditPersonScreen" 
        component={EditPersonScreen} 
        options={{ headerShown: false }} 
      />
      <PeopleStack.Screen name="AddPersonScreen"
        component={AddPersonScreen} 
        options={{ headerShown: false }} 
      />
    </PeopleStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // 스크린 이름에 따라 아이콘 이름 설정
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'People') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'News') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'Message') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }

            // 아이콘 반환
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50', // 활성화된 탭의 색상
          tabBarInactiveTintColor: '#777', // 비활성화된 탭의 색상
          tabBarShowLabel: false, // 라벨 표시 여부
          tabBarStyle: {
            backgroundColor: '#E8F5E9', // 탭 상단 배경색 (포근한 연두색)
          },
          headerShown: false, // 헤더 숨기기
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="People" component={PeopleStackNavigator} />
        <Tab.Screen name="News" component={NewsScreen} />
        <Tab.Screen name="Message" component={MessagesScreen} />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}