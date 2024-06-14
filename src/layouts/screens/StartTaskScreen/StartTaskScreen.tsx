import { StyleSheet, Text, View, Image, ImageBackground, TextInput, Pressable, Dimensions, Button, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons';
import CalendarPicker from 'react-native-calendar-picker';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Navbar from '../../../component/navbar';
import { getMethod, postMethod } from '../../../utils/helper';
import MyTable from './screenComponent/MyTable';
import moment, { Moment } from 'moment';
import SwipeRefresh from '../../../component/SwipeRefresh';
import { useSelector } from 'react-redux';
import NavHome from '../../../component/NavHome';


const { width, height } = Dimensions.get('window');

interface Props {
    navigation: any; // Replace 'any' with the appropriate type for the navigation prop
}

const StartTaskScreen: React.FC<Props> = ({ navigation }) => {

    const translations = useSelector((state: any) => state.language.translations);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>();
    const [productDate, setproductDate] = useState([])
    const [showCalendarPicker, setShowCalendarPicker] = useState<boolean>(false);
    const [formatedDate, setFormatedDate] = useState<String>();
    const [refreshing, setRefreshing] = useState<boolean>(false);


    useEffect(() => {
        if (selectedStartDate) {
            DeliveryDetails(selectedStartDate.toISOString().slice(0, 10));
        } else {
            const currentDate = new Date().toISOString().slice(0, 10);
            DeliveryDetails(currentDate);
        }
    }, [selectedStartDate]);




    const onDateChange = (date: Moment) => {
        const formattedStartDate = date.toDate().toISOString().split('T')[0];
        setSelectedStartDate(date.toDate());
        setFormatedDate(formattedStartDate);
    };

    const handleSubmit = () => {
        setShowCalendarPicker(true);
        onDateChange(moment()); // This will trigger the date formatting immediately
    };

    const handleCalendar = () => {
        setShowCalendarPicker(!showCalendarPicker); // Toggle the calendar picker on single click
    };


    const DeliveryDetails = async (date: any) => {
        if (!date) {
            date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
        }
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get-inventory-list?date=${date}`);
            if (api.status === 200) {
                // console.log(".....", api.data.data)
                setproductDate(api.data.data)
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


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await DeliveryDetails();
        } catch (error) {
            console.log('Error refreshing:', error);
        }
        setRefreshing(false);
    };

    return (

        <View style={styles.container}>
            <SwipeRefresh onRefresh={onRefresh} refreshing={refreshing}>
                <ScrollView>
                    <Navbar/>
                    <View style={{ backgroundColor: 'white', marginTop:30, }}>
                        <Text style={styles.calendarDate}>{translations.inventory_list.Choose_Date}</Text>
                        {showCalendarPicker ? (
                            <CalendarPicker
                                previousTitleStyle={{ color: 'black' }}
                                nextTitleStyle={{ color: 'black' }}
                                onDateChange={onDateChange} />
                        ) : (
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Pressable onPress={handleSubmit}>
                                    <IonIcon name="calendar-outline" size={36} color="red" style={styles.calendarIcon} />
                                    <Text style={{ color: 'red', fontSize: 18 }}>{translations.inventory_list.Open_Calendar}</Text>
                                </Pressable>
                            </View>
                        )}
                        {showCalendarPicker && (
                            <View style={styles.submitDate}>
                                <Pressable style={styles.downloadButton} onPress={handleCalendar}>
                                    <Text style={[styles.downloadText, styles.padding]}>{translations.inventory_list.SUBMIT}</Text>
                                </Pressable>
                            </View>
                        )}

                        <View style={styles.inventoryView}>
                            <View style={styles.inventoryDiew}>
                                <Text style={styles.inventoryText}>{translations.inventory_list.Inventory_List}</Text>
                                
                            </View>
                            {isLoading ?
                                <ActivityIndicator size="large" color="red" style={{ marginVertical: 50, alignSelf: 'center' }} />
                                :
                                <ScrollView horizontal>
                                    <MyTable data={productDate} />
                                </ScrollView>
                            }
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 100 }}>
                                <Pressable style={styles.completeButton}
                                    onPress={() =>
                                        navigation.dispatch(
                                            CommonActions.navigate({
                                                name: 'PackageListScreen',
                                                params: { date: formatedDate },
                                            })
                                        )
                                    }>

                                    <Text style={styles.downloadText}>{translations.inventory_list.Complete}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SwipeRefresh>
        </View>

    )
}
export default StartTaskScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    back: {
        position: 'absolute',
        top: -170,
        left: 10
    },
    mainImagebg: {
        flex: 1,
        width: width * 1,
        height: width * 0.46,
        resizeMode: 'cover',
    },
    inventoryText: {
        color: 'black',
        fontSize: 18
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
    downloadButton: {
        backgroundColor: '#EC1C24',
        color: 'white',
        borderRadius: 7,
    },
    downloadText: {
        color: 'white',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 5,
        // paddingBottom: 5,
        fontSize: width * 0.045,
        // marginBottom:2,

    },
    inventoryView: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 25,
    },
    inventoryDiew: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    // inventoryText: {
    //     fontSize: width * 0.05,
    //     fontWeight: 'bold',
    //     marginBottom: 15,
    // },
    calendarDate: {
        color: 'black',
        marginLeft: 20,
        fontSize: 18,
        marginBottom: 20
    },
    submitDate: {
        width: '30%',
        marginTop: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '35%',
        marginBottom: 40
    },
    padding: {
        paddingBottom: 10,
    },
    calendarIcon: {
        alignSelf: 'center'
    },
    completeButton: {
        backgroundColor: '#EC1C24',
        color: 'white',
        borderRadius: 7,
        paddingBottom: 10,
        marginTop: 20,
        alignItems: 'center',
        // alignSelf: 'flex-start',
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