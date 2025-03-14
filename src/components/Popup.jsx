import React, { useContext, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import BoldText from './fonts/BoldText';
import IonIcon from '@expo/vector-icons/Ionicons';

import { AppContext } from './AppContext';
import RegularText from './fonts/RegularText';
import useFetchData from '../../utils/fetchAPI';
import { ResizeMode, Video } from 'expo-av';

const Popup = () => {
  const { deleteFetchData } = useFetchData();

  const {
    showPopUp,
    setShowPopUp,
    appData,
    setAppData,
    setPopUpClosed,
    vw,
    vh,
  } = useContext(AppContext);
  const [popUps, setPopUps] = useState(appData.popUps);

  const handleClose = async popUpID => {
    setShowPopUp(false);
    setPopUpClosed(prev => prev + 1);
    setAppData(prev => {
      return {
        ...prev,
        popUps: popUps.filter(index => index.popUpID !== popUpID),
      };
    });
    setPopUps(prev => prev.filter(index => index.popUpID !== popUpID));
    await deleteFetchData(`user/popup/${popUpID}`);
  };
  const height = {
    width: vw * 0.9,
    height: vh * 0.5,
    maxHeight: 800,
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
              <IonIcon name="close-circle" size={40} color={'#fff'} />
            </Pressable>
            <View style={styles.modalScroll}>
              <ScrollView>
                <View style={styles.body}>
                  <BoldText style={styles.headerText}>{popUp.title}</BoldText>
                  <RegularText>{popUp.message}</RegularText>
                  {popUp.image && (
                    <Image
                      source={{ uri: popUp.image }}
                      style={height}
                      resizeMode="contain"
                    />
                  )}
                  {popUp.video && (
                    <Video
                      source={{
                        uri: popUp.video,
                      }}
                      style={height}
                      useNativeControls={false}
                      resizeMode={ResizeMode.CONTAIN}
                      isLooping
                      usePoster
                      posterSource={require('../../assets/images/video_loading.jpg')}
                      posterStyle={height}
                      shouldPlay
                    />
                  )}
                </View>
              </ScrollView>
            </View>
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
    width: 85 + '%',
    maxHeight: 70 + '%',
    elevation: 10,
    alignItems: 'center',
    borderRadius: 8,
    gap: 30,
  },
  headerText: {
    fontSize: 20,
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
