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
      <PeopleStack.Screen name="People" component={PeopleScreen} />
      <PeopleStack.Screen name="EditPersonScreen" component={EditPersonScreen} />
      <PeopleStack.Screen name="AddPersonScreen" component={AddPersonScreen} />
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
            } else if (route.name === 'Messages') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }

            // 아이콘 반환
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50', // 활성화된 탭의 색상
          tabBarInactiveTintColor: '#777', // 비활성화된 탭의 색상
          tabBarShowLabel: true, // 라벨 표시 여부
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="People" component={PeopleStackNavigator} />
        <Tab.Screen name="News" component={NewsScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}