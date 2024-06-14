
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity, PermissionsAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getMethod } from '../../../utils/helper';
import Appbar from '../../../component/Appbar';

const { width } = Dimensions.get('window');

export default function SingleDeliveryScreen({ navigation, route }: any) {
    const { oderNo } = route.params;
    // console.log("oderNo", oderNo)
    const [isLoading, setLoading] = useState<boolean>(false);
    const [delivery, setDelivery] = useState({ data: [] })
    const [locationFetched, setLocationFetched] = useState<boolean>(false);

    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    useEffect(() => {
        requestLocationPermission();
        SingleDelivery()
    }, []);


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



    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
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

    if (!locationFetched) {
        return <ActivityIndicator size="large" color="blue" />
    }


    return (
        <View style={styles.container}>
          <Appbar/>
            <View style={{ height: '50%', backgroundColor: 'lightgrey', marginTop: 30, width: '90%', marginLeft: '5%' }}>
                <MapView style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: region.latitude,
                        longitude: region.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    {delivery.data && delivery.data.length > 0 && (
                        <>
                            <Marker
                                coordinate={{
                                    latitude: parseFloat(delivery.data[0].latitude),
                                    longitude: parseFloat(delivery.data[0].longitude),
                                }}
                                pinColor="red"
                            />
                            {/* <Polyline
                                coordinates={[
                                    { latitude: region.latitude, longitude: region.longitude },
                                    {
                                        latitude: parseFloat(delivery.data[0].latitude),
                                        longitude: parseFloat(delivery.data[0].longitude),
                                    },
                                ]}
                                strokeColor="red"
                                strokeWidth={2}
                            /> */}
                        </>
                    )}
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
            <View>
                <TouchableOpacity style={styles.startButton}>
                    <MaterialIcons name="file-upload" size={width * 0.06} color="white" />
                    <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.address}>

                {delivery.data.map((location) => (
                    <View key={location.shipping_address_id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <MaterialIcons name="add-location-alt" size={20} color="red" />
                        <Text style={{ marginLeft: 10, color: 'black' }}>{location.address}</Text>
                    </View>
                ))}
            </View>
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
    distanceText: {
        marginLeft: '5%',
    },
});
