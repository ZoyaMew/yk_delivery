import { FC } from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

interface Props {}
const Loading: FC<Props> = (): JSX.Element => {
   return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    })
export default Loading;