import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Button, ScrollView, TouchableOpacity, Platform, PermissionsAndroid, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';


const Selector = () => {

    const [selectedValue, setSelectedValue] = useState('');

    const options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        // { label: 'Option 3', value: 'option3' },
    ];

    return (
        <View>
            <Picker
                onValueChange={(value) => setSelectedValue(value)}
                selectedValue={selectedValue} >
                {options.map(option => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
            </Picker>
        </View>
    )
}

export default Selector

// const styles = StyleSheet.create({})