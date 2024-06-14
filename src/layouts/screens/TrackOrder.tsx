import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, PixelRatio, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import OrderDetails from './OrderDetails';
import Navbar from '../../component/navbar';
import { getMethod } from '../../utils/helper';
import SwipeRefresh from '../../component/SwipeRefresh';



const { width } = Dimensions.get('window');

export default function TrackOrder({ navigation, route }: any) {
    const [isLoading, setLoading] = useState(false);
    const [track, setTrack] = useState({ data: [] });
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const { date } = route.params;
    console.log("date", date)


    useEffect(() => {
        Trackoder();
    }, [])

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Trackoder();
        } catch (error) {
            console.log('Error refreshing:', error);
        }
        setRefreshing(false);
    };

    const Trackoder = async () => {
        const apiDate = date || new Date().toISOString().slice(0, 10);
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get-order-list?date=${apiDate}`);
            if (api.status === 200) {
                console.log(api.data)
                setTrack(api.data)
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
            <SwipeRefresh onRefresh={onRefresh} refreshing={refreshing}>
                <Navbar />
                <Pressable onPress={() => navigation.navigate('PackageListScreen', {
                    date: date || new Date().toISOString().slice(0, 10)
                })}>
                    <IonIcon name="chevron-back-outline" size={24} color="#fff" style={styles.back} />
                </Pressable>
                <View style={{ marginTop: 10, padding: 20 }}>
                    <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', color: "black" }}>
                        Order Listing
                    </Text>
                </View>
                <View>
                    <Pressable style={styles.direction}
                        onPress={() => navigation.navigate('DeliveryMap', {
                            date: date
                        })}>
                        <MaterialCommunityIcons name="directions" size={width * 0.05} color="white" />
                        <Text style={styles.ViewMap}>View Map</Text>
                    </Pressable>
                </View>
                <View style={styles.orderDate}>
                    <Text style={{ color: 'black', fontSize: width * 0.038 }}>{track?.full_delivery_date}</Text>
                </View>
                <ScrollView>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={'red'} />
                    ) : (
                        track?.data?.map((item, index) => (
                            <Pressable key={index} onPress={() => navigation.navigate('OrderDetails', {
                                oderNo: item.consolidate_order_no
                            })}>

                                <View style={styles.detailedView}>

                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={styles.orderNo}>{item.consolidate_order_no}</Text>
                                        </View>
                                        <View style={[styles.completeTagView, { backgroundColor: item.delivery_status === 'cancelled' ? 'red' : '#45E355' }]}>
                                            <Text style={styles.completeTag}>{item.delivery_status}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.rowView}>
                                        <Text style={styles.redText}>Name: </Text>
                                        <Text style={styles.nameDetail}>{item.name}</Text>
                                    </View>
                                    <View style={styles.rowView}>
                                        <Text style={styles.redText}>Address: </Text>
                                        <Text style={styles.detailedText}>{item.address}</Text>
                                    </View>
                                    <View style={styles.rowView}>
                                        <Text style={styles.redText}>Payment Method: </Text>
                                        <Text style={styles.detailedText}>{item.payment_type}{''}({item.final_amount})</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    )}
                </ScrollView>
            </SwipeRefresh>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom:20
    },
    completeTagView: {
        marginTop: -10,
        marginBottom: 8,
        paddingHorizontal: 10,
        borderTopRightRadius: 10,
        marginRight: -10
    },
    completeTag: {
        color: 'white',
        fontSize: 14,
        paddingTop: 5
    },
    back: {
        position: 'absolute',
        bottom: 140,
        left: 5
    },
    mainImagebg: {
        width: width * 1,
        height: width * 0.46,
        flex: 1,
        resizeMode: 'cover',
    },
    ViewMap: {
        color: 'white',

    },
    info: {
        height: width * 0.15,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        marginTop: '5%',
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
        marginTop: "25%"
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
    detailedView: {
        backgroundColor: '#E3E3E3',
        width: "90%",
        marginLeft: '5%',
        marginTop: 20,
        padding: 10,
        borderRadius: 10
    },
    rowView: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        paddingVertical: 5
    },
    orderNo: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: 'black',
        paddingVertical: 5
    },
    redText: {
        color: 'red',
        fontSize: width * 0.03
    },
    detailedText: {
        color: 'black',
        fontSize: width * 0.03,
        // fontWeight: 'bold',

    },
    orderDate: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 10,
    },
    nameDetail: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14
    }
})