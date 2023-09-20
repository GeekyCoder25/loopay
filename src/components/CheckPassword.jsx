/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import Header from './Header';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Lock from '../../assets/images/lock.svg';
import Eye from '../../assets/images/eye.svg';
import { AppContext } from './AppContext';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';
import Button from './Button';
import BoldText from './fonts/BoldText';

const CheckPassword = ({
  setPasswordIsValid,
  setRemembersPassword,
  errorMessage,
  setErrorMessage,
  errorKey,
  setErrorKey,
  header,
}) => {
  const { appData, setIsLoading } = useContext(AppContext);
  const [hidePassword, setHidePassword] = useState(true);
  const [inputFocus, setInputFocus] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
  });

  const { email } = appData;

  const handlePress = async () => {
    try {
      setIsLoading(true);
      if (Object.values(formData).includes('')) {
        setErrorMessage('Please input your current password');
        return setErrorKey(true);
      }
      const fetchResult = await postFetchData('auth/check-password', formData);
      const { data: result } = fetchResult;
      if (result === true) {
        return setPasswordIsValid(true);
      }
      setErrorMessage(result.error || result);
      setErrorKey(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForget = () => {
    setIsLoading(true);
    setErrorMessage('');
    postFetchData('auth/forget-password', {
      email,
    }).then(result => {
      result = result.data;
      if (result?.email === email) {
        setRemembersPassword(false);
      } else {
        setErrorMessage('Server error');
      }
      setIsLoading(false);
    });
  };

  const editInput = () => {
    setErrorMessage('');
    setErrorKey(false);
  };

  return (
    <>
      <View style={styles.form}>
        {header || (
          <Header
            title={'Change Password'}
            text={
              'To change your password, kindly input your current password below to continue.'
            }
          />
        )}
        <View style={styles.textInputContainer}>
          <View style={styles.icon}>
            <Lock fill={inputFocus ? '#000' : '#868585'} />
          </View>
          <TextInput
            style={{
              ...styles.textInput,
              borderColor: errorKey ? 'red' : inputFocus ? '#000' : '#B1B1B1',
            }}
            placeholder={'Enter your password here to continue'}
            onChangeText={text => {
              editInput();
              setFormData({ password: text });
            }}
            name={'password'}
            inputMode={'text'}
            autoCapitalize="none"
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            secureTextEntry={hidePassword}
            maxLength={6}
          />
          <Pressable
            style={styles.eye}
            onPress={() => setHidePassword(prev => !prev)}>
            <Eye />
          </Pressable>
        </View>
        <View style={styles.forgetPressable}>
          <Pressable onPress={handleForget}>
            <BoldText style={styles.forget}>Forget Password?</BoldText>
          </Pressable>
        </View>
        <ErrorMessage errorMessage={errorMessage} />
      </View>
      <Button text={'Continue'} onPress={handlePress} style={styles.button} />
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1.5,
    paddingVertical: 30,
    minHeight: 150,
  },
  textInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  textInputContainer2: {
    position: 'relative',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 30,
  },
  icon: {
    position: 'absolute',
    left: 10,
    zIndex: 9,
    top: 30 + '%',
  },
  textInput: {
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 40,
    borderWidth: 1,
    alignItems: 'flex-start',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
  },
  eye: {
    height: 100 + '%',
    position: 'absolute',
    right: 0,
    paddingHorizontal: 15,
    zIndex: 9,
    justifyContent: 'center',
  },
  forgetPressable: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forget: {
    fontWeight: '600',
  },
  button: {
    marginBottom: 50,
  },
});
export default CheckPassword;
