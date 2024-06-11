import { StyleSheet, View } from 'react-native';
import RegularText from './fonts/RegularText';
import { Ionicons } from '@expo/vector-icons';

const ErrorMessage = ({ errorMessage, style }) => {
  return (
    errorMessage && (
      <View style={{ ...styles.errorMessage, ...style }}>
        <Ionicons name="warning-sharp" size={15} color={'red'} />
        <RegularText style={styles.errorMessageText}>
          {errorMessage}
        </RegularText>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorMessageText: {
    fontSize: 14,
    marginBottom: 5,
    paddingHorizontal: 5,
    color: 'red',
    textAlign: 'center',
  },
});
export default ErrorMessage;
