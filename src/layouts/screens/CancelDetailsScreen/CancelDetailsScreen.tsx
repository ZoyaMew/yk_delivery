import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, Pressable, View } from 'react-native';
import SwipeRefresh from '../../../component/SwipeRefresh';
import Colors from '../../../styles/Colors';
import { getMethod } from '../../../utils/helper';
import Appbar from '../../../component/Appbar'
import { Modal, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
const { width } = Dimensions.get('window');

interface Props {
    route: any;
    navigation: any;
}

const CancelDetailsScreen: FC<Props> = ({ navigation, route }): JSX.Element => {
    const translations = useSelector((state: any) => state.language.translations);

    const { oderNo } = route.params;
    console.log("oderNo", oderNo)
    const [refreshing, setRefreshing] = useState(false);

    const [isLoading, setLoading] = useState<boolean>(false);
    const [details, setDetails] = useState<boolean>(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await CancelDetails();
        } catch (error) {
            console.log('Error refreshing:', error);
        }
        setRefreshing(false);
    };


    useEffect(() => {
        CancelDetails();
    }, [])

    const CancelDetails = async () => {
        try {
            setLoading(true);
            // const api: any = await getMethod(`deliveryman/cancel-order-details?consolidate_order_no=LFKODCC20230800003`);

            const api: any = await getMethod(`deliveryman/cancel-order-details?consolidate_order_no=${oderNo}`);
            if (api.status === 200) {
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

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    const openImageModal = (imageUri) => {
        setSelectedImage(imageUri);
        setModalVisible(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
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
                            <Text style={styles.Reason}>{translations.cancellation_details.reason_cancellation}</Text>
                            <View style={styles.background}>
                                <Text style={styles.reasonText}>{details?.cancel_reason}</Text>
                            </View>
                            <Text style={styles.Remark}>{translations.cancellation_details.Remark}</Text>
                            <View style={styles.background}>
                                <Text style={styles.reasonText}>{details?.cancel_remarks}</Text>
                            </View>

                            <View style={styles.imageRow}>
                                {details && details.cancel_image !== "" && (
                                    <>
                                        <Text style={styles.Remark}>{translations.cancellation_details.Cancel_Images}</Text>
                                        <View style={styles.imageRow}>
                                            {details.cancel_image.map((image: { images: any; }, index: React.Key | null | undefined) => (
                                                <Pressable
                                                    key={index}
                                                    onPress={() => openImageModal(image.images)}
                                                >
                                                    <Image
                                                        source={{ uri: image.images }}
                                                        style={styles.image}
                                                    />
                                                </Pressable>
                                            ))}
                                        </View>
                                    </>
                                )}
                            </View>

                            {/* Modal for displaying the selected image */}
                            <Portal>
                                <Modal
                                    visible={modalVisible}
                                    animationType="slide"
                                    transparent={true}
                                >
                                    <View style={styles.modalContainer}>

                                        <Image
                                            source={{ uri: selectedImage }}
                                            style={styles.modalImage}
                                        />
                                        <Pressable onPress={closeImageModal}>
                                            <Text style={styles.closeButton}>{translations.cancellation_details.Close}</Text>
                                        </Pressable>
                                    </View>
                                </Modal>
                            </Portal>

                        </>
                    )}
                </View>

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
    imageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingTop: 20
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
    image: {
        width: 150, // Adjust the width as needed
        height: 140, // Adjust the height as needed
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 8,
        marginHorizontal: 5,

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

export default CancelDetailsScreen;