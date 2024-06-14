import { StyleSheet, Text, View, Dimensions, Image, ScrollView, Touchable, Pressable, ActivityIndicator } from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../../../utils/helper';



const { width, height } = Dimensions.get('window');

export default function OderHistoryDetailScreen({ navigation, route }: any) {
    const { oderNo } = route.params;
    console.log("oderNo", oderNo);
    const [isLoading, setLoading] = useState(false);
    const [oderDetails, setOderDetails] = useState({ data: [] });

    useEffect(() => {
        PackageList();
    }, [])

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


    return (
        <View style={styles.container}>
            {oderDetails && oderDetails.order_detail && oderDetails.order_detail[0] ? (
                <ScrollView>

                    <View style={{ width: '90%', marginLeft: '5%', marginTop: '0%' }}>
                        <View style={styles.header}>
                            <IonIcon name="chevron-back-sharp" size={35} color="black" onPress={() => navigation.goBack()} />
                            <Image
                                source={require('../../../Images/Logo.png')}
                                style={styles.logoImage}
                            />
                            <Text> </Text>
                        </View>
                    </View>
                    <View style={styles.custDetailView}>
                        <View>
                            <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>Customer Details</Text>
                        </View>
                        <View style={styles.custDetail}>
                            <Image
                                source={require('../../../Images/profile.png')}
                                style={styles.profileImage}
                            />

                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.name}>{oderDetails.name}</Text>
                                <Text style={{ fontSize: width * 0.03, color: 'red' }}>{oderDetails.email}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View>
                                    <Image
                                        source={require('../../../Images/call.png')}
                                        style={styles.callImage}
                                    />
                                </View>

                                <Image
                                    source={require('../../../Images/whatsapp.png')}
                                    style={styles.callImage}
                                />
                            </View>

                        </View>
                    </View>
                    <View style={styles.custDetailView}>
                        <View style={styles.addressView}>
                            <MaterialIcons name="add-location-alt" size={20} color="red" />
                            <Text style={styles.addressViewText}>{oderDetails.address}</Text>
                        </View>
                        <View style={styles.addressView}>
                            <IonIcon name="calendar" size={18} color="red" />
                            <Text style={styles.addressViewText}>{oderDetails.full_delivery_date}</Text>
                        </View>
                      

                    </View>
                    <View style={styles.orderView}>
                        <View style={styles.ord}>
                            <View>
                                <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', color: 'black' }}>Order Details</Text>
                            </View>
                            <View style={styles.ord}>
                                <Text style={{ fontSize: width * 0.03, color: 'black' }}>Order ID</Text>
                                <Text style={{ color: 'red', marginLeft: 10, fontSize: width * 0.03 }}>{oderDetails.consolidate_order_no}</Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex',  justifyContent: 'space-between', alignContent: 'center', marginBottom: 25 }}>
                            {oderDetails.order_detail.map((product, index) => (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginBottom: 25 }}>
                                    <Image
                                        source={{ uri: product.product_img }} // Use the actual product image URL here
                                        style={styles.productImage}
                                    />
                                    <View style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '50%' }}>
                                        <Text style={{ fontSize: width * 0.035, color: 'black' }}>{product.product_name}</Text>
                                        <Text style={{ color: 'red', fontSize: width * 0.04 }}>Qty: {product.quantity}</Text>
                                    </View>
                                    <View style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', }}>
                                        <Text style={{ fontSize: width * 0.04, color: 'black' }}>{product.gross_amount}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View>
                            <View style={styles.contentDetail}>
                                <Text style={styles.contentDetailText1}>GST</Text>
                                <Text style={styles.contentDetailText2}>{oderDetails.tax}%</Text>
                            </View>
                            <View style={styles.contentDetail}>
                                <Text style={styles.contentDetailText1}>Delivery Charge</Text>
                                <Text style={styles.contentDetailText2}>{oderDetails.delivery_fee}</Text>
                            </View>
                            <View style={styles.contentDetail}>
                                <Text style={styles.contentDetailText1}>Subtotal</Text>
                                <Text style={styles.contentDetailText2}>${oderDetails.final_amount}</Text>
                            </View>
                            <View style={styles.contentDetail}>
                                <Text style={styles.contentDetailText1}>Coupon discount</Text>
                                <Text style={styles.contentDetailText2}>{oderDetails.coupon_discount}</Text>
                            </View>
                            <View style={styles.contentDetail}>
                                <Text style={styles.contentDetailText1}>Payment Mode</Text>
                                <Text style={styles.contentDetailText2}>{oderDetails.payment_type === 'cash_on_delivery' ? 'COD' : oderDetails.payment_type}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ width: '90%', marginLeft: '5%', marginVertical: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: 'black' }}>Remarks</Text>
                        <View style={styles.remarkView}>
                            <Text style={{ color: "#515151", fontSize: width * 0.04, }}>{oderDetails.remark}</Text>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <ActivityIndicator size="large" color={'red'} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
    },
    name: {
        fontSize: 18,
        color: 'black'
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
        flexDirection: 'row'
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