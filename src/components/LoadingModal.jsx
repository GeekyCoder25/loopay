import React, { useContext } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Modal,
  View,
  StyleSheet,
} from 'react-native';
import { AppContext } from './AppContext';

const LoadingModal = ({ isLoading }) => {
  const { loadingModalBg } = useContext(AppContext);
  return (
    <Modal visible={isLoading} animationType="fade" transparent>
      <Pressable style={styles.overlay} />
      <View
        style={{ ...styles.modalContainer, backgroundColor: loadingModalBg }}>
        <ActivityIndicator
          size={'large'}
          color={'#1e1e1e'}
          style={styles.modal}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  modal: {},
});
export default LoadingModal;
