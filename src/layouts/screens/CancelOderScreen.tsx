import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Button, ScrollView, Pressable, Platform, PermissionsAndroid, TextInput, ActivityIndicator, } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { ImagePickerResponse } from 'react-native-image-picker/types';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { FormPostMethod, getMethod } from '../../utils/helper';
import Snackbar from 'react-native-snackbar';
import { CommonActions } from '@react-navigation/native';
import Appbar from '../../component/Appbar';
import { useSelector } from 'react-redux';



const { width } = Dimensions.get('window');


export default function CancelOderScreen({ navigation, route }: any) {
  const translations = useSelector((state: any) => state.language.translations);

  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);

  const [remark, setRemark] = useState<string>();
  const { oderNo } = route.params;
  const [selectedOptionValue, setSelectedOptionValue] = useState<string>(''); // Selected value in the Picker
  const [cancelReasons, setCancelReasons] = useState<{ label: string; value: string }[]>([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState('');

  // console.log("oderNo", oderNo);
  useEffect(() => {
    getCancelReasons(); // Call the API to get cancel reasons when the component mounts
  }, []);

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

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 4 - imageUris.length,
    };
  
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else {
        const selectedImages = response.assets ? response.assets.map((asset: { uri: any }) => asset.uri) : [response.uri];
        setImageUris((prevUris) => [...prevUris, ...selectedImages]);
        console.log("selectedImages", selectedImages)
      }
      toggleModal();
    });
  };

  const openCamera = async () => {
    await requestCameraPermission();
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      // includeBase64: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else {
        const selectedImages = response.assets ? response.assets.map((asset: { uri: any }) => asset.uri) : [response.uri];
        setImageUris((prevUris) => [...prevUris, ...selectedImages]);
        console.log("selectedImages", selectedImages)
      }
      toggleModal();
    });
  };


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const getCancelReasons = async () => {
    try {
      setLoading(true);
      const api: any = await getMethod('deliveryman/all-cancel-reason');
      if (api.status === 200) {
        const reasonsFromApi = api.data.data.map((reason: any) => ({
          label: reason.cancel_reason,
          value: reason.id.toString(), // Assuming you want to use the ID as the value
        }));
        setCancelReasons(reasonsFromApi);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.log('Error fetching cancel reasons:', e);
      setLoading(false);
    }
  };


  const uploadImages = async () => {
    const formData = new FormData();
         imageUris.forEach((uri, index) => {
        formData.append('cancel_image[]', {
          uri: uri,
          type: 'image/jpg',
          name: `image${index}.jpg`,
        });
      });
    
    // Append texts to the formData
    formData.append('consolidate_order_no', oderNo);
    formData.append('cancel_reason', selectedValue);
    formData.append('cancel_remarks', remark);
    try {
      setLoad(true);
      const api: any = await FormPostMethod(`deliveryman/cancel-order`, formData);
      if (api.data.status === true) {
        console.log("cancel", api.data)
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'green',
        });
        setImageUris([]);
        navigation.dispatch(CommonActions.goBack())
        setLoad(false);
      }
      else {
        setLoad(false);
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
         <Appbar/>
          <View style={{ marginTop: 50 }}>
            <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: 'black' }}>{translations.cancellation_order.reason_cancellation}</Text>
            <View style={{ marginTop: 10 }}>
              <Picker
                onValueChange={(value) =>
                  setSelectedValue(value)}
                style={{
                  fontSize: width * 0.038,
                  backgroundColor: 'lightgrey',
                  borderRadius: 10,
                  color: 'black',
                }}
                selectedValue={selectedValue}>
                <Picker.Item label="Select Option" value="" />
                {cancelReasons.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    style={{ fontSize: width * 0.038 }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: 'black' }}>{translations.cancellation_order.Remarks}</Text>
            <View style={styles.remarkView}>
              <TextInput multiline
                value={remark}
                onChangeText={setRemark}
                style={styles.textInput} />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: 'black' }}>{translations.cancellation_order.Upload_Images}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
            <ScrollView horizontal>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                {imageUris.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.uploadedImage} />
                ))}
                {imageUris.length < 4 && (
                  <Pressable style={styles.imageSelector}
                    // onPress={openImageLibrary}  
                    onPress={toggleModal}>
                    <MaterialCommunityIcons name="plus" size={width * 0.1} color="grey" />
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </View>

          <Modal isVisible={isModalVisible}>
            <View style={styles.popUp}>
              <View style={styles.crossBtn}>
                <View><Text> </Text></View>
                <Pressable onPress={toggleModal} >
                  <Text style={{ color: 'grey', fontSize: width * 0.06, paddingBottom: 3 }}>X</Text>
                </Pressable>
              </View>
              <View style={styles.optionBtns}>
                <Pressable style={styles.optionS} onPress={openImageLibrary}>
                  <MaterialIcons name="insert-photo" size={width * 0.1} color="red" />
                  <Text style={{ color: 'black' }}>Library</Text>
                </Pressable>
                <Pressable style={styles.optionS} onPress={openCamera}>
                  <MaterialCommunityIcons name="camera" size={width * 0.1} color="red" />
                  <Text style={{ color: 'black' }}>Camera</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <View style={{ marginTop: 30 }}>
            <Pressable style={styles.submitBtn} onPress={() => uploadImages()}>
              {load ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitBtnText}>{translations.cancellation_order.SUBMIT}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  containerr: {
    flex: 1,
    backgroundColor: 'white',
    width: '90%',
    marginLeft: '5%',
    paddingBottom: '5%',
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
  remarkView: {
    marginTop: 20,
    backgroundColor: '#E8E8E8',
    paddingTop: 10,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 10,
    height: 100,
  },
  submitBtn: {
    backgroundColor: '#EC1C24',
    width: '25%',
    padding: 10,
    borderRadius: 10,
  },
  submitBtnText: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: 'white',
    textAlign: 'center',
  },
  imageSelector: {
    height: width * 0.3,
    width: width * 0.3,
    backgroundColor: '#E3E3E3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: width * 0.3,
    height: width * 0.3,
    marginRight: 20,
  },
  textInput: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 0,
    color: 'black'
  },
  popUp: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'red',
    backgroundColor: 'white',
    width: width * 0.8,
    padding: 10,
    marginLeft: '5%'
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
});


