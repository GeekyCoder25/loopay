import React, { useContext } from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { AppContext } from './AppContext';

const LoadingModal = ({ isLoading }) => {
  const { loadingModalBg } = useContext(AppContext);

  return (
    isLoading && (
      <View style={styles.container}>
        <Pressable style={styles.overlay} />
        <View
          style={{ ...styles.modalContainer, backgroundColor: loadingModalBg }}>
          <ActivityIndicator
            size={'large'}
            color={'#1e1e1e'}
            style={styles.modal}
          />
        </View>
      </View>
    )
  );
};
const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    position: 'absolute',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 99,
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
