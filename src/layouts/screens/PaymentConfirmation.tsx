
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Image, TextInput, PermissionsAndroid, TouchableOpacity, Platform, FlatList, ActivityIndicator, } from 'react-native'
import React, { useState, useEffect, useRef, FC } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { RadioButton, Modal } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { ImagePickerResponse } from 'react-native-image-picker/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Table, Row, Rows } from 'react-native-table-component';
import DocumentPicker from 'react-native-document-picker';
import SignatureScreen from "react-native-signature-canvas";
import RNFS from 'react-native-fs';
import { FormPostMethod, getMethod, postMethod } from '../../utils/helper';
import Snackbar from 'react-native-snackbar';
import Colors from '../../styles/Colors';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const { width } = Dimensions.get('window');
interface Props {
    route: any;
    navigation: any;
}
const PaymentConfirmation: FC<Props> = ({ navigation, route }): JSX.Element => {
    const translations = useSelector((state) => state.language.translations);

    const { oderNo, paymentStatus, amountToPay } = route.params;
    const [remark, setRemark] = useState<string>();
    const [imageUri, setImageUri] = useState<string>();
    const [signatureModalVisible, setSignatureModalVisible] = useState(false);
    const [checked, setChecked] = useState('first');
    const [selectedPaymentFile, setSelectedPaymentFile] = useState<string | null>(null);
    const [selectedDeliveryFile, setSelectedDeliveryFile] = useState<string | null>(null);
    const [showQRCode, setshowQRCode] = useState(false);
    const signatureRef = useRef(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setisLoading] = useState<boolean>(false);

    const [isSecondModalVisible, setSecondModalVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string[]>([]);
    const [secondImageUri, setSecondImageUri] = useState<string[]>([]);
    const [getQrCode, setQrCode] = useState()

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setSecondModalVisible(false); // Close the second modal
    };

    const toggleSecondModal = () => {
        setSecondModalVisible(!isSecondModalVisible);
        setModalVisible(false); // Close the first modal
    };



    const handleRadioButtonChange = (value: string) => {
        getQR()
        setChecked(value);
        setshowQRCode(value === 'pay_now');
    };


    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Camera Permission',
                    message: 'App needs camera permission to capture photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission granted');
                } else {
                    console.log('Camera permission denied');
                }
            } catch (error) {
                console.log('Error requesting camera permission:', error);
            }
        }
    };


    const openCamera = async () => {
        await requestCameraPermission();
        const options = {
            mediaType: 'photo',
            quality: 0.5,
        };

        launchCamera(options, (response: ImagePickerResponse) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const selectedImage = response.assets
                    ? response.assets.map((asset) => asset.uri)
                    : [response.uri];

                setSelectedImageUri((prevUris) => [...prevUris, ...selectedImage]);
                toggleModal()

            } else {
                console.log('User cancelled or error:', response.error || response.customButton);

            }
        });
    };


    const openImageLibrary = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.5,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const selectedImage2 = response.assets
                    ? response.assets.map((asset) => asset.uri)
                    : [response.uri];

                setSelectedImageUri((prevUris) => [...prevUris, ...selectedImage2]);
                toggleModal()

            } else {
                console.log('User cancelled or error:', response.error || response.customButton);

            }
        });


    };
    // -----------------------------------------------------------------------------------------------

    const openSecondCamera = async () => {
        await requestCameraPermission();
        const options = {
            mediaType: 'photo',
            quality: 0.5,
        };

        launchCamera(options, (response: ImagePickerResponse) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const selectedImage = response.assets
                    ? response.assets.map((asset) => asset.uri)
                    : [response.uri];

                setSecondImageUri((prevUris) => [...prevUris, ...selectedImage]);
                setSecondModalVisible(false);
            } else {
                console.log('User cancelled or error:', response.error || response.customButton);
            }
        });

    };

    const openSecondImageLibrary = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.5,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const selectedImage = response.assets
                    ? response.assets.map((asset) => asset.uri)
                    : [response.uri];

                setSecondImageUri((prevUris) => [...prevUris, ...selectedImage]);
                setSecondModalVisible(false);
            } else {
                console.log('User cancelled or error:', response.error || response.customButton);
            }
        });
    };

    const handleSignatureModal = () => {
        setSignatureModalVisible(!signatureModalVisible);
    };


    const handleOK = (signature: string) => {
        const path = RNFS.CachesDirectoryPath + `img-${new Date().valueOf()}.jpg`;
        RNFS.writeFile(path, signature.replace("data:image/png;base64,", ""), 'base64')
        setImageUri(path);
        setSignatureModalVisible(false)
    };

    const getQR = async () => {
        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get-qrcode`);
            if (api.status === 200) {
                console.log("api.....", api.data.data.qr_code)
                setQrCode(api.data.data)
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



    const uploadImages = async () => {
        const formData = new FormData();

        // Append texts to the formData
        formData.append('consolidate_order_no', oderNo);
        if (checked === 'cash' || checked === 'pay_now') {
            // Append payment_mode only if it's cash or QR
            formData.append('payment_mode', checked);
        }
        formData.append('delivery_remarks', remark !== undefined ? remark : '');
        selectedImageUri.forEach((uri, index) => {
            formData.append('payment_proof[]', {
                uri: uri,
                type: 'image/jpeg',
                name: `payment_proof_${index}.jpg`,
            });
        });
        secondImageUri.forEach((uri, index) => {
            formData.append('delivery_proof[]', {
                uri: uri,
                type: 'image/jpeg',
                name: `delivery_proof_${index}.jpg`,
            });
        });
        if (imageUri) {
            formData.append('delivery_signature', {
                uri: 'file://' + imageUri,
                type: 'image/jpeg',
                name: 'delivery_signature.jpg',
            });
        }
        console.log("formData", 'file://' + imageUri)
        try {
            setLoading(true);
            const api: any = await FormPostMethod(`deliveryman/payment-confirm`, formData);
            if (api.status === 200) {
                console.log("cancel", api.data)
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'green',
                });
                setLoading(false);
                navigation.dispatch(CommonActions.goBack())
            } else {
                setLoading(false);
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'red',
                });
            }
        }
        catch (e) {
            console.log('catch', e)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.containerr}>
                    <View style={styles.header}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <IonIcon name="chevron-back-sharp" size={35} color="black" />
                        </Pressable>
                        <Image source={require('../../Images/Logo.png')} style={styles.logoImage} />
                        <Text> </Text>
                    </View>
                    {(paymentStatus === 'partial_paid' || paymentStatus === 'unpaid') && (

                        <View>
                            <View>
                                <View style={{ marginTop: 30 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black', marginBottom: 20 }}>{translations.payment_confirmed.collectable_price}  <Text style={{ color: Colors.brand_primary }}>{amountToPay}</Text></Text>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: 'black', marginBottom: 20 }}>{translations.payment_confirmed.payment_confirmation}</Text>
                                </View>
                                <View style={{ backgroundColor: '#E3E3E3', paddingTop: 10, paddingLeft: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width * 0.04, color: 'black' }}>{translations.payment_confirmed.Payment_Mode}</Text>
                                    <RadioButton.Group onValueChange={handleRadioButtonChange} value={checked}>
                                        <RadioButton.Item label="Payment With QR Code" value="pay_now" color="red" labelStyle={{ color: '#515151' }} />
                                        <RadioButton.Item label="Cash" value="cash" color="red" labelStyle={{ color: '#515151' }} />
                                    </RadioButton.Group>
                                </View>
                                {showQRCode && (
                                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: width * 0.04, marginBottom: 10 }}>{translations.payment_confirmed.ScanQr}</Text>
                                        <Image source={{ uri: getQrCode?.qr_code }} style={styles.QRcode} />
                                        <Text style={{ color: 'black' }}>{getQrCode?.number}</Text>
                                    </View>
                                )}

                                <View style={styles.align}>
                                    <Text style={styles.heading}>{translations.payment_confirmed.payment_proof}</Text><Text style={styles.required}> *required</Text>
                                    <Pressable onPress={toggleModal}>
                                        <MaterialCommunityIcons name="camera" size={20} color="black" style={styles.icon} />
                                    </Pressable>
                                </View>
                                <View style={styles.fileBackground} >
                                    {selectedImageUri.length > 0 ? null : <Text style={styles.chooseFile} onPress={toggleModal}>Choose file</Text>}
                                    <FlatList
                                        data={selectedImageUri}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                        renderItem={({ item }) => (
                                            <Image source={{ uri: item }} style={{ width: 150, height: 150, paddingLeft: 18, marginRight: 10 }} />
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: width * 0.04, color: 'black' }}>{translations.payment_confirmed.Remarks}</Text>
                        <View style={styles.remarkView}>
                            <TextInput
                                multiline
                                style={styles.textInput}
                                placeholder='Give your remark here'
                                value={remark}
                                placeholderTextColor={'gray'}
                                onChangeText={setRemark}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={styles.align}>
                            <Text style={styles.heading}>{translations.payment_confirmed.delivery_proof}</Text>
                            <Pressable onPress={toggleSecondModal}>
                                <MaterialCommunityIcons name="camera" size={20} color="black" style={styles.icon} />
                            </Pressable>
                        </View>
                        <View style={styles.fileBackground}>
                            {secondImageUri.length > 0 ? null : <Text style={styles.chooseFile} onPress={toggleSecondModal}>Choose file</Text>}
                            <FlatList
                                data={secondImageUri}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                renderItem={({ item }) => (
                                    <Image source={{ uri: item }} style={{ width: 150, height: 150, paddingLeft: 18, marginRight: 10 }} />
                                )}
                            />

                        </View>
                    </View>
                    <View>
                        <View>
                            <View style={styles.align}>
                                <Text style={styles.heading}>{translations.payment_confirmed.signature}</Text>
                                <Pressable onPress={handleSignatureModal}>
                                    <MaterialCommunityIcons name="pencil" size={20} color="black" style={styles.icon} />
                                </Pressable>
                            </View>
                            <View style={styles.signatureFileBackground}>
                                {imageUri ? (
                                    <Image source={{ uri: 'file://' + imageUri }} style={{ width: 150, height: 150, paddingLeft: 18 }} />
                                ) : (
                                    <Text style={styles.chooseFile} onPress={handleSignatureModal}>{translations.payment_confirmed.signature}</Text>
                                )}
                            </View>
                        </View>

                    </View>
                    <View
                        style={{
                            marginTop: 20,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <Pressable
                            style={{
                                backgroundColor: loading ? 'red' : 'red', // Change the background color when loading
                                padding: 10,
                                width: width * 0.34,
                                borderRadius: 7,
                            }}
                            onPress={loading ? null : uploadImages} // Disable onPress when loading is true
                            disabled={loading} // Disable the button when loading is true
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        alignSelf: 'center',
                                    }}>
                                    {translations.payment_confirmed.Complete}
                                </Text>
                            )}
                        </Pressable>
                    </View>

                </View>
            </ScrollView >
            {/* =================================================================================================== */}
            < Modal visible={isModalVisible} >
                <View style={styles.popUp}>
                    <View style={styles.crossBtn}>
                        <View><Text> </Text></View>
                        <TouchableOpacity onPress={toggleModal} >
                            <Text style={{ color: 'grey', fontSize: width * 0.06, paddingBottom: 3 }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.optionBtns}>
                        <TouchableOpacity style={styles.optionS} onPress={openImageLibrary}>
                            <MaterialIcons name="insert-photo" size={width * 0.1} color="red" />
                            <Text style={{ color: 'black' }}>Library</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionS} onPress={openCamera}>
                            <MaterialCommunityIcons name="camera" size={width * 0.1} color="red" />
                            <Text style={{ color: 'black' }}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

            <Modal visible={isSecondModalVisible}>
                <View style={styles.popUp}>
                    <View style={styles.crossBtn}>
                        <View><Text> </Text></View>
                        <TouchableOpacity onPress={toggleSecondModal}>
                            <Text style={{ color: 'grey', fontSize: width * 0.06, paddingBottom: 3 }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.optionBtns}>
                        <TouchableOpacity style={styles.optionS} onPress={openSecondImageLibrary}>
                            <MaterialIcons name="insert-photo" size={width * 0.1} color="red" />
                            <Text>Library</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionS} onPress={openSecondCamera}>
                            <MaterialCommunityIcons name="camera" size={width * 0.1} color="red" />
                            <Text>Camera</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <Modal
                visible={signatureModalVisible}
                onDismiss={handleSignatureModal}
                contentContainerStyle={styles.modalContent}
            >
                <View style={styles.whiteBoard}>
                    <SignatureScreen
                        ref={signatureRef}
                        onOK={handleOK}
                    />
                </View>
            </Modal>
        </View >
    )
}
export default PaymentConfirmation;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },
    QRcode: {
        width: 200,
        height: 200
    },
    chooseFile: {
        color: 'gray'
    },
    icon: {
        paddingLeft: 10,
        paddingTop: 10
    },
    align: {
        flexDirection: 'row'
    },
    modalContent: {
        backgroundColor: 'white',
        height: '50%'
    },
    whiteBoard: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 10,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: width * 0.04,
        color: 'black',
        marginTop: 10,
    },
    required:{
        fontWeight: '500',
        fontSize: width * 0.025,
        color: 'red',
        marginTop: 16,
    },

    fileBackground: {
        backgroundColor: '#E3E3E3',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 10,

    },
    signatureFileBackground: {
        backgroundColor: '#E3E3E3',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    containerr: {
        flex: 1,
        backgroundColor: 'white',
        width: '90%',
        marginLeft: '5%',
        paddingBottom: '5%',
        marginBottom: 50,
    },
    file: {
        color: '#515151'
    },
    logoImage: {
        width: width * 0.4,
        height: width * 0.14,
        resizeMode: 'contain',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 30,
    },
    textInput: {
        backgroundColor: 'transparent',
        color: 'black'

    },

    popUp: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'red',
        backgroundColor: 'white',
        width: width * 0.8,
        padding: 10,
        marginLeft:width * 0.1,
        // alignItems:'center',
    },
    crossBtn: {
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        marginLeft: '5%',
        marginBottom: 10,
    },
    optionBtns: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginBottom: 10,

    },
    optionS: {
        width: '30%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'red',
        paddingTop: 7,
        paddingBottom: 7
    },
    uploadedImage: {
        width: width * 0.3,
        height: width * 0.3,
        marginRight: 10,
    },
    remarkView: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#E8E8E8',
        paddingTop: 10,
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
        // borderRadius: 10,
        height: 100,
    }, RadioButton: {
        height: 20,
        width: 10,
    },
    secondImage: {
        backgroundColor: '#E3E3E3',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 10,
    }
})






