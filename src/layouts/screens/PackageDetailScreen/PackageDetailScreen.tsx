import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, Dimensions, Button, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { Row, Rows, Table } from 'react-native-table-component';
import Navbar from '../../../component/navbar';
import { getMethod, postMethod } from '../../../utils/helper';
import SwipeRefresh from '../../../component/SwipeRefresh';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Loading from '../../../component/Loading';
import Snackbar from 'react-native-snackbar';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const { width, height } = Dimensions.get('window');
interface Props {
    navigation: any;
    route: any
}
const PackageDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const translations = useSelector((state) => state.language.translations);
    const { oderNo } = route.params;
    const [oder, setOder] = useState([]);
    const [isLoading, seIstLoading] = useState(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    // -----------------------TABLE-------------------------

    const HeadTable = [
        translations.package_details.Product_Name,
        translations.package_details.Variant,
        translations.package_details.Quantity,
        translations.package_details.UOM
    ];


    useEffect(() => {
        PackageDetails();
    }, [])

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await PackageDetails();
        } catch (error) {
            console.log('Error refreshing:', error);
        }
        setRefreshing(false);
    };

    const PackageDetails = async () => {
        try {
            seIstLoading(true);
            const api: any = await getMethod(`deliveryman/get-package-details?consolidate_order_no=${oderNo}`);
            if (api.status === 200) {
                setOder(api.data.data[0])
                seIstLoading(false);
            }
            else {
                seIstLoading(false);
            }
        }
        catch (e) {
            console.log('catch', e)
        }
    }

    const Complete = async () => {
        const raw = {
            consolidate_order_no: oderNo
        }
        try {
            setLoading(true);
            const api: any = await postMethod(`deliveryman/complete-packing`, raw);
            if (api.status === 200) {
                setLoading(false);
                Snackbar.show({
                    text: 'completed',
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'green',
                });
                navigation.dispatch(CommonActions.goBack())
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
                {isLoading ? (
                    <ActivityIndicator style={styles.loader} size="large" color="red" />
                ) : (
                    <ScrollView>
                        <View style={{ height: '100%',marginBottom: 50, }}>
                            <Navbar />
                            <View style={{ width: '90%', marginLeft: '5%', }}>
                                <View style={styles.detailHead}>
                                    <Text style={styles.detailHeadText}>
                                        {translations.package_details.Package_Details}
                                    </Text>
                                    <Text style={styles.dateHeadText}>
                                        {oder.full_delivery_date}
                                    </Text>
                                </View>
                                <View style={styles.detailedView}>
                                    <View>
                                        <Text style={styles.orderNo}>{oder.consolidate_order_no}</Text>
                                    </View>

                                    <View style={styles.rowView}>
                                        <Text style={styles.redText}>{translations.package_details.Name}: </Text>
                                        <Text style={styles.detailedText}>{oder.name}</Text>
                                    </View>
                                    <View style={styles.rowView}>
                                        <Text style={styles.redText}>{translations.package_details.Address}: </Text>
                                        <Text style={styles.detailedText}>{oder.address},{oder.unit_no}</Text>
                                    </View>
                                    <View style={styles.rowView}>
                                        <Text style={styles.redText}>{translations.package_details.Payment_Method}: </Text>
                                        <Text style={styles.detailedText}>
                                            {oder.payment_type === 'cash_on_delivery' ? 'COD' : oder.payment_type}
                                            {''}
                                            ({oder.final_amount})
                                        </Text>


                                    </View>
                                </View>
                                <View style={styles.listHead}>
                                    <Text style={styles.listHeadText}>
                                        {translations.package_details.Inventory_List}
                                    </Text>
                                </View>

                                {/* ----------------TABLE---------------- */}
                                <ScrollView horizontal>
                                    {oder.order_detail ? (
                                        <View style={styles.tableView}>
                                            <Table borderStyle={{ borderWidth: 1, borderColor: '#515151' }}>
                                                <Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.HeadTableText} />
                                                {oder.order_detail.map((rowData, index) => (
                                                    <TouchableOpacity key={index}>
                                                        <View style={styles.row}>
                                                            <Row
                                                                data={[
                                                                    // <Image key={0} source={{ uri: rowData.product_img }} style={styles.imageCell} />,
                                                                    rowData.product_name,
                                                                    rowData.variation,
                                                                    rowData.quantity,
                                                                    rowData.uom,
                                                                ]}
                                                                textStyle={styles.TableText}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </Table>
                                        </View>
                                    ) : (
                                        <ActivityIndicator size="small" color={'red'} />
                                    )}
                                </ScrollView>
                                {/* ----------------TABLE---------------- */}
                                
                                <View>
                                    {isLoading ? (
                                        <ActivityIndicator size="large" color="gray" />
                                    ) : (
                                        <View>
                                            {/* Render package details */}
                                            {oder.packing_status !== 'completed' && (
                                                <Pressable style={styles.completeBtn} onPress={Complete}>
                                                    {loading ? (
                                                        <ActivityIndicator size="small" color="white" />
                                                    ) : (
                                                        <Text style={{ color: 'white' }}>
                                                            {translations.package_details.Complete}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </SwipeRefresh>
        </View>
    )
}

export default PackageDetailScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 1,
        backgroundColor: 'white',
        flex: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    back: {
        position: 'absolute',
        bottom: 140,
        left: 5
    },
    imageCell: {
        height: 20,
        width: 60,
        alignSelf: 'center',
        margin: 10,
        marginLeft: 20
    },
    // HeadStyle: {
    //     height: 40,
    //     backgroundColor: '#D9D9D9',
    //     display: 'flex',
    //     textAlign: 'center',
    //     justifyContent: 'center',
    //     fontSize: width * 0.045,
    //     color: 'black',
    // },
    // HeadTableText: {
    //     width: width * 0.29,
    //     textAlign: 'center', // Center horizontally
    //     fontSize: width * 0.04,
    //     color: 'black',
    // },
    // row: {
    //     alignSelf: 'center',
    //     borderRightWidth: 1,
    //     borderColor: 'black'
    // },
    // TableText: {
    //     textAlign: 'center',
    //     fontSize: 14,
    //     color: 'black',
    //     width: 100,
    //     display: 'flex',
    //     flexDirection: 'row',
    //     alignSelf: 'center',
    //     marginLeft: 50
    // },
    cell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#515151',
        color: 'black',
        height: 40,
    },
    // tableData: {
    //     width: width * 0.29,
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     color: 'black',
    // },
    orderNo: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: 'black',
        paddingVertical: 4,
    },
    detailedView: {
        width: "100%",
        marginTop: 40,
        padding: 10,
        paddingTop: 0,
        borderRadius: 10,
        paddingRight: 0,
    },
    rowView: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
    },
    redText: {
        color: 'red',
        paddingVertical: 4,
    },
    detailedText: {
        color: 'black',
        paddingVertical: 4,

    },
    mainImagebg: {
        flex: 1,
        width: width * 1,
        height: width * 0.46,
        resizeMode: 'cover',
    },
    info: {
        height: '1%',
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
    detailHead: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detailHeadText: {
        fontSize: width * 0.05,
        color: 'black',
        fontWeight: 'bold',
    },
    dateHead: {
        marginTop: 10,
    },
    dateHeadText: {
        fontSize: width * 0.04,
        color: 'black',
    },
    listHead: {
        marginTop: 25,
    },
    listHeadText: {
        fontSize: width * 0.05,
        color: 'black',
        fontWeight: 'bold',
    },
    // tableView: {
    //     marginTop: 20,
    // },
    image: {
        width: 30,
        height: 30,
        marginTop: 3,
        marginBottom: 3,
    },


    completeBtn: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 7,
        paddingBottom: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    // --------TABLE CSS STARTED---------------------------------

    evenRow: {
        // backgroundColor: 'pink',
    },
    oddRow: {
        // backgroundColor: 'plum',
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
    // --------MODAL CSS ENDED---------------------------------


    HeadStyle: {
        height: 40,
        backgroundColor: '#D9D9D9',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: width * 0.045,
        color: 'black',
    },
    HeadTableText: {
        width: width * 0.29,
        textAlign: 'center', // Center horizontally
        fontSize: width * 0.04,
        color: 'black',
    },
    row: {
        alignSelf: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        alignItems: 'center',

    },
    TableText: {
        textAlign: 'center',
        fontSize: 14,
        color: 'black',
        width: 100,
        flexDirection: 'row',
        alignSelf: 'center',
        // marginLeft: 50
        padding: 5,
        // borderRightWidth:1

    },
    // cell: {
    //     // borderRightWidth: 1,
    //     borderBottomWidth: 1,
    //     borderColor: '#515151',
    //     color: 'black',
    //     height: 40,

    // },
    tableData: {
        width: width * 0.29,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
    },


})