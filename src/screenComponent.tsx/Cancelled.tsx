
import { FC, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getMethod } from '../utils/helper';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import SwipeRefresh from '../component/SwipeRefresh';
import { useSelector } from 'react-redux';

interface Props {
  route: any;
  params: { date: any };
}
const { width } = Dimensions.get('window');

const Cancelled: FC<Props> = (props): JSX.Element => {
  const translations = useSelector((state) => state.language.translations);

  const { date } = props.route.params;
  const [isLoading, setLoading] = useState(false);
  const [track, setTrack] = useState({ data: [] });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navigation = useNavigation();


  useFocusEffect(
    useCallback(() => {
      cancelled();
    }, [])
);
  const cancelled = async () => {
    const apiDate = date || new Date().toISOString().slice(0, 10);
    try {
      setLoading(true);
      const api: any = await getMethod(`deliveryman/get-cancelled-order-list?date=${apiDate}`);
      if (api.status === 200) {
        // console.log(api.data)
        setTrack(api.data)
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



  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await cancelled();
    } catch (error) {
      console.log('Error refreshing:', error);
    }
    setRefreshing(false);
  };
  return (
    <SwipeRefresh onRefresh={onRefresh} refreshing={refreshing}>
      <ScrollView style={{marginBottom:20}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={'red'} />
        ) : (
          track?.data?.map((item, index) => (
            <Pressable key={index} onPress={() =>  navigation.dispatch(
              CommonActions.navigate({
                  name: 'OrderDetails',
                  params: { oderNo: item.consolidate_order_no }
              })
          )}>

              <View style={styles.detailedView}>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.orderNo}>{item.consolidate_order_no}</Text>
                  </View>
                  <View style={[styles.completeTagView, { backgroundColor: item.delivery_status === 'cancelled' ? 'red' : '#45E355' }]}>
                    <Text style={styles.completeTag}>{item.delivery_status}</Text>
                  </View>
                </View>
                <View style={styles.rowView}>
                  <Text style={styles.redText}>{translations.order_listing.Name}: </Text>
                  <Text style={styles.nameDetail}>{item.name}</Text>
                </View>
                <View style={styles.rowView}>
                  <Text style={styles.redText}>{translations.order_listing.Address}: </Text>
                  <Text style={styles.detailedText}>{item.address},{item.unit_no}</Text>
                </View>
                <View style={styles.rowView}>
                  <Text style={styles.redText}>{translations.order_listing.Payment_Method}: </Text>
                  <Text style={styles.detailedText}>{item.payment_type}{''}({item.final_amount})</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SwipeRefresh>
  )
};

const styles = StyleSheet.create({
  detailedView: {
    backgroundColor: '#E3E3E3',
    width: "90%",
    marginLeft: '5%',
    marginTop: 20,
    padding: 10,
    borderRadius: 10
  },
  detailedText: {
    color: 'black',
    fontSize: width * 0.03,
    // fontWeight: 'bold',

  },
  completeTagView: {
    marginTop: -10,
    marginBottom: 8,
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    marginRight: -10
  },
  completeTag: {
    color: 'white',
    fontSize: 14,
    paddingTop: 5
  },
  back: {
    position: 'absolute',
    bottom: 140,
    left: 5
  },
  mainImagebg: {
    width: width * 1,
    height: width * 0.46,
    flex: 1,
    resizeMode: 'cover',
  },
  ViewMap: {
    color: 'white',

  },
  info: {
    height: width * 0.15,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    marginTop: '5%',
  },
  profile: {
    height: "100%",
    width: "50%",
  },
  profileImage: {
    height: width * 0.2,
    width: width * 0.2,
    resizeMode: "contain",
    position: 'absolute',
    top: width * 0.03,
    left: "15%",
  },
  welcomeText: {
    position: 'absolute',
    top: "8%",
    left: '35%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '65%',
  },
  language: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDiv: {
    marginTop: "25%"
  },
  direction: {
    flexDirection: 'row',
    position: "absolute",
    right: 30,
    bottom: 10,
    backgroundColor: '#EC1C24',
    width: 120,
    padding: 10,
    justifyContent: 'space-around'
  },
  rowView: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    paddingVertical: 5
  },
  orderNo: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: 'black',
    paddingVertical: 5
  },
  redText: {
    color: 'red',
    fontSize: width * 0.03
  },
  orderDate: {
    width: '90%',
    marginLeft: '5%',
    marginTop: 10,
  },
  nameDetail: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14
  }
});

export default Cancelled;