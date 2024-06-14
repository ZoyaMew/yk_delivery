
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import Modal from 'react-native-modal';
import { Avatar, RadioButton } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getStorageData } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage } from '../redux/features/languageSlice';

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
const { width, height } = Dimensions.get('window');
interface Props {
}
const NavHome: FC<Props> = (): JSX.Element => {

    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState<UserData>();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const translations = useSelector((state) => state.language.translations);

    const [selectedLanguage, setSelectedLanguage] = useState('english');


    const handleLanguageChange = (language: string) => {
        console.log('Dispatching language change:', language);

        // Update the selected language state
        setSelectedLanguage(language);
        dispatch(changeLanguage(language));

        // Toggle the modal
        toggleModal();
    };



    useEffect(() => {
        getStoredData();
    }, []);

    const getStoredData = async () => {
        try {
            const storedData = await getStorageData();
            setUserDetails(storedData)
            setIsLoading(false);
        }
        catch (error) {
            console.log('Error retrieving data:', error);
            setIsLoading(false);
        }
    };



    return (
        <View>
            <ImageBackground source={require('../Images/final-curve.png')} style={styles.mainImagebg}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* <Pressable onPress={() => navigation.navigate('NotificationScreen')} style={styles.notification}>
                        <Image source={require('../Images/notification.png')} style={styles.notificationImg} />
                    </Pressable> */}
                </View>
                <View style={styles.info}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <View style={styles.profile}>
                                {/* <Image source={{ uri: userDetails?.user_details.avatar_original }} style={styles.profileImage} /> */}
                                <Avatar.Image size={84} source={{ uri: userDetails?.user_details.avatar_original }} style={styles.profileImage} />
                            </View>
                            <View style={styles.welcomeText}>
                                <View style={styles.textview}>
                                    <Text style={{ color: 'white', fontSize: width * 0.06 }}>{translations.homeScreen.welcome}</Text>
                                    <Text style={{ color: 'white', fontSize: width * 0.04 }}>{userDetails?.user_details.name}</Text>
                                </View>

                                <View style={styles.language}>
                                    <Pressable onPress={toggleModal} style={{ display: 'flex', flexDirection: 'row' }}>
                                        <IonIcon name="globe-outline" color={'white'} size={width * 0.06} />
                                        <Text style={{ color: 'white', marginLeft: 5, fontSize: width * 0.04, marginRight: 15 }}>
                                            {selectedLanguage === 'english' ? 'EN' : 'CN'}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    )}
                </View>
            </ImageBackground>
            {/* ==========MODAL================================= */}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
                <View style={styles.modalContent} >
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: 10 }}>
                        <Text style={{ color: 'black', fontSize: width * 0.05, fontWeight: 'bold' }}>Language</Text>
                    </View>
                    <View>
                        <RadioButton.Group
                            onValueChange={handleLanguageChange}
                            value={selectedLanguage}>
                            <RadioButton.Item label="English" value="english" color="red" labelStyle={{ color: 'black' }} />
                            <RadioButton.Item label="Chinese" value="chinese" color="red" labelStyle={{ color: 'black' }} />
                        </RadioButton.Group>
                    </View>
                    {/* <Text style={styles.modalText}>This is your bottom popup modal.</Text> */}
                </View>
            </Modal>
            {/* ========================================================= */}

        </View>
    );
}

export default NavHome;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 1.7,
    },
    back: {
        position: 'absolute',
        bottom: 5,
        left: 5
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
})



