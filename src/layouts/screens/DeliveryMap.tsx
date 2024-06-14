
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity, PermissionsAndroid, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getMethod } from '../../utils/helper';
import Appbar from '../../component/Appbar';

const { width } = Dimensions.get('window');

export default function DeliveryMap({ navigation, route }: any) {
    const { date } = route.params;
    // console.log("date", date)
    const [isLoading, setLoading] = useState<boolean>(false);
    const [delivery, setDelivery] = useState({ data: [] })

    useEffect(() => {
        Delivery()
    }, []);

    

    const Delivery = async () => {
        const apiDate = date || new Date().toISOString().slice(0, 10);

        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/route-planning/get-all-address?delivery_date=${apiDate}`);
            if (api.status === 200) {
                console.log("api.....", api.data.data[0].delivery_status)
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

    const initialRegion = {
        latitude: 1.46578790311051,
        longitude: 103.811865707312,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };



    return (
        <View style={styles.container}>
          <Appbar/>
            <View style={{ height: '50%', backgroundColor: 'lightgrey', marginTop: 30, width: '90%', marginLeft: '5%' }}>
                <MapView style={styles.map}
                    zoomEnabled={true}
                    initialRegion={initialRegion}>
                    {delivery.data.map((location) => (
                        location.delivery_status !== "delivered" && (
                            <Marker
                                key={location.consolidate_order_no}
                                coordinate={{
                                    latitude: parseFloat(location.latitude),
                                    longitude: parseFloat(location.longitude),
                                }}
                            />
                        )
                    ))}
                </MapView>
            </View>
            <View style={styles.deliveryTime}>
                {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <MaterialIcons name="delivery-dining" size={width * 0.08} color="red" />
                    <Text style={styles.fontSize}> 35 min</Text>
                </View> */}
                {/* <View>
                    <Text style={styles.fontSize}>{currentTime}</Text>
                </View> */}
            </View>
            
            <ScrollView style={styles.address}>

                {delivery.data.map((location) => (
                    location.delivery_status !== "delivered" && (
                        <View
                            key={location.shipping_address_id}
                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <MaterialIcons name="add-location-alt" size={20} color="red" />
                            <Text style={{ marginLeft: 10, color: 'black' }}>{location.address}</Text>
                        </View>
                    )
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: width * 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    logoImage: {
        width: width * 0.4,
        height: width * 0.14,
        resizeMode: 'cover',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: width * 0.08,
        marginLeft: '5%',
    },
    deliveryTime: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '90%',
        marginLeft: '5%',
    },
    fontSize: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    startButton: {
        backgroundColor: 'red',
        width: width * 0.25,
        marginLeft: '5%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 30,
        paddingBottom: 5,
        paddingTop: 5,
        paddingRight: 10,
        paddingLeft: 10,
    },
    startButtonText: {
        color: 'white',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    address: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 20,

    },
    addressText: {
        fontSize: width * 0.04,
        color: '#515151',
        marginLeft: 10,
    },
    map: {
        height: '100%',
        width: '100%',
    },
    distanceText: {
        marginLeft: '5%',
    },
});
