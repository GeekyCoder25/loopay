import {
  Image,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';

const ToastMessage = message => {
  if (Platform.OS === 'android') {
    return ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  return Toast.show(
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>,
    {
      position: -50,
      backgroundColor: '#f0f0f3',
      textColor: '#000',
      animation: true,
      shadow: false,
    },
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    maxWidth: 350,
    paddingTop: 5,
    // paddingHorizontal: 2 + '%',
  },
  imageContainer: {
    // padding: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  image: {
    borderRadius: 15,
    width: 25,
    height: 25,
  },
  message: {
    fontWeight: '500',
  },
});
export default ToastMessage;
