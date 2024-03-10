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
    backgroundColor: '#1e1e1e',
    animation: true,
    opacity: 1,
    containerStyle: styles.containerStyle,
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
  containerStyle: {
    maxWidth: 350,
    paddingHorizontal: 10,
    borderRadius: 50,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 350,
    overflow: 'hidden',
    transform: [{ translateY: 1 }],
  },
  imageContainer: {
    borderRadius: 200,
  },
  image: {
    borderRadius: 255,
    width: 25,
    height: 25,
  },
  message: {
    marginLeft: 10,
    maxWidth: 250,
    textAlign: 'center',
    color: '#fff',
  },
});
export default ToastMessage;
