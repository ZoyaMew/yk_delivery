
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SwipeRefresh from '../../component/SwipeRefresh';
import NavHome from '../../component/NavHome';
import { getMethod, getStorageData } from '../../utils/helper';
import Navbar from '../../component/navbar';

const { width, height } = Dimensions.get('window');

export interface UserData {
  token: string;
  user_details: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    phone: number;
  };
}
interface TotalOrderData {
  todays_earning: string;
  this_week_earning: string;
  this_month_earning: string;
  todays_order: string;
  this_week_order: string;
  this_month_order: string;
  total_complete_order: string;
}
interface Props {
  navigation: any; // Replace 'any' with the appropriate type for the navigation prop
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const translations = useSelector((state: any) => state.language.translations);

  const [userDetails, setUserDetails] = useState<UserData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [totalOrder, setTotalOrder] = useState<TotalOrderData>();

  // const [totalOrder, setTotalOrder] = useState<string>({});

  useEffect(() => {
    getStoredData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getStoredData();
      await orderTotal();
    } catch (error) {
      console.log('Error refreshing:', error);
    }
    setRefreshing(false);
  };

  const getStoredData = async () => {
    try {
      const storedData = await getStorageData();
      // console.log('....', storedData);
      setUserDetails(storedData);
      orderTotal();
    } catch (error) {
      console.log('Error retrieving data:', error);
    }
  };

  const orderTotal = async () => {
    try {
      setLoading(true);
      const api: any = await getMethod(`deliveryman/total-order`);
      if (api.status === 200) {
        // console.log('...', api.data);
        setTotalOrder(api.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.log('catch', e);
    }
  };

  return (
    <View style={styles.container}>
      <SwipeRefresh onRefresh={onRefresh} refreshing={refreshing}>
        <ScrollView>
           <Navbar isHomeScreen={true} /> 
          <View>
            {isLoading ? (
              <ActivityIndicator size="large" color={'red'} />
            ) : (
              <View>
                <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                  <View style={styles.contentDiv}>
                    <View style={styles.earningView}>
                      <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 25, marginTop: 12 }}>
                        <IonIcon name="wallet-outline" color={'grey'} size={width * 0.07} />
                        <Text style={styles.earningText}>{translations.homeScreen.welcome}</Text>
                      </View>
                      <View style={styles.earnings}>
                        <View style={styles.earnings1}>
                          <Text style={styles.earnings1Text}>{translations.homeScreen.Today}</Text>
                          <Text style={styles.earnings1Text2}>{totalOrder?.todays_earning}</Text>
                        </View>
                        <View style={styles.earnings2}>
                          <Text style={styles.earnings1Text}>{translations.homeScreen.This_Week}</Text>
                          <Text style={styles.earnings1Text2}>{totalOrder?.this_week_earning}</Text>
                        </View>
                        <View style={styles.earnings3}>
                          <Text style={styles.earnings1Text}>{translations.homeScreen.This_Month}</Text>
                          <Text style={styles.earnings1Text2}>{totalOrder?.this_month_earning}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.contentDiv2}>
                    <View style={{ width: '80%', marginLeft: '10%', marginTop: 20 }}>
                      <Text style={styles.activeOrder}>{translations.homeScreen.Active_Order}</Text>
                      <Pressable
                        onPress={() =>
                          navigation.navigate('StartTaskScreen', {
                            id: userDetails?.user_details.id,
                          })
                        }
                        style={styles.startButton}
                      >
                        <Text style={styles.startButtonText}>{translations.homeScreen.Start_Today_Task}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <View style={{ backgroundColor: 'white', paddingBottom: 50, marginBottom: 50 }}>
                  <View style={styles.totalOrder}>
                    <Text style={styles.totalOrderText}>{translations.homeScreen.Total_Order}</Text>
                    <View style={{}}>
                      <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 30 }}>
                        <View style={styles.box}>
                          <Text style={styles.boxnoText}>{totalOrder?.todays_order}</Text>
                          <Text style={styles.boxContentText}>{translations.homeScreen.Today_Order}</Text>
                        </View>
                        <View style={styles.box}>
                          <Text style={styles.boxnoText}>{totalOrder?.this_week_order}</Text>
                          <Text style={styles.boxContentText}>{translations.homeScreen.This_Week_Order}</Text>
                        </View>
                      </View>
                      <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 30 }}>
                        <View style={styles.box}>
                          <Text style={styles.boxnoText}>{totalOrder?.this_month_order}</Text>
                          <Text style={styles.boxContentText}>{translations.homeScreen.This_Month_Order}</Text>
                        </View>
                        <View style={styles.box}>
                          <Text style={styles.boxnoText}>{totalOrder?.total_complete_order}</Text>
                          <Text style={styles.boxContentText}>{translations.homeScreen.Total_Complete_Order}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SwipeRefresh>
    </View>
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  activeOrder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8
  },
  notification: {
    position: 'absolute',
    right: 0,
    top: 20
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
    color: 'gray'
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
    alignSelf: 'center',
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
    color: '#000'
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
})

