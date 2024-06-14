import { StyleSheet, Text, View, ScrollView, ImageBackground, Image, Dimensions } from 'react-native'
import React from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons';


const { width, height } = Dimensions.get('window');

const NotificationScreen = ({ navigation }: any) => {
    return (
        <View style={{ height: height * 1, marginBottom: 150 }}>
            <ScrollView>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../../Images/final-curve.png')} style={styles.mainImagebg}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: "5%", paddingRight: '5%' }}>
                        <IonIcon name="chevron-back-sharp" size={24} color="white" onPress={() => navigation.goBack()} />
                            <Text> </Text>
                        </View>
                        <View style={styles.info}>
                            <View style={styles.profile}>
                                <Image source={require('../../Images/profile.png')} style={styles.profileImage} />
                            </View>
                            <View style={styles.welcomeText}>
                                <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', }}>
                                    <Text style={{ color: 'white', fontSize: width * 0.06 }}>Welcome</Text>
                                    <Text style={{ color: 'white', fontSize: width * 0.04 }}>John Doe</Text>
                                </View>
                                <View style={styles.language}>
                                    <IonIcon name="globe-outline" color={'white'} size={width * 0.06} />
                                    <Text style={{ color: 'white', marginLeft: 5, fontSize: width * 0.04, marginRight: 15 }}>EN</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <View style={styles.notiView}>
                                <Text>
                                    You have a new notification !
                                </Text>
                            </View>
                            <View style={styles.notiView}>
                                <Text>
                                    You have a new notification !
                                </Text>
                            </View>
                            <View style={styles.notiView}>
                                <Text>
                                    You have a new notification !
                                </Text>
                            </View>
                            <View style={styles.notiView}>
                                <Text>
                                    You have a new notification !
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </ScrollView>
        </View>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 1.7,
    },
    mainImagebg: {
        width: width * 1,
        height: width * 0.46,
        flex: 1,
        resizeMode: 'cover',
    },
    info: {
        height: '12%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: '5%',
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
    content: {
        width: '90%',
        marginLeft: '5%',

    },
    notiView: {
        backgroundColor: '#E3E3E3',
        padding: 10,
        borderRadius: 7,
        marginTop: 5,
        marginBottom: 5,

    },
})