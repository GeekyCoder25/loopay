import React, { useContext, useRef, useState } from 'react';
import NoPInSet from './NoPinSet';
import { PINInputFields } from './InputPinPage';
import RegularText from './fonts/RegularText';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { AppContext } from './AppContext';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';
import Button from './Button';

const InputPin = ({
  children,
  buttonText,
  setIsValidPin,
  customFunc,
  style,
}) => {
  const { appData, setIsLoading, vh } = useContext(AppContext);
  const [otpTimeout, setOtpTimeout] = useState(60);
  const [otpResend, setOtpResend] = useState(otpTimeout);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [haveSetPin] = useState(appData.pin);
  const [pinCode, setPinCode] = useState('');
  const [formData] = useState({
    email: appData.email,
  });
  const inputRef = useRef();

  const codeLengths = [1, 2, 3, 4];

  const handlePay = async () => {
    setIsLoading(true);
    try {
      if (haveSetPin) {
        const result = await postFetchData('user/check-pin', {
          pin: pinCode,
        });
        if (result === "Couldn't connect to server") {
          return setErrorMessage(result);
        }
        if (result.status === 200) {
          setIsValidPin && setIsValidPin(true);
          return await customFunc(true);
        }
        setErrorMessage(result.data);
        setErrorKey('pinCode');
      } else {
        const result = await postFetchData(
          `auth/confirm-otp/${otpCode || 'fake'}`,
          formData,
        );
        if (result === "Couldn't connect to server") {
          return setErrorMessage(result);
        }
        if (result.status === 200) {
          setIsValidPin && setIsValidPin(true);
          return await customFunc();
        }
        setErrorMessage('Incorrect OTP Code');
        setErrorKey('otpCode');
      }
      setTimeout(() => {
        setPinCode('');
        setOtpCode('');
        inputRef.current.focus();
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ ...styles.container, minHeight: vh * 0.55, ...style }}>
      <View style={styles.pinContainer}>
        <>
          <RegularText>Enter your transaction pin</RegularText>
          <View style={styles.changePinCodeLengthsContainer}>
            {codeLengths.map(input => (
              <PINInputFields
                key={input}
                codeLength={input}
                pinCode={pinCode}
                setErrorMessage={setErrorMessage}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                inputRef={inputRef}
              />
            ))}
          </View>
          <TextInput
            autoFocus
            style={styles.codeInput}
            inputMode="numeric"
            onChangeText={text => {
              setPinCode(text);
              text.length === codeLengths.length && Keyboard.dismiss();
              setErrorMessage('');
              setErrorKey('');
            }}
            maxLength={codeLengths.length}
            ref={inputRef}
            value={pinCode}
          />
        </>
      </View>
      <ErrorMessage errorMessage={errorMessage} />
      {children}
      <Button
        text={buttonText || 'Pay now'}
        onPress={handlePay}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  pinContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  changePinCodeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
  codeInput: {
    height: 1,
    width: 1,
  },
});

export default InputPin;
