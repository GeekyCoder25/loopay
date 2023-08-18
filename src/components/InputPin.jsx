import React, { useContext, useState } from 'react';
import NoPInSet from './NoPinSet';
import { PINInputFields } from './InputPinPage';
import RegularText from './fonts/RegularText';
import { StyleSheet, View } from 'react-native';
import { AppContext } from './AppContext';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';
import Button from './Button';

const InputPin = ({ children, buttonText, setIsValidPin, customFunc }) => {
  const { appData, setIsLoading } = useContext(AppContext);
  const [otpTimeout, setOtpTimeout] = useState(60);
  const [otpResend, setOtpResend] = useState(otpTimeout);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusIndex, setFocusIndex] = useState(1);
  const [otpCode, setOtpCode] = useState('');
  const [haveSetPin] = useState(appData.pin);
  const [reload, setReload] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [formData] = useState({
    email: appData.email,
    otpCodeLength: 6,
  });

  const codeLengths = [1, 2, 3, 4];

  const handlePay = async () => {
    try {
      setIsLoading(true);
      if (haveSetPin) {
        const result = await postFetchData('user/check-pin', {
          pin: pinCode,
        });
        if (result === "Couldn't connect to server") {
          return setErrorMessage(result);
        }
        if (result.status === 200) {
          setIsValidPin && setIsValidPin(true);
          return customFunc(true);
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
        setReload(prev => !prev);
      }, 1500);
    } finally {
      setIsLoading(false);
      setTimeout(() => {}, 1000);
    }
  };
  return (
    <View>
      <View style={styles.pinContainer} key={reload}>
        {haveSetPin ? (
          <>
            <RegularText>Enter your transaction pin</RegularText>
            <View style={styles.changePinCodeLengthsContainer}>
              {codeLengths.map(input => (
                <PINInputFields
                  key={input}
                  codeLength={input}
                  focusIndex={focusIndex}
                  setFocusIndex={setFocusIndex}
                  pinCode={pinCode}
                  setPinCode={setPinCode}
                  setErrorMessage={setErrorMessage}
                  errorKey={errorKey}
                  setErrorKey={setErrorKey}
                  codeLengths={codeLengths.length}
                />
              ))}
            </View>
          </>
        ) : (
          <NoPInSet
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            setErrorMessage={setErrorMessage}
            errorKey={errorKey}
            setErrorKey={setErrorKey}
            otpResend={otpResend}
            setOtpResend={setOtpResend}
            otpTimeout={otpTimeout}
            setOtpTimeout={setOtpTimeout}
            formData={formData}
          />
        )}
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
  pinContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePinCodeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default InputPin;
