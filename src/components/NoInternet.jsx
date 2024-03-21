import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import BoldText from './fonts/BoldText';
import Button from './Button';
import { AppContext } from './AppContext';
import * as SplashScreen from 'expo-splash-screen';
import { apiUrl } from '../../utils/fetchAPI';

const NoInternet = ({ modalOpen }) => {
  const { setInternetStatus, isChecking, setIsChecking } =
    useContext(AppContext);
  const [showURL, setShowURL] = useState(false);

  const getFetchData = async () => {
    const API_URL = `${apiUrl}/network`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(API_URL, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await response.json();
      return data;
    } catch (err) {
      return "Couldn't connect to server";
    }
  };

  const handlePress = () => {
    setIsChecking(true);
    getFetchData().then(data => {
      setIsChecking(false);
      if (data.network === true) {
        setInternetStatus(true);
        SplashScreen.hideAsync();
      }
    });
  };

  return (
    <Modal
      visible={modalOpen}
      animationType="slide"
      transparent
      onRequestClose={handlePress}>
      <View style={styles.overlay} />
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.face}>
            {/* <Icon
              name="sentiment-very-dissatisfied"
              size={85}
              color={globalStyles.themeColorSolo}
            /> */}
          </View>
          {showURL && <BoldText style={styles.text}>{apiUrl}</BoldText>}
          <BoldText style={styles.text}>No Internet Connection</BoldText>
          {isChecking ? (
            <ActivityIndicator
              color={'#1e1e1e'}
              style={styles.activity}
              size="large"
            />
          ) : (
            <Button text={'Try Again'} onPress={handlePress} />
          )}
        </View>
        <Pressable
          style={styles.show}
          onLongPress={() => setShowURL(prev => !prev)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#000',
    opacity: 0.5,
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    minHeight: 100,
    maxWidth: 700,
    paddingHorizontal: 5 + '%',
    paddingVertical: 20,
    // borderRadius: 8,
    elevation: 10,
    justifyContent: 'center',
  },
  face: {
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
  activity: {
    marginVertical: 20,
  },
  show: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: 30,
  },
});

export default NoInternet;
