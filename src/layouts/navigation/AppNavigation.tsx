import React, { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, ImageBackground, Image, PixelRatio, Pressable, ScrollView } from 'react-native'
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';
import OrderDetails from '../screens/OrderDetails';
import ProfileScreen from '../screens/ProfileScreen';
import UploadImage from '../screens/CancelOderScreen';
import DeliveryMap from '../screens/DeliveryMap';
import PaymentConfirmation from '../screens/PaymentConfirmation';
import TrackOrder from '../screens/TrackOrder';
import NotificationScreen from '../screens/NotificationScreen';
import { getMethod, getStorageData } from '../../utils/helper';
import Colors from '../../styles/Colors';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import TabNavigation from './TabNavigation';
import StartTaskScreen from '../screens/StartTaskScreen/StartTaskScreen';
import PackageDetailScreen from '../screens/PackageDetailScreen/PackageDetailScreen';
import PackageListScreen from '../screens/PackageListScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CancelOderScreen from '../screens/CancelOderScreen';
import OderHistoryScreen from '../screens/OderHistoryScreen/OderHistoryScreen';
import OderHistoryDetailScreen from '../screens/OderHistoryDetailScreen/OderHistoryDetailScreen';
import SingleDeliveryScreen from '../screens/SingleDeliveryScreen/SingleDeliveryScreen';
import CancelDetailsScreen from '../screens/CancelDetailsScreen/CancelDetailsScreen';
import ConfirmDetailsScreen from '../screens/ConfirmDetailsScreen/ConfirmDetailsScreen';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TopTabNavigation from './TopTabNavigation';
const TabTop = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  const [auth, setAuth] = useState('')
  const [load, setLoad] = useState(true);

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    try {
      const getData = await getStorageData();
      console.log("getData", getData.token)
      if (getData)
        setAuth(getData.token)
      setLoad(false);
    } catch (error) {
      console.log('Initiate data error');
      setLoad(false);
    }
  }



  return (
    load === false ? (
      <Stack.Navigator
        initialRouteName={auth !== '' ? "TabNavigation" : "Login"}
        // initialRouteName='Login'
        screenOptions={{ headerShown: false }} >
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="StartTaskScreen" component={StartTaskScreen} />
        <Stack.Screen name="PackageListScreen" component={PackageListScreen} />
        <Stack.Screen name="TopTabNavigation" component={TopTabNavigation} />
        <Stack.Screen name="PackageDetailScreen" component={PackageDetailScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="CancelOderScreen" component={CancelOderScreen} />
        <Stack.Screen name="CancelDetailsScreen" component={CancelDetailsScreen} />
        <Stack.Screen name="ConfirmDetailsScreen" component={ConfirmDetailsScreen} />
        <Stack.Screen name="DeliveryMap" component={DeliveryMap} />
        <Stack.Screen name="SingleDeliveryScreen" component={SingleDeliveryScreen} />
        <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmation} />
        <Stack.Screen name="TrackOrder" component={TrackOrder} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="OderHistoryScreen" component={OderHistoryScreen} />
        <Stack.Screen name="OderHistoryDetailScreen" component={OderHistoryDetailScreen} />

      </Stack.Navigator>
    )
      : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.screen_bg }} >
          <ActivityIndicator size="large" color={Colors.brand_primary} />
        </View>
      )
  )
}



const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.3, // Adjust the height as needed
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
})
export default AppNavigation;
