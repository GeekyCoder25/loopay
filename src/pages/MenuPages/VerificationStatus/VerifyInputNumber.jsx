/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { View, StyleSheet, TextInput } from 'react-native';
import ErrorMessage from '../../../components/ErrorMessage';
import RegularText from '../../../components/fonts/RegularText';
import Button from '../../../components/Button';
import { AppContext } from '../../../components/AppContext';
import ToastMessage from '../../../components/ToastMessage';
import useFetchData from '../../../../utils/fetchAPI';

const VerifyInputNumber = ({ route, navigation }) => {
  const { postFetchData } = useFetchData();
  const { setIsLoading, setVerified } = useContext(AppContext);
  const [errorKey, setErrorKey] = useState();
  const params = route.params;
  const [idType, setIdType] = useState({
    ...params.idType,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async () => {
    try {
      if (!idType.value) {
        return setErrorMessage(`Please input your ${idType.name}`);
      }

      setIsLoading(true);
      const body = { ...route.params, idType };
      const response = await postFetchData('user/verify', body);
      if (response.status === 200) {
        setVerified('pending');
        ToastMessage(
          'Verification submitted successfully, awaiting confirmation',
        );
        return navigation.popToTop();
      }
      throw new Error(response.data.message);
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer avoidKeyboardPushup padding>
      <BoldText style={styles.headerText}>
        Please provide your {idType.name}
      </BoldText>
      <View style={styles.form}>
        <View>
          <RegularText style={styles.label}>{idType.name}</RegularText>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              borderColor: errorKey ? 'red' : '#ccc',
            }}
            inputMode="numeric"
            onChangeText={text =>
              setIdType(prev => {
                setErrorMessage('');
                setErrorKey('');
                return { ...prev, value: text };
              })
            }
            maxLength={11}
          />

          {errorMessage && (
            <ErrorMessage
              errorMessage={errorMessage}
              style={styles.errorMessage}
            />
          )}
        </View>
      </View>
      <Button text={'Submit'} style={styles.button} onPress={handleVerify} />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 15,
  },
  textInput: {
    borderRadius: 5,
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
  errorMessage: {
    marginTop: 20,
  },
  form: {
    marginVertical: 50,
    flex: 1,
  },
  button: {
    marginBottom: 30,
  },
});
export default VerifyInputNumber;
