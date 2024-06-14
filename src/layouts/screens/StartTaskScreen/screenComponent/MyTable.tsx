import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { useSelector } from 'react-redux';


const { width } = Dimensions.get('window');

interface DataItem {
    file_name: string;
    name: string;
    total_quantity: string;
    unit: string | null;
    variation: string;
}

interface Props {
    data: DataItem[];
    navigation: any;
}
const MyTable: React.FC<Props> = ({ data}) => {
    const translations = useSelector((state) => state.language.translations);
    const HeadTable = [translations.inventory_list.Product_Name,translations.inventory_list.Variant,translations.inventory_list.Quantity,translations.inventory_list.UOM];


    return (
        <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#515151' }}>
                <Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.HeadTableText} />
                {data.map((rowData, index) => (
                    <TouchableOpacity key={index}>
                        <View style={styles.row}>
                            <Row
                                data={[
                                    // <Image key={0} source={{ uri: rowData.file_name }} style={styles.imageCell} />,
                                    rowData.name,
                                    rowData.variation,
                                    rowData.total_quantity,
                                    rowData.unit,
                                ]}
                                textStyle={styles.TableText}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </Table>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 35,
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Center horizontally
        // alignItems: 'center', // Horizontally center the content
    },
    imageCell: {
        height: 20,
        width: 60,
        alignSelf: 'center',
        margin: 10,
        marginLeft: 20

    },
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
    cell: {
        // borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#515151',
        color: 'black',
        height: 40,

    },
    tableData: {
        width: width * 0.29,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
    },
});

export default MyTable;
