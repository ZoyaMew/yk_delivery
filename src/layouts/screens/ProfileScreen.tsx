import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, Dimensions, Button, ScrollView, Pressable } from 'react-native'
import Colors from '../../styles/Colors';
import { getMethod,postMethod } from '../../utils/helper';
import IonIcon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeRefresh from '../../component/SwipeRefresh';
import NavHome from '../../component/NavHome';
import { useSelector } from 'react-redux';
import Navbar from '../../component/navbar';

interface ProfileData {
  id: number;
  name: string;
  avatar_original: string;
  phone: number;
}

  interface Props {
    route: any;
    navigation: any;
}
const ProfileScreen: FC<Props> = ({ navigation, route }): JSX.Element => {
  const translations = useSelector((state: any) => state.language.translations);

  const [profile, setProfile] = useState<ProfileData>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    setLoading(true);
    const api: any = await getMethod(`deliveryman/get-profile`);
    if (api.status === 200) {
      console.log("profile_data", api.data.data.avatar_original)
      setLoading(false);
      setProfile(api.data)
      // console.log("........",profile?.user_details.avatar_original)
    }
  }


  const LogOut = async () => {
    try {
      const api: any = await postMethod(`deliveryman/logout`);
      if (api.status === 200) {
        console.log("Logout", api.data);
        await AsyncStorage.removeItem('user_data');
        navigation.reset({
          routes: [{ name: 'Login' }]
        })
      } else {
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#AE1717',
          backgroundColor: '#F2A6A6',
        });
      }
    }
    catch (e) {
      Snackbar.show({
        text: "Some Error Occured-" + e,
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#AE1717',
        backgroundColor: '#F2A6A6',
      });
    }

  }
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getdata();
    } catch (error) {
      console.log('Error refreshing:', error);
    }
    setRefreshing(false);
  };

  return (
    <SwipeRefresh onRefresh={onRefresh} refreshing={refreshing}>
      <View>
        <View>
        <Navbar/>
        </View>
        <View style={styles.cover}>
          <Text style={styles.name}>{translations.profile.Name}</Text>
          <View style={styles.inputarea}>
            <TextInput
              style={styles.input}
              placeholderTextColor={'gray'}
              value={profile?.data.name}
              placeholder="Enter email"
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.name}>{translations.profile.Phone}</Text>
          <View style={styles.inputarea}>
            <TextInput
              style={styles.input}
              placeholderTextColor={'gray'}
              value={profile?.data.phone}
              keyboardType={'numeric'}
              placeholder="Enter Phone No"
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.name}>{translations.profile.Email}</Text>
          <View style={styles.inputarea}>
            <TextInput
              style={styles.input}
              placeholderTextColor={'gray'}
              value={profile?.data.email}
              keyboardType={'numeric'}
              placeholder="Enter Phone No"
              underlineColorAndroid="transparent"
            />
          </View>
          <Pressable onPress={() => LogOut()} style={{ flexDirection: 'row', marginTop: 20 }}>
            <IonIcon name="log-out-outline" size={24} color="red" />
            <Text style={{ color: 'red', fontSize: 18, }}>{translations.profile.Logout}</Text>
          </Pressable>

          {/* <Pressable style={styles.button}>
          <Text style={styles.save}>Edit Details</Text>
        </Pressable> */}
          <Pressable style={styles.button}
            onPress={() => navigation.navigate('EditProfileScreen', {
              name: profile?.data.name,
              phone: profile?.data.phone,
              avatar: profile?.data.avatar_original,
            })}>
            <Text style={styles.save}>{translations.profile.Edit_Details}</Text>
          </Pressable>
        </View>
      </View>
    </SwipeRefresh>
  );
}

export default ProfileScreen;
const styles = StyleSheet.create({
  cover: {
    paddingVertical: 16,
    paddingHorizontal: 24,

  },
  cameraImg: {
    position: 'absolute',
    left: 90,
    top: 70
  },
  input: {
    color: 'black'
  },
  textview: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20
  },
  notificationImg: {
    height: 25,
    width: 25
  },
  notification: {
    position: 'absolute',
    right: 20,
    top: -20
  },
  mainImagebg: {
    width: width * 1,
    height: width * 0.46,
    flex: 1,
    resizeMode: 'cover',
    paddingTop: 40
  },
  info: {
    height: '12%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '8%',
    position: 'relative',
  },
  profile: {
    height: "100%",
    width: "50%",
  },
  profileImage: {
    height: width * 0.2,
    width: width * 0.2,
    resizeMode: "contain",
    position: 'absolute',
    top: width * 0.03,
    left: "15%",

  },
  welcomeText: {
    position: 'absolute',
    top: "8%",
    left: '35%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '65%',
  },
  language: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDiv: {
    paddingBottom: '10%',
    borderWidth: 1,
    borderColor: 'grey',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    height: width * 0.4,
    marginTop: "5%",
  },
  contentDiv2: {
    paddingBottom: '10%',
    paddingTop: '5%',
    borderWidth: 1,
    borderColor: 'grey',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  earningText: {
    fontSize: width * 0.06,
    marginLeft: 20,
    fontWeight: "600",
  },
  earningView: {
    width: "80%",
    backgroundColor: '#E8E8E8',
    marginLeft: "10%",
    borderRadius: 20,
    paddingBottom: 15,
    borderColor: 'grey',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginBottom: 20
    // marginTop: width * 0.2
  },
  earnings: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  earnings1: {
    borderWidth: 1,
    borderColor: 'grey',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    display: 'flex',
    justifyContent: "center",
    alignItems: 'center',
    width: '33%'
  },
  earnings1Text: {
    fontSize: width * 0.04,
    // fontWeight: 'bold',
    color: '#515151'
  },
  earnings1Text2: {
    fontSize: width * 0.035,
    // fontWeight: 500,
    color: '#EC1C24'
  },

  earnings2: {
    borderWidth: 1,
    borderColor: 'grey',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    display: 'flex',
    justifyContent: "center",
    alignItems: 'center',
    width: '30%'
  },

  earnings3: {
    display: 'flex',
    paddingLeft: 10,
    width: '33%',
  },
  startButton: {
    backgroundColor: '#F26722',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalOrder: {
    marginTop: 30,
    marginLeft: '10%',
    width: '80%',
  },
  totalOrderText: {
    marginBottom: 20,
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: 'red',
    width: width * 0.38,
    height: height * 0.23,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },
  boxnoText: {
    fontSize: width * 0.08,
    color: 'white',
    fontWeight: "bold",
  },
  boxContentText: {
    fontSize: width * 0.036,
    color: 'white',
    fontWeight: "bold"
  },
  boxLast: {
    marginBottom: 100,
    paddingBottom: 100,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.3, // Adjust the height as needed
  },
  modalText: {
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 40,
    marginTop: 40,
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  save: {
    color: Colors.white,
    fontSize: 18
  },
  inputarea: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',

    paddingLeft: 10,
    borderRadius: 15,
    marginBottom: 10
  },
  name: {
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 5,
    color: 'black'
  }
})