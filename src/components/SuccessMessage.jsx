import BoldText from './fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const SuccessMessage = ({ successMessage }) => {
  useEffect(() => {
    successMessage &&
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: successMessage,
      });
  }, [successMessage]);

  return (
    successMessage && (
      <BoldText style={styles.successMessageText}>
        <FaIcon name="check-circle" size={20} color="green" />
        {'  '}
        {successMessage}
      </BoldText>
    )
  );
};

const styles = StyleSheet.create({
  successMessageText: {
    marginBottom: 5,
    color: 'green',
    textAlign: 'center',
  },
});

export default SuccessMessage;
