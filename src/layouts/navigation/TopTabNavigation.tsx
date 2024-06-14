import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Cancelled from '../../screenComponent.tsx/Cancelled';
import Undelivered from '../../screenComponent.tsx/Undelivered';
import CustomTopTabBar from '../../component/CustomTopTabBar';
import Delivered from '../../screenComponent.tsx/Delivered';
import { StyleSheet, Text, View,Dimensions} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import { getMethod } from '../../utils/helper';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage } from '../../redux/features/languageSlice';
const TabTop = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get('window');

interface Props {
    navigation: any;
    route:any
}
const TopTabNavigation: React.FC<Props> = ({route }) => {
    const dispatch = useDispatch();

    const { date } = route.params;
    // console.log("date", date)
    const [isModalVisible, setModalVisible] = useState(false);
    const [checked, setChecked] = useState('first');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [oderCount, setOderCount] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    useFocusEffect(
        useCallback(() => {
            OderNumber()
        }, [])
    );
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const handleLanguageChange = (language: string) => {
        console.log("hii",)
        console.log('Dispatching language change:', language);
        setSelectedLanguage(language);
        dispatch(changeLanguage(language));
        toggleModal()
    };

    const OderNumber = async () => {

        try {
            setLoading(true);
            const api: any = await getMethod(`deliveryman/get_all_count?date=${date}`);
            if (api.status === 200) {
                console.log("..get_all_count..", api.data)
                setOderCount(api.data)
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
    return (
        <>
            <TabTop.Navigator
                tabBar={(props: any) => <CustomTopTabBar {...props} date={date} toggleModal={toggleModal} selectedLanguage={selectedLanguage} />}
            >
                <TabTop.Screen name="Undelivered" component={Undelivered}
                    initialParams={{ date: date }}
                    options={{ tabBarLabel: `Undelivered (${oderCount?.progress})` }} />
                <TabTop.Screen name="Delivered" component={Delivered}
                    initialParams={{ date: date }}
                    options={{ tabBarLabel: `Delivered (${oderCount?.complete})` }} />
                <TabTop.Screen name="Cancelled" component={Cancelled}
                    initialParams={{ date: date }}
                    options={{ tabBarLabel: `Cancelled (${oderCount?.cancel})` }} />
                {/* <Appbar/> */}
            </TabTop.Navigator>
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
                <View style={styles.modalContent} >
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: 10 }}>
                        <Text style={{ color: 'black', fontSize: width * 0.05, fontWeight: 'bold' }}>Language</Text>
                    </View>
                    <View>
                    <RadioButton.Group
                            onValueChange={handleLanguageChange}
                            value={selectedLanguage}>
                            <RadioButton.Item label="English" value="english" color="red" labelStyle={{ color: 'black' }} />
                            <RadioButton.Item label="Chinese" value="chinese" color="red" labelStyle={{ color: 'black' }} />
                        </RadioButton.Group>
                    </View>
                    {/* <Text style={styles.modalText}>This is your bottom popup modal.</Text> */}
                </View>
            </Modal>
        </>
    )
}
export default TopTabNavigation;
const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.3, // Adjust the height as needed
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
})