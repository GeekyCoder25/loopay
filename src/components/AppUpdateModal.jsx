import { StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import RegularText from './fonts/RegularText';
import Button from './Button';
import * as Updates from 'expo-updates';
import { AppContext } from './AppContext';

const AppUpdateModal = ({ visible }) => {
  const { setIsUpdateAvailable } = useContext(AppContext);

  const handlePress = async () => {
    Updates.reloadAsync();
    setIsUpdateAvailable(false);
  };

  return (
    <View style={styles.modalBg}>
      <View style={styles.overlay} />
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <RegularText style={styles.text}>
            An app update is available, restart app to get your best app
            experience now
          </RegularText>
          <Button text={'Restart App'} onPress={handlePress} />
        </View>
      </View>
    </View>
  );
};

export default AppUpdateModal;

const styles = StyleSheet.create({
  modalBg: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 100 + '%',
    height: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 100 + '%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    zIndex: 9,
    paddingVertical: 30,
    paddingHorizontal: 30,
  },
  text: {
    textAlign: 'center',
  },
});
