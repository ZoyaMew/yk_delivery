import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import OderHistoryScreen from '../screens/OderHistoryScreen/OderHistoryScreen';


const Tab = createBottomTabNavigator();

const TabNavigation =()=>{
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: 'red' },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
                tabBarLabelStyle: { marginBottom: 5 },
                headerShown: false
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home-outline" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen name="OderHistoryScreen" component={OderHistoryScreen}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="clipboard-text-clock-outline" color={color} size={23} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color }) => (
                        <IonIcon name="person" color={color} size={23} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}
export default TabNavigation;