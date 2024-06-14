import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FC } from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');

interface Props {}
const Appbar: FC<Props> = (): JSX.Element => {
  const navigation = useNavigation();
  return (
    <View style={{ width: '90%', marginLeft: '5%', marginTop: '0%' }}>
    <View style={styles.header}>
                                <IonIcon name="chevron-back-sharp" size={35} color="black" 
                                 onPress={() => navigation.dispatch(CommonActions.goBack())}/>
                                <Image
                                    source={require('../Images/Logo.png')}
                                    style={styles.logoImage}
                                />
                                <Text> </Text>
                            </View>
                            </View>
    );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 30,
},
logoImage: {
    width: width * 0.4,
    height: width * 0.14,
    contain: 'cover',
},
});

export default Appbar;