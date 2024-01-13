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

  const options = {
    position: -50,
    backgroundColor: '#f0f0f3',
    textColor: '#000',
    animation: true,
    shadow: true,
    opacity: 1,
    shadowColor: 'rgba(0,0,0,0.5)',
  };

  return Toast.show(
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>,
    options,
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    maxWidth: 350,
    paddingHorizontal: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  image: {
    borderRadius: 15,
    width: 25,
    height: 25,
  },
  message: {
    maxWidth: 250,
    textAlign: 'center',
  },
});
export default ToastMessage;
