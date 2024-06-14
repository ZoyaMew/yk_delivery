import { StyleSheet, Text, View, Dimensions, Image, ScrollView, Touchable, Pressable, ActivityIndicator, Linking, PermissionsAndroid } from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useCallback, useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../../utils/helper';
import SendIntentAndroid from 'react-native-send-intent';
import SwipeRefresh from '../../component/SwipeRefresh';
import Geolocation from '@react-native-community/geolocation';
import Colors from '../../styles/Colors';
import Appbar from '../../component/Appbar';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const { width, height } = Dimensions.get('window');

export default function OrderDetails({ navigation, route }: any) {
    const translations = useSelector((state) => state.language.translations);

    const { oderNo } = route.params;
   

    const [isLoading, setLoading] = useState<boolean>(false);
    const [locationFetched, setLocationFetched] = useState<boolean>(false);
    const [oderDetails, setOderDetails] = useState({ data: [] });
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [delivery, setDelivery] = useState({ data: [] })
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useFocusEffect(
        useCallback(() => {
            // This code will run when the screen focuses
            PackageList();
            requestLocationPermission();
            SingleDelivery() // Refresh your data when the screen is in focus
        }, [])
    );

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position: { coords: { latitude: any; longitude: any; }; }) => {
                        const { latitude, longitude } = position.coords;
                        setRegion({
                            ...region,
                            latitude,
                            longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        });

                        setLocationFetched(true);

                    },
                    (error) => {
                        if (error.code === 1) {
                            console.log("Location permission denied");
                        } else if (error.code === 2) {
                            console.log("Location position unavailable");
                        } else if (error.code === 3) {
                            console.log("Location request timed out");
                        }
                    },
                    { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 }
                );
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn("Error while requesting location permission:", err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await PackageList();
        } catch (error) {
            console.log('Error refreshing:', error);
        }
        setRefreshing(false);
    };

    const PackageList = async () => {
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get-order-details?consolidate_order_no=${oderNo}`);
            if (api.status === 200) {
                setOderDetails(api.data.data[0])
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

    const SingleDelivery = async () => {
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/route-planning/get-single-address?consolidate_order_no=${oderNo}`);
            if (api.status === 200) {
                console.log("api.....", api.data.data[0].latitude)
                setDelivery(api.data)
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


    const makePhoneCall = () => {
        const phoneUrl = `tel:${oderDetails?.phone}`;
        Linking.openURL(phoneUrl)
            .catch((error) => console.error('An error occurred', error));

    };
    const openWhatsApp = () => {
        const phoneNumber = `65${oderDetails?.phone}`;

        SendIntentAndroid.openAppWithUri(`whatsapp://send?phone=${phoneNumber}`)
            .then(isOpened => {
                if (!isOpened) {
                    console.log('WhatsApp not installed.');
                }
            })
            .catch(error => {
                console.error('Error opening WhatsApp:', error);
            });
    };


    const openGoogleMapsDirections = () => {
        console.log("region.latitude", region.latitude)
        const sourceLatitude = region.latitude;
        const sourceLongitude = region.longitude;
        const destinationLatitude = delivery.data[0].latitude
        const destinationLongitude = delivery.data[0].longitude

        const url = `https://www.google.com/maps/dir/?api=1&origin=${sourceLatitude},${sourceLongitude}&destination=${destinationLatitude},${destinationLongitude}&travelmode=driving`;

        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    console.log("Cannot open Google Maps");
                }
            })
            .catch(error => console.log("Error opening Google Maps:", error));
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'Invalid date';
        }

        const dateParts = dateString.split(' ');
        if (dateParts.length !== 4) {
            return 'Invalid date';
        }

        const [day, month, weekday, year] = dateParts;
        return `${weekday}, ${day} ${month} ${year}`;
    };

    return (
        <View style={styles.container}>
            <SwipeRefresh onRefresh={onRefresh} refreshing={refreshing}>
                {oderDetails && oderDetails.order_detail && oderDetails.order_detail[0] ? (
                    <>
                        <Appbar />
                        <ScrollView>
                            <View style={styles.custDetailView}>
                                <View>
                                    <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>
                                        {translations.order_details.Customer_Details}
                                    </Text>
                                </View>
                                <View style={styles.custDetail}>
                                    <Image
                                        source={{ uri: oderDetails.avatar_original }}
                                        style={styles.profileImage}
                                    />

                                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.name}>{oderDetails.name}</Text>
                                        <Text style={{ fontSize: width * 0.03, color: 'red' }}>{oderDetails.email}</Text>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Pressable onPress={makePhoneCall}>
                                            <Image
                                                source={require('../../Images/call.png')}
                                                style={styles.callImage}
                                            />
                                        </Pressable>
                                        <Pressable onPress={openWhatsApp}>
                                            <Image
                                                source={require('../../Images/whatsapp.png')}
                                                style={styles.callImage}
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.custDetailView}>
                                <View style={styles.addressView}>
                                    <IonIcon name="location-outline" size={20} color="red" />
                                    <Text style={styles.addressViewText}>{oderDetails.address}, {oderDetails.unit_no}</Text>
                                </View>
                                <View style={styles.addressView}>
                                    <IonIcon name="calendar-outline" size={18} color="red" />
                                    <Text style={styles.addressViewText}>
                                        {/* {oderDetails.full_delivery_date} */}
                                        {formatDate(oderDetails?.full_delivery_date)}
                                    </Text>
                                </View>
                                {/* <View style={styles.addressView}>
                                <IonIcon name="business-outline" size={18} color="red" />
                                <Text style={styles.addressViewText}>{oderDetails.unit_no}</Text>
                            </View> */}

                                <View style={styles.direction}>
                                    <Pressable style={styles.direction} onPress={() => openGoogleMapsDirections(
                                        parseFloat(delivery.data[0].latitude),
                                        parseFloat(delivery.data[0].longitude)
                                    )}>
                                        <MaterialCommunityIcons name="directions" size={width * 0.05} color="red" />
                                        <Text style={{ fontSize: width * 0.03, color: 'red', marginLeft: 3 }}>
                                            {translations.order_details.Get_Direction}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.orderView}>
                                <View style={styles.ord}>
                                    <View>
                                        <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', color: 'black' }}>{translations.order_details.Order_Details}</Text>
                                    </View>
                                    <View style={styles.ord}>
                                        <Text style={{ fontSize: width * 0.03, color: 'black' }}>{translations.order_details.Order_ID}</Text>
                                        <Text style={{ color: 'red', marginLeft: 10, fontSize: width * 0.03 }}>{oderDetails.consolidate_order_no}</Text>
                                    </View>
                                </View>
                                <View style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', marginBottom: 25 }}>
                                    {oderDetails.order_detail.map((product, index) => (
                                        <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginBottom: 25 }}>
                                            <Image
                                                source={{ uri: product.product_img }} // Use the actual product image URL here
                                                style={styles.productImage}
                                            />

                                            <View style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '50%' }}>
                                                <Text style={{ fontSize: width * 0.035, color: 'black' }}>{product.product_name}({product.variation})</Text>
                                                <Text style={{ color: 'red', fontSize: width * 0.04 }}>{translations.order_details.Qty}: {product.quantity}</Text>
                                            </View>
                                            <View style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', }}>
                                                <Text style={{ fontSize: width * 0.04, color: 'black' }}>{product.gross_amount}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                                <View>

                                    <View style={styles.contentDetail}>
                                        <Text style={styles.contentDetailText1}>{translations.order_details.Total}</Text>
                                        <Text style={styles.contentDetailText2}>{oderDetails.total}</Text>
                                    </View>
                                    {oderDetails.total_discount !== "$0.00" && (<View style={styles.contentDetail}>
                                        <Text style={styles.contentDetailText1}>{translations.order_details.Discount}</Text>
                                        <Text style={styles.contentDetailText2}>{oderDetails.total_discount}</Text>
                                    </View>
                                    )}
                                    {oderDetails.coupon_discount !== "$0.00" && (<View style={styles.contentDetail}>
                                        <Text style={styles.contentDetailText1}>{translations.order_details.coupon_discount}</Text>
                                        <Text style={styles.contentDetailText2}>{oderDetails.coupon_discount}</Text>
                                    </View>
                                    )}

                                    {oderDetails.delivery_fee !== "$0.00" && (
                                        <View style={styles.contentDetail}>
                                            <Text style={styles.contentDetailText1}>{translations.order_details.Delivery_Charge}</Text>
                                            <Text style={styles.contentDetailText2}>{oderDetails.delivery_fee}</Text>
                                        </View>
                                    )}
                                    <View style={styles.contentDetail}>
                                        <Text style={styles.contentDetailText1}>{translations.order_details.Grand_Total}</Text>
                                        <Text style={styles.contentDetailText2}>{oderDetails.final_amount}</Text>
                                    </View>

                                    {oderDetails.left_payment !== "$0.00" && (<View style={styles.contentDetail}>
                                        <Text style={styles.contentDetailText1}>{translations.order_details.Balance_Amount}</Text>
                                        <Text style={styles.contentDetailText2}>{oderDetails.left_payment}</Text>
                                    </View>
                                    )}
                                    <View style={styles.contentDetail}>
                                        <Text style={styles.contentDetailText1}>{translations.order_details.Payment_Mode}</Text>


                                        <Text style={styles.contentDetailText2}>
                                            {oderDetails.payment_type === 'cash_on_delivery' ? 'COD' :
                                                oderDetails.payment_type === 'pay_now' ? 'Pay Now' :
                                                    oderDetails.payment_type === 'hitpay' ? 'HitPay' :
                                                        oderDetails.payment_type
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '90%', marginLeft: '5%', marginTop: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: 'black' }}>{translations.order_details.Remarks}</Text>
                                <View style={styles.remarkView}>
                                    <Text style={{ color: "#515151", fontSize: width * 0.04, }}>{oderDetails.remark}</Text>
                                </View>
                            </View>

                            <View style={styles.orderStatus}>
                                <Text style={{ fontWeight: 'bold', fontSize: width * 0.06, marginBottom: 10, color: 'black' }}>{translations.order_details.Order_Status}</Text>
                                {oderDetails.delivery_status === "cancelled" ? (
                                    <Pressable style={styles.details}
                                        onPress={() =>
                                            navigation.dispatch(
                                                CommonActions.navigate({
                                                    name: 'CancelDetailsScreen',
                                                    params: { oderNo: oderNo, }
                                                })
                                            )}>
                                        <Text style={styles.viewDetails}>{translations.order_details.View_Details}</Text>
                                    </Pressable>

                                ) : oderDetails.delivery_status === "delivered" ? (
                                    <Pressable style={styles.details}
                                        onPress={() =>
                                            navigation.dispatch(
                                                CommonActions.navigate({
                                                    name: 'ConfirmDetailsScreen',
                                                    params: { oderNo: oderNo, }
                                                })
                                            )}>
                                        <Text style={styles.viewDetails}>{translations.order_details.View_Details}</Text>
                                    </Pressable>
                                ) : (
                                    <View style={styles.confirmButtons}>
                                        <Pressable style={[styles.cButton, styles.comButton]}
                                            onPress={() => navigation.navigate('CancelOderScreen', {
                                                oderNo: oderNo
                                            })}
                                        >
                                            {/* {isLoading ? (
                                                <ActivityIndicator size="small" color="white" />
                                            ) : ( */}
                                                <Text style={styles.cButtonText}>{translations.order_details.Cancel}</Text>
                                            {/* )} */}
                                        </Pressable>

                                        {/* <Pressable
                                        style={[styles.cButton, styles.rButton]}
                                        onPress={() => {
                                            if (oderDetails.left_payment) {
                                                navigation.navigate('PaymentConfirmation', {
                                                    orderNo: oderNo,
                                                    paymentStatus: oderDetails.payment_status,
                                                    paymentAmount: oderDetails.left_payment,
                                                });
                                            } else {
                                                navigation.navigate('PaymentConfirmation', {
                                                    orderNo: oderNo,
                                                    paymentStatus: oderDetails.payment_status,
                                                    paymentAmount: oderDetails.final_amount,
                                                });
                                            }
                                        }}
                                    > */}
                                        <Pressable
                                            style={[styles.cButton, styles.rButton]}
                                            onPress={() =>
                                                navigation.navigate('PaymentConfirmation', {
                                                    oderNo: oderNo,
                                                    paymentStatus: oderDetails.payment_status,
                                                    amountToPay:
                                                        oderDetails.left_payment === '$0.00'
                                                            ? oderDetails.final_amount
                                                            : oderDetails.left_payment,
                                                })
                                            }
                                        >


                                            <Text style={styles.cButtonText}>{translations.order_details.Confirm}</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </View>


                        </ScrollView>
                    </>
                ) : (
                    <ActivityIndicator size="large" color={'red'} />
                )}
            </SwipeRefresh>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
    },
    viewDetails: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center'
    },
    name: {
        fontSize: 18,
        color: 'black'
    },
    details: {
        backgroundColor: Colors.brand_primary,
        marginTop: 30,
        padding: 15,
        width: '40%',
        alignSelf: 'center',
        borderRadius: 8
    },
    logoImage: {
        width: width * 0.4,
        height: width * 0.14,
        contain: 'cover',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 30,
    },
    profileImage: {
        width: width * 0.16,
        height: width * 0.16,
        borderRadius: 50
    },
    callImage: {
        width: width * 0.067,
        height: width * 0.067,
        marginLeft: 10
    },
    custDetailView: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 20,
        backgroundColor: '#E8E8E8',
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 30,
        paddingLeft: 30,
        borderRadius: 10
    },
    custDetail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // width: '90%',
        // marginLeft: '5%'
    },
    addressView: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10
    },
    addressViewText: {
        fontSize: 14,
        marginLeft: 15,
        color: 'black'
    },
    direction: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    remarkView: {
        marginTop: 20,
        backgroundColor: '#E8E8E8',
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 30,
        paddingLeft: 30,
        borderRadius: 10
    },
    orderStatus: {
        marginTop: 20,
        width: '90%',
        marginLeft: '5%',
        marginBottom: 30
    },
    confirmButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50
    },
    cButton: {
        width: width * 0.4,
        padding: 15,
        marginTop: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    comButton: {
        backgroundColor: 'red',

    },
    rButton: {
        backgroundColor: 'green',

    },
    cButtonText: {
        fontSize: width * 0.05,
        color: 'white',

    },
    orderView: {
        width: '90%',
        marginLeft: '5%',
        // marginRight:'5%',
        marginTop: 15,
    },
    ord: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginRight: '0.5%',
        // alignItems:'center'
    },
    productImage: {
        height: width * 0.2,
        width: width * 0.2,
        marginTop: 10,
        marginRight: 10

    },
    contentDetail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingTop: 15,
        paddingBottom: 5,
        borderTopWidth: 1,
        borderTopColor: 'black',
    },
    contentDetailText1: {
        fontSize: width * 0.04,
        color: "#515151",
        fontWeight: 'bold'
    },

    contentDetailText2: {
        fontSize: width * 0.04,
        color: 'red',
        fontWeight: 'bold'
    }
})


