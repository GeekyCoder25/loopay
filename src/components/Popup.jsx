import React, { useContext, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import BoldText from './fonts/BoldText';
import FaIcon from '@expo/vector-icons/Ionicons';
import { AppContext } from './AppContext';
import RegularText from './fonts/RegularText';
import { deleteFetchData, putFetchData } from '../../utils/fetchAPI';

const Popup = () => {
  const { showPopUp, setShowPopUp, appData, setAppData } =
    useContext(AppContext);
  const [popUps, setPopUps] = useState(appData.popUps);

  const handleClose = async popUpID => {
    setShowPopUp(false);
    setAppData(prev => {
      return {
        ...prev,
        popUps: popUps.filter(index => index.popUpID !== popUpID),
      };
    });
    setPopUps(prev => prev.filter(index => index.popUpID !== popUpID));
    const response = await deleteFetchData(`user/popup/${popUpID}`);
    console.log(response);
  };

  return (
    <Modal visible={showPopUp} animationType="fade" transparent>
      <Pressable style={styles.overlay} />
      {popUps.slice(0, 1).map(popUp => (
        <View style={styles.modalContainer} key={popUp.popUpID}>
          <View style={styles.modal}>
            <Pressable
              style={styles.close}
              onPress={() => handleClose(popUp.popUpID)}>
              <FaIcon name="close-circle" size={40} color={'#fff'} />
            </Pressable>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.body}>
                <BoldText>{popUp.title}</BoldText>
                <RegularText>{popUp.message}</RegularText>
              </View>
            </ScrollView>
          </View>
        </View>
      ))}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 80 + '%',
    height: 50 + '%',
    elevation: 10,
    alignItems: 'center',
    borderRadius: 8,
    gap: 30,
  },
  modalScroll: {},
  body: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
  },
  close: {
    position: 'absolute',
    right: -35,
    top: -40,
    zIndex: 9,
  },
});
export default Popup;
