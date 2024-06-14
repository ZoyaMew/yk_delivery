import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, ImageBackground, Dimensions, Modal, ActivityIndicator } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Colors from '../styles/Colors';
import { getMethod, getStorageData } from '../utils/helper';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Avatar, RadioButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Navbar from './navbar';

const { width, height } = Dimensions.get('window');

export interface UserData {
    token: string;
    user_details: {
        id: number;
        name: string;
        email: string;
        avatar_original: string;
        phone: number;
    };
}
export interface ProductAmount {
    status: string;
    message: string;
    total_collect_cash: string;

}
const CustomTopTabBar = ({ state, navigation, descriptors, date, toggleModal, selectedLanguage }: any) => {

    const translations = useSelector((state) => state.language.translations);

    const [userDetails, setUserDetails] = useState<UserData>();
    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState<ProductAmount>()
    // console.log("---first---", date)
    useFocusEffect(
        useCallback(() => {
            getStoredData();
            CollectedCash();
        }, [])
    );


    const getStoredData = async () => {
        try {
            const storedData = await getStorageData();
            setUserDetails(storedData)
        }
        catch (error) {
            console.log('Error retrieving data:', error);
        }
    };

    const formattedDate = moment(date).format("dddd, DD MMMM YYYY");


    const CollectedCash = async () => {
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get-total-collect-cash?date=${date}`);
            if (api.status === 200) {
                setAmount(api.data)
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        }
        catch (e) {
            console.log('catch', e)
        }
    }



    return (
        <>
            <View>
                {/* <ImageBackground source={require('../Images/final-curve.png')} style={styles.mainImagebg}>
                    
                    <View style={styles.info}>
                        <View style={styles.profile}>
                            <Avatar.Image size={84} source={{ uri: userDetails?.user_details.avatar_original }} style={styles.profileImage} />
                        </View>
                        <View style={styles.welcomeText}>
                            <View style={styles.textview}>
                                <Text style={{ color: 'white', fontSize: width * 0.06 }}>{translations.order_listing.welcome}</Text>
                                <Text style={{ color: 'white', fontSize: width * 0.04 }}>{userDetails?.user_details.name}</Text>
                            </View>

                            <View style={styles.language}>
                                <Pressable onPress={() => toggleModal()} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <IonIcon name="globe-outline" color={'white'} size={width * 0.06} />
                                    <Text style={{ color: 'white', marginLeft: 5, fontSize: width * 0.04, marginRight: 15 }}>
                                        {selectedLanguage === 'english' ? 'EN' : 'ZH'}
                                    </Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </ImageBackground> */}
                <Navbar />

                <Pressable onPress={() => navigation.dispatch(CommonActions.goBack())}>
                    <IonIcon name="chevron-back-outline" size={24} color="#fff" style={styles.back} />
                </Pressable>
                <View style={{ marginTop: 110, padding: 20 }}>
                    <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', color: "black" }}>
                        {translations.order_listing.order_listing}
                    </Text>
                </View>

                <View>
                    <Pressable style={styles.direction}
                        onPress={() => navigation.navigate('DeliveryMap', {
                            date: date
                        })}>
                        <MaterialCommunityIcons name="directions" size={width * 0.05} color="white" />
                        <Text style={styles.ViewMap}>{translations.order_listing.View_Map}
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.orderDate}>
                    <Text style={{ color: 'black', fontSize: width * 0.038 }}>{formattedDate}</Text>
                </View>
                <View style={styles.amountPrice}>
                    <Text style={{ color: 'red', fontSize: width * 0.038, }}>{translations.order_listing.Collected_Cash}:
                        {loading ?
                            (
                                <ActivityIndicator size="small" color={'red'} />
                            ) : (
                                <Text style={{ color: 'black', fontWeight: '500' }}>{amount?.total_collect_cash}</Text>

                            )}
                    </Text>
                </View>
                <View style={styles.container}>
                    {state.routes.map((route: { key: string | number; name: any; }, index: React.Key | null | undefined) => {
                        const { options } = descriptors[route.key];
                        const label = options.tabBarLabel || options.title || route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.6}
                                onPress={onPress}
                                style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                            >
                                <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    orderDate: {
        width: '90%',
        marginLeft: '5%',
        marginVertical: 10,
    },
    amountPrice: {
        width: '90%',
        marginLeft: '5%',
        marginVertical: 10,
    },
    back: {
        position: 'absolute',
        bottom: 140,
        left: 5
    },
    ViewMap: {
        color: 'white'
    },

    pageName: {
        fontSize: 28,
        color: Colors.white,
        // fontFamily: 'Roboto-Bold',
        marginTop: 20

    },
    direction: {
        flexDirection: 'row',
        position: "absolute",
        right: 30,
        bottom: 10,
        backgroundColor: '#EC1C24',
        width: 120,
        padding: 10,
        justifyContent: 'space-around'
    },
    cover: {
        backgroundColor: Colors.brand_primary,
        // paddingBottom: 60,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tinyLogo: {
        width: 22,
        marginTop: 5
    },
    icon: {

    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    tabButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.brand_primary,
        backgroundColor: Colors.brand_primary,
        borderRadius: 8
    },
    tabText: {
        fontSize: 14,
        color: '#333',
        // fontFamily: 'Roboto-Medium',

    },
    tabTextActive: {
        color: 'white',
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
        width: '100%',
        height: width * 0.46,
        // flex: 1,
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
});

export default CustomTopTabBar;
