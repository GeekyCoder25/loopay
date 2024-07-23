import { StyleSheet, View } from 'react-native';
import RegularText from './fonts/RegularText';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';

const ErrorMessage = ({ errorMessage, style }) => {
  useEffect(() => {
    errorMessage &&
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
  }, [errorMessage]);

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
