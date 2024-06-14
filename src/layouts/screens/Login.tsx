import { StyleSheet, Text, View, Dimensions, Pressable, TextInput, ImageBackground, Image, Keyboard, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Fontisto';
import { postMethod, storeData } from '../../utils/helper';
import Feather from 'react-native-vector-icons/Feather';
import { Controller, useForm } from 'react-hook-form';
import Snackbar from 'react-native-snackbar';

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }: any) {

  const [isLoading, setLoading] = useState(false);
  const onSubmit = async (data: any) => {
    console.log('hii')
    Keyboard.dismiss()
    LogIn(data)

  }
  const LogIn = async (props: any) => {
    const raw = {
      email: props.email,
      password: props.password,
    }
    try {
      setLoading(true);
      const api: any = await postMethod(`login`, raw);
      if (api.data.status === true) {
        // console.log(".....", api.data)
        setLoading(false);
        await storeData(api.data);
        navigation.navigate('TabNavigation');
      }
      else {
        setLoading(false);
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#AE1717',
          backgroundColor: '#F2A6A6',
        });
      }
    }
    catch (e) {
      setLoading(false);

      console.log('catch', e)
    }
  }
  const { control, handleSubmit, formState: { errors, isValid }, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',

    }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: height * 1, justifyContent: 'center', alignItems: 'center', width: width * 1 }}>
        <ImageBackground
          source={require('../../Images/pattern.jpg')} style={styles.mainImagebg}>
          <View style={{ width: width * 0.9, marginLeft: '5%', display: 'flex', alignItems: 'center', }}>
            <Image source={require('../../Images/Logo.png')}
              style={{
                width: width * 0.4,
                height: width * 0.14,
                resizeMode: 'cover',
                marginTop: "20%",
                alignContent: 'center'
              }}
            />
            <View style={{ marginTop: width * 0.20, width: width * 0.8, height: width * 0.8 }}>
              <View style={styles.inputView}>
                <Text style={{ fontSize: 18, marginBottom: 5, color: 'black' }}>Email</Text>
                <View style={styles.inputarea}>
                  <IonIcon name="person" color={'grey'} size={width * 0.06} style={styles.icon} />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholderTextColor={'gray'}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder="Enter email"
                        underlineColorAndroid="transparent"
                      />
                    )}
                    name="email"
                  />

                </View>
              </View>
              {errors.email && errors.email.type === "required" && (
                <View style={{ flexDirection: 'row', marginTop: 7, marginLeft: 10 }}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color='red'
                    style={{ marginRight: 4, marginTop: -3 }} />
                  <Text style={styles.error}>Email is required.</Text>
                </View>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <View style={{ flexDirection: 'row', marginTop: 7, marginLeft: 10 }}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color='red'
                    style={{ marginRight: 4, marginTop: -3 }} />

                  <Text style={styles.error}>Email is not valid.</Text>
                </View>
              )}

              <View style={styles.inputView}>
                <Text style={{ fontSize: 18, marginBottom: 1, color: 'black' }}>Password</Text>
                <View style={styles.inputarea}>
                  <Icon name="locked" size={width * 0.06} color="grey" style={styles.icon} />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      minLength: 1
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholderTextColor={'gray'}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder="Enter password"
                        underlineColorAndroid="transparent"
                      />
                    )}
                    name="password"
                  />

                </View>
              </View>
              {errors.password && errors.password.type === "required" && (
                <View style={{ flexDirection: 'row', marginTop: 7, marginLeft: 10 }}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color='red'
                    style={{ marginRight: 4, marginTop: -3 }} />

                  <Text style={styles.error}>Password is required.</Text>
                </View>
              )}
              {errors.password && errors.password.type === "minLength" && (
                <View style={{ flexDirection: 'row', marginTop: 7, marginLeft: 10 }}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color='red'
                    style={{ marginRight: 4, marginTop: -3 }} />
                  <Text style={styles.error}>
                    Password should be at-least 6 characters.
                  </Text>
                </View>
              )}
              <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // width: width * 1,
    // height: width * 1,

  },
  error: {
    color: 'red',
    fontSize: 10,
    marginTop: -5
  },
  mainImagebg: {
    flex: 1,
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
  },
  inputView: {
    marginTop: '5%',
  },
  inputarea: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    width: width * 0.8,
    paddingLeft: 10,
    borderRadius: 15
  },
  input: {
    fontSize: width * 0.045,
    width: "90%",
    color: 'grey',
    marginLeft: "5%",
  },
  icon: {
    width: "10%",
    marginLeft: "3%",
    marginTop: "5%",
  },
  button: {
    backgroundColor: 'red',
    marginTop: width * 0.25,
    width: '60%',
    alignSelf: 'center',
    borderRadius: 35,
    padding: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonText: {
    fontSize: 22,
    justifyContent: 'center',
    color: 'white',
    alignItems: 'center',
    paddingVertical: 5

  }
})


