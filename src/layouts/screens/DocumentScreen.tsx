import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, Dimensions, Button, ScrollView } from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { Row, Rows, Table } from 'react-native-table-component';
import Navbar from '../../component/navbar';



const { width, height } = Dimensions.get('window');
const DocumentScreen = ({ navigation }: any) => {


    // -----------------------TABLE-------------------------

    const HeadTable = ['Image', 'Product Name', 'Variant', 'Quantity', 'UOM'];
    const DataTable = [

        [
            <View style={styles.tableData}>
                <Image source={require('../../Images/td.png')} style={styles.image} />
            </View>,
            'Product Name',
            'Black',
            '4',
            'KG',
        ],
        [
            <View style={styles.tableData}>
                <Image source={require('../../Images/td.png')} style={styles.image} />
            </View>,
            'Product Name',
            'White',
            '5',
            'KG',
        ],
    ];
    // --------------------TABLE DATA ENDED---------------------------


    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ height: '100%', }}>
                    <Navbar />
                    <View style={{ width: '90%', marginLeft: '5%', }}>
                        <View style={styles.detailHead}>
                            <Text style={styles.detailHeadText}>
                                Packing Details
                            </Text>
                            <Text style={styles.dateHeadText}>
                                20th July Tuesday 2023
                            </Text>
                        </View>
                        <View style={styles.detailedView}>
                            <View>
                                <Text style={styles.orderNo}>#589631</Text>
                            </View>

                            <View style={styles.rowView}>
                                <Text style={styles.redText}>Name: </Text>
                                <Text style={styles.detailedText}>John Doe</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.redText}>Address: </Text>
                                <Text style={styles.detailedText}> Unit no:17/A 15 Senoko Way Senoko Industrial Estate Singapore 758036 </Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.redText}>Payment Method: </Text>
                                <Text style={styles.detailedText}> COD ($30.00)</Text>
                            </View>
                        </View>
                        <View style={styles.listHead}>
                            <Text style={styles.listHeadText}>
                                Inventory List
                            </Text>
                        </View>

                        {/* ----------------TABLE---------------- */}
                        <ScrollView horizontal>
                            <View style={styles.tableView}>
                                <Table borderStyle={{ borderWidth: 1, borderColor: '#515151' }}>
                                    <Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.HeadTableText} />

                                    {DataTable.map((rowData, index) => (
                                        <TouchableOpacity key={index}>
                                            <View style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                                <Row
                                                    data={rowData.map((cellData, cellIndex) => (
                                                        <View key={cellIndex} style={[styles.TableText, styles.cell]}>
                                                            <Text style={{ color: 'black' }} >{cellData}</Text>
                                                        </View>
                                                    ))}
                                                    textStyle={styles.TableText}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </Table>
                            </View>
                        </ScrollView>
                        {/* ----------------TABLE---------------- */}
                        <View>
                            <TouchableOpacity style={styles.completeBtn}>
                                <Text style={{ color: 'white' }}>
                                    Complete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default DocumentScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 1,
        backgroundColor: 'white'
    },
    orderNo: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: 'black',
        paddingVertical: 4,
    },
    detailedView: {
       
        width: "100%",
        marginTop: 20,
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
        paddingVertical: 4

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
    tableView: {
        marginTop: 20,
    },
    image: {
        width: 30,
        height: 30,
        marginTop: 3,
        marginBottom: 3,
    },
    tableData: {
        width: width * 0.29,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
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
    evenRow: {
        // backgroundColor: 'pink',
    },
    oddRow: {
        // backgroundColor: 'plum',
    },


    TableText: {
        flex: 1,
        textAlign: 'center',
        fontSize: width * 0.035,
        color: 'black',
        width: width * 0.30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically

    },
    cell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#515151',
        color: 'black',

    },
    // --------TABLE CSS ENDED-------------------------------


    // --------MODAL CSS---------------------------------
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

})


import { FC } from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {}
const DocumentScreen: FC<Props> = (): JSX.Element => {
  return <View style={styles.container}>Hello World</View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default DocumentScreen;