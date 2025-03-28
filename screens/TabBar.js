import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from "@expo/vector-icons";
import PeopleScreen from './PeopleScreen'
import MapScreen from './MapScreen';
import MessageScreen from './MessageScreen';
import HomeScreen from './HomeScreen';
import NewsScreen from './NewsScreen';
import AddPersonScreen from './AddPersonScreen';
import EditPersonScreen from './EditPersonScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PeopleStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="PeopleScreen"
            component={PeopleScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="AddPersonScreen"
            component={AddPersonScreen}
            options={{
                headerTintColor: '#000000', // header text color
                headerBackTitleStyle: {
                    fontSize: 16,
                },
                title: 'Add New Person', headerShown: true, headerBackTitle: 'Back'
            }}
        />
        <Stack.Screen
            name="EditPersonScreen"
            component={EditPersonScreen}
            options={{
                headerTintColor: '#000000', // header text color
                headerBackTitleStyle: {
                    fontSize: 16,
                },
                title: 'Edit Person', headerShown: true, headerBackTitle: 'Back'
            }}
        />


    </Stack.Navigator>
);

const TabBar = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    height: 70,
                },
                tabBarItemStyle: { paddingTop: 10 },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='home-outline' color={color} size={28} />
                    )
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='map-outline' color={color} size={28} />
                    )
                }}
            />
            <Tab.Screen
                name="People"
                component={PeopleStack}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='people-outline' color={color} size={28} />
                    )
                }}
            />
            <Tab.Screen
                name="News"
                component={NewsScreen}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='newspaper-outline' color={color} size={28} />
                    )
                }}
            />
            <Tab.Screen
                name="MessageScreen"
                component={MessageScreen}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='chatbubbles-outline' color={color} size={28} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: '#ffffff',
    },
    box: {
        flex: 10,
        backgroundColor: '#ffffff',
    },
    buttonText: {
        fontWeight: '600',
    },
    title: {
        marginLeft: 30,
        marginBottom: 30,
        fontSize: 30,
        fontWeight: 900,
    },
    ingredient: {
        marginLeft: 30,
        marginBottom: 15,
        fontSize: 20,
    },
});

export default TabBar;
