import BoldText from './fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

const ErrorMessage = ({ errorMessage }) => {
  return (
    errorMessage && (
      <BoldText style={styles.errorMessageText}>
        <FaIcon name="warning" size={15} color={'red'} />
        {'  '}
        {errorMessage}
      </BoldText>
    )
  );
};

const styles = StyleSheet.create({
  errorMessageText: {
    fontSize: 14,
    marginBottom: 5,
    paddingHorizontal: 5,
    color: 'red',
    textAlign: 'center',
  },
});
export default ErrorMessage;
