import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import SwipeRefresh from '../../../component/SwipeRefresh';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Colors from '../../../styles/Colors';
import { getMethod } from '../../../utils/helper';
import Appbar from '../../../component/Appbar';
import { Modal, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
const { width } = Dimensions.get('window');

interface Props {
    route: any;
    navigation: any;
}

const ConfirmDetailsScreen: FC<Props> = ({ navigation, route }): JSX.Element => {
    const translations = useSelector((state: any) => state.language.translations);

    const { oderNo } = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [details, setDetails] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await ConfirmDetails();
        } catch (error) {
            console.log('Error refreshing:', error);
        }
        setRefreshing(false);
    };
    useEffect(() => {
        ConfirmDetails();
    }, [])
    const ConfirmDetails = async () => {
        try {
            setLoading(true);
            // const api: any = await getMethod(`deliveryman/cancel-order-details?consolidate_order_no=LFKODCC20230800003`);

            const api: any = await getMethod(`deliveryman/complete-order-details?consolidate_order_no=${oderNo}`);
            if (api.status === 200) {
                console.log
                setDetails(api.data.data[0])
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
    const toggleModal = (imageUri) => {
        setSelectedImage(imageUri);
        setModalVisible(!isModalVisible);
    };
    const closeImageModal = () => {
        setModalVisible(false);
      };
    return (
        <View style={styles.container}>

            <SwipeRefresh onRefresh={onRefresh} refreshing={refreshing}>
                <Appbar />
                <View style={styles.cover}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={Colors.brand_primary} style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            <Text style={styles.Reason}>{translations.confirm_details.payment_method}</Text>
                            <View style={styles.background}>
                                <Text style={styles.reasonText}>
                                    {details?.new_payment_type !== null ? details?.new_payment_type : details?.new_payment_type}
                                </Text>
                            </View>
                            <Text style={styles.Reason}>{translations.confirm_details.payment_date}</Text>
                            <View style={styles.background}>
                                <Text style={styles.reasonText}>
                                    {details?.delivery_date}
                                </Text>
                            </View>
                            <Text style={styles.Reason}>{translations.confirm_details.payment_time}</Text>
                            <View style={styles.background}>
                                <Text style={styles.reasonText}>
                                    {details?.delivery_time}
                                </Text>
                            </View>
                            {details?.delivery_remarks !== "" && (
                                <>
                                    <Text style={styles.Remark}>{translations.confirm_details.payment_remark}</Text>
                                    <View style={styles.background}>
                                        <Text style={styles.reasonText}>{details?.delivery_remarks}</Text>
                                    </View>
                                </>
                            )}
                            {/* {details?.delivery_proof !== "" && (
                                <>
                                    <Text style={styles.Remark}>Delivery Proof</Text>
                                    <View style={styles.imageRow}>
                                        {details?.delivery_proof.map((image: any) => (
                                            <Image
                                                key={image.id}
                                                source={{ uri: image.delivery_proof }}
                                                style={styles.image}
                                            />
                                        ))}
                                    </View>
                                </>
                            )}
                            {details?.payment_proof_img[0]?.payment_proof !== "" && (
                                <>
                                    <Text style={styles.Remark}>Payment Proof</Text>
                                    <View style={styles.imageRow}>
                                        {details?.payment_proof_img.map((image: any) => (
                                            <Image
                                                key={image.id}
                                                source={{ uri: image.payment_proof }}
                                                style={styles.image}
                                            />
                                        ))}
                                    </View>
                                </>
                            )}
                            {details?.delivery_signature !== "" && (
                                <>
                                    <Text style={styles.Remark}>Signature</Text>
                                    <View style={styles.imageRow}>
                                        <Image
                                            source={{ uri: details?.delivery_signature }}
                                            style={styles.signatureImg}
                                        />
                                    </View>
                                </>
                            )} */}
                            {details?.delivery_proof !== "" && (
                                <>
                                    <Text style={styles.Remark}>{translations.confirm_details.delivery_proof}</Text>
                                    <View style={styles.imageRow}>
                                        {details?.delivery_proof.map((image, index) => (
                                            <Pressable key={index} onPress={() => toggleModal(image.delivery_proof)}>
                                                <Image source={{ uri: image.delivery_proof }} style={styles.image} />
                                            </Pressable>
                                        ))}
                                    </View>
                                </>
                            )}

                            {/* Render payment_proof_img images */}
                            {details?.payment_proof_img[0]?.payment_proof !== "" && (
                                <>
                                    <Text style={styles.Remark}>{translations.confirm_details.payment_proof}</Text>
                                    <View style={styles.imageRow}>
                                        {details?.payment_proof_img.map((image, index) => (
                                            <Pressable key={index} onPress={() => toggleModal(image.payment_proof)}>
                                                <Image source={{ uri: image.payment_proof }} style={styles.image} />
                                            </Pressable>
                                        ))}
                                    </View>
                                </>
                            )}

                            {/* Render signature */}
                            {details?.delivery_signature !== "" && (
                                <>
                                    <Text style={styles.Remark}>{translations.confirm_details.signature}</Text>
                                    <View style={styles.imageRow}>
                                        <Pressable onPress={() => toggleModal(details?.delivery_signature)}>
                                            <Image source={{ uri: details?.delivery_signature }} style={styles.signatureImg} />
                                        </Pressable>
                                    </View>
                                </>
                            )}

                        </>
                    )}
                </View>
                <Portal>
                <Modal visible={isModalVisible} transparent={true} animationType="slide">
                  <View style={styles.modalContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                    <Pressable onPress={closeImageModal}>
                      <Text style={styles.closeButton}>{translations.confirm_details.Close}</Text>
                    </Pressable>
                  </View>
                </Modal>
              </Portal>
              
            </SwipeRefresh>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    logoImage: {
        width: width * 0.4,
        height: width * 0.14,
        resizeMode: 'contain',
    },
    closeButton: {
        alignSelf: 'center',
        marginTop: 20,
        color: Colors.black,
        fontSize:22
    },
    modalImage: {
        height: 300,
        width: 300,
        alignSelf: 'center',
        borderRadius:8
    },
    modalContainer: {
        backgroundColor: Colors.white,
        padding: 50
    },
    imageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 20
    },
    image: {
        width: 150, // Adjust the width as needed
        height: 140, // Adjust the height as needed
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 8,

    },
    signatureImg: {
        width: 180, // Adjust the width as needed
        height: 150, // Adjust the height as needed
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 8,
        borderColor: 'gray',
        borderWidth: 1
    },
    cover: {
        padding: 20
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 30,
    },
    Remark: {
        color: Colors.black,
        fontWeight: '600',
        fontSize: 16,
        marginTop: 20
    },
    Reason: {
        color: Colors.black,
        fontWeight: '600',
        fontSize: 16
    },
    reasonText: {
        color: Colors.black
    },
    background: {
        backgroundColor: '#E3E3E3',
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 8
    }
});

export default ConfirmDetailsScreen;