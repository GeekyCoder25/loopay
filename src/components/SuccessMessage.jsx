import BoldText from './fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

const SuccessMessage = ({ successMessage }) => {
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
