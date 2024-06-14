import { StyleSheet, Text, View, Image, ImageBackground, TextInput, Pressable, Dimensions, Button, ScrollView, ActivityIndicator } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons';
import CalendarPicker from 'react-native-calendar-picker';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../../component/navbar';
import { getMethod, postMethod } from '../../../utils/helper';

import moment, { Moment } from 'moment';
import NavHome from '../../../component/NavHome';
import { useSelector } from 'react-redux';


const { width, height } = Dimensions.get('window');
interface Props {
    route: any;
    navigation: any;
}
const OderHistoryScreen: FC<Props> = ({ navigation, route }): JSX.Element => {
    const translations = useSelector((state) => state.language.translations);

    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>();
    const [productDate, setproductDate] = useState([])
    const [showCalendarPicker, setShowCalendarPicker] = useState<boolean>(false);
    const [formatedDate, setFormatedDate] = useState<String>();

    const onDateChange = (date: Moment) => {
        const formattedStartDate = date.toDate().toISOString().split('T')[0];
        setSelectedStartDate(date.toDate());
        setFormatedDate(formattedStartDate);
    };
    
    useEffect(() => {
        if (selectedStartDate) {
            OderDetails(selectedStartDate.toISOString().slice(0, 10));
        } else {
            const currentDate = new Date().toISOString().slice(0, 10);
            OderDetails(currentDate);
        }
    }, [selectedStartDate]);
    const handleSubmit = () => {
        setShowCalendarPicker(true);
        onDateChange(moment()); // This will trigger the date formatting immediately
    };

    const handleCalendar = () => {
        setShowCalendarPicker(!showCalendarPicker); // Toggle the calendar picker on single click
    };


    const OderDetails = async (date: any) => {
        if (!date) {
            date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
        }
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get-order-history?date=${date}`);
            if (api.status === 200) {
                console.log("api.....", api.data.data)
                setproductDate(api.data)
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
        <View style={styles.container}>
            <ScrollView>
                <Navbar/>
                <View style={{ backgroundColor: 'white' }}>
                    <Text style={styles.calendarDate}>{translations.order_history.Choose_Date}</Text>
                    {showCalendarPicker ? (
                        <CalendarPicker onDateChange={onDateChange} />
                    ) : (
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Pressable onPress={handleSubmit}>
                                <IonIcon name="calendar-outline" size={36} color="red" style={styles.calendarIcon} />
                                <Text style={{ color: 'red', fontSize: 18 }}>{translations.order_history.Open_Calendar}</Text>
                            </Pressable>
                        </View>
                    )}
                    {showCalendarPicker && (
                        <View style={styles.submitDate}>
                            <Pressable style={styles.downloadButton} onPress={handleCalendar}>
                                <Text style={[styles.downloadText, styles.padding]}>{translations.order_history.SUBMIT}</Text>
                            </Pressable>
                        </View>
                    )}

                    <View style={styles.inventoryView}>
                        <View style={styles.inventoryDiew}>
                            <Text style={styles.inventoryText}>{translations.order_history.orderList}</Text>
                        </View>


                        {/* ................................................................. */}
                        <View style={styles.mapView}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color={'red'} />
                            ) : (
                                productDate?.data?.map((item, index) => (

                                    <Pressable key={index} onPress={() => navigation.navigate('OderHistoryDetailScreen', {
                                        oderNo: item.consolidate_order_no
                                    })}>
                                        <View style={styles.detailedView}>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View>
                                                    <Text style={styles.orderNo}>{item.consolidate_order_no}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.redText}>{translations.package_listing.Name}: </Text>
                                                <Text style={[styles.detailedText, styles.nameDetail]}>{item.name}</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.redText}>{translations.package_listing.Address}: </Text>
                                                <Text style={styles.detailedText}>{item.address}</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.redText}>{translations.package_listing.Payment_Method}: </Text>
                                                <Text style={styles.detailedText}>{item.payment_type === 'cash_on_delivery' ? 'COD' : item.payment_type}{''}({item.final_amount})</Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                ))
                            )}
                            {/* ------------------------------------------- */}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default OderHistoryScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mapView: {
        marginVertical: 10
    },
    back: {
        position: 'absolute',
        top: -170,
        left: 10
    },
    detailedView: {
        backgroundColor: '#E3E3E3',
        width: "100%",
        // marginLeft: '5%',
        // marginRight:'5%',
        marginTop: 20,
        padding: 20,
        paddingTop: 10,
        borderRadius: 10,
        paddingRight: 0,
    },
    completeTag: {
        color: 'white',
        fontSize: 14,
        paddingTop: 5
    },
    rowView: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
    },
    mainImagebg: {
        flex: 1,
        width: width * 1,
        height: width * 0.46,
        resizeMode: 'cover',
    },
    orderNo: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: 'black',
        paddingVertical: 4,
    },
    redText: {
        color: 'red',
        fontSize: width * 0.03,
        paddingVertical: 4,
    },
    detailedText: {
        color: 'black',
        fontSize: width * 0.03,
        paddingVertical: 4

    },
    orderDate: {
        marginTop: 20,
    },
    nameDetail: {
        color: 'black',
        fontWeight: 'bold',
    },
    completeTagView: {
        marginTop: -10,
        marginBottom: 8,
        paddingHorizontal: 15,
        borderTopRightRadius: 10,
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
        fontSize: 18
    },
    submitDate: {
        width: '30%',
        marginTop: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '35%',
        marginBottom: 20
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