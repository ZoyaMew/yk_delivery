import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, PixelRatio, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import OrderDetails from './OrderDetails';
import TrackOrder from './TrackOrder';
import Navbar from '../../component/navbar';
import { getMethod, postMethod } from '../../utils/helper';
import Snackbar from 'react-native-snackbar';
import SwipeRefresh from '../../component/SwipeRefresh';
import moment from 'moment';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import NavHome from '../../component/NavHome';

const { width } = Dimensions.get('window');
interface Props {
    navigation: any;
    route:any
}
const PackageListScreen: React.FC<Props> = ({ navigation,route }) => {
    const translations = useSelector((state:any) => state.language.translations);

    const { date } = route.params;
    // const navigation = useNavigation();
    const [productDate, setproductDate] = useState({ data: [] });
    const [isLoading, setLoading] = useState<boolean>(false);
    const [Load, setLoad] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [allItemsCompleted, setAllItemsCompleted] = useState<boolean>(false);


    useFocusEffect(
        useCallback(() => {
            // This code will run when the screen focuses
            PackageList(); // Refresh your data when the screen is in focus
        }, [])
    );
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
        const apiDate = date || new Date().toISOString().slice(0, 10);
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get-package-list?date=${apiDate}`);
            if (api.status === 200) {
                // console.log(api.data.data[0].consolidate_order_no)
                setproductDate(api.data)
                console.log("first----",productDate.full_delivery_date)

                setLoading(false);
                const allCompleted = api.data.data.every((item: { packing_status: string; }) => item.packing_status === 'completed');
                setAllItemsCompleted(allCompleted);
            }

            else {
                setLoading(false);
            }
        }
        catch (e) {
            console.log('catche', e)
        }
    }
    const StartDelivery = async () => {
        const raw = {
            // consolidate_order_no: productDate.data[0].consolidate_order_no,
            date: date
        }
        // console.log("raw", raw)
        try {
            setLoad(true);
            const api: any = await postMethod(`deliveryman/start-delivery`, raw);
            if (api.data.status === true) {
                // console.log(".....", api.data)
                setLoad(false);
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'TopTabNavigation',
                        params: { date: date }
                    })
                )
            }
            else {
                setLoading(false);
                // console.log("api", api.data)
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: '#AE1717',
                    backgroundColor: '#F2A6A6',
                });
            }
        }
        catch (e) {
            console.log('catch', e)
        }
    }

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
                <Navbar />
                <View style={{ padding: 20 }}>
                    <View>
                        <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', color: 'black', }}>
                            {translations.package_listing.Package_Listing}
                        </Text>
                    </View>
                    <View style={styles.orderDate}>
                        <Text style={{ color: 'black', fontSize: width * 0.038 }}>
                            {/* {productDate?.full_delivery_date} */}
                            {formatDate(productDate?.full_delivery_date)}
                            </Text>
                    </View>
                    <ScrollView>
                        {isLoading ? (
                            <ActivityIndicator size="large" color={'red'} />
                        ) : (
                            productDate?.data?.map((item, index) => (
                                <Pressable key={index} onPress={() =>
                                    navigation.dispatch(
                                        CommonActions.navigate({
                                            name: 'PackageDetailScreen',
                                            params: { oderNo: item.consolidate_order_no }
                                        })
                                    )}>

                                    <View style={styles.detailedView}>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={styles.orderNo}>{item.consolidate_order_no}</Text>
                                            </View>
                                            <View style={[styles.completeTagView, { backgroundColor: item.packing_status === 'completed' ? '#45E355' : 'red' }]}>
                                                <Text style={styles.completeTag}>{item.packing_status}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.redText}>{translations.package_listing.Name}: </Text>
                                            <Text style={[styles.detailedText, styles.nameDetail]}>{item.name}</Text>
                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.redText}>{translations.package_listing.Address}: </Text>
                                            <Text style={styles.detailedText}>{item.address},{item.unit_no}</Text>
                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.redText}>{translations.package_listing.Payment_Method}: </Text>
                                            <Text style={styles.detailedText}>{item.payment_type === 'cash_on_delivery' ? 'COD' : item.payment_type}{''}({item.final_amount})</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ))

                        )}
                        <View>
                            <Pressable
                                style={[
                                    styles.completeBtn,
                                    { opacity: allItemsCompleted ? 1 : 0.5 },
                                ]}
                                onPress={StartDelivery}
                                disabled={!allItemsCompleted}>
                                {
                                    Load ? (
                                        <ActivityIndicator size="small" color={'white'} />
                                    )
                                        : (
                                            <Text style={{ color: 'white', fontSize: 16 }}>
                                                {translations.package_listing.Start_Delivery}
                                            </Text>
                                        )
                                }

                            </Pressable>
                        </View>
                    </ScrollView>

                    {/* </ScrollView> */}
                </View >
            </SwipeRefresh >
        </View >



    )
}
export default PackageListScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'

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
    info: {
        height: width * 0.15,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        marginTop: '8%',
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#EC1C24',
        padding: 10,
        borderRadius: 10
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
    rowView: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
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
        // width: '90%',
        // marginLeft: '5%',
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
    completeTag: {
        color: 'white',
        fontSize: 14,
        paddingTop: 5
    },
    completeBtn: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        paddingBottom: 10,
        marginTop: 20,
        marginBottom: 50,
        alignSelf: 'center',
    },
})