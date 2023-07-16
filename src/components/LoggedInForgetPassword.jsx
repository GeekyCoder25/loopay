/* eslint-disable react-native/no-inline-styles */
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import BoldText from './fonts/BoldText';
import RegularText from './fonts/RegularText';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './AppContext';
import Button from './Button';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';

const LoggedInForgetPassword = ({ setPassowrdIsValid }) => {
  const { appData, setIsLoading } = useContext(AppContext);
  const { email } = appData;
  const [focusIndex, setFocusIndex] = useState(1);
  const [formData] = useState({
    email,
    otpCodeLength: 6,
  });
  const [otpCode, setOtpCode] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [otpTimeout, setOtpTimeout] = useState(0);
  const [otpResend, setOtpResend] = useState(60);

  const codeLengths = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    setIsPinOkay(otpCode.length === codeLengths.length);
  }, [codeLengths.length, otpCode.length]);

  const handleCofirm = async () => {
    try {
      setIsLoading(true);
      const result = await postFetchData(
        `auth/confirm-otp/${otpCode || 'fake'}`,
        formData,
      );
      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      } else if (Object.keys(result.data).includes('error')) {
        setErrorKey('otpCode');
        return setErrorMessage(result.data.error);
      }
      if (result.status < 400) setPassowrdIsValid(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsLoading(true);
    setErrorMessage('');
    postFetchData('auth/forget-password', formData).then(() => {
      setOtpResend(otpTimeout);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (otpTimeout === 0) {
      setOtpTimeout(60);
    }
    setTimeout(() => {
      otpResend > 1 ? setOtpResend(prev => prev - 1) : setOtpResend('now');
    }, 1000);
    otpResend === 1 && setOtpTimeout(prev => prev * 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpResend]);
  return (
    <View style={styles.form}>
      <View style={styles.headers}>
        <BoldText style={styles.heading}>Change Password</BoldText>
        <RegularText>
          To change your password, kindly enter the code sent to your mail{' '}
          <BoldText>{email}</BoldText>
        </RegularText>
      </View>
      <View style={styles.codeLengthsContainer}>
        {codeLengths.map(codeLength => (
          <OTPInput
            key={codeLength}
            codeLength={codeLength}
            focusIndex={focusIndex}
            setFocusIndex={setFocusIndex}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            setErrorMessage={setErrorMessage}
            errorKey={errorKey}
            setErrorKey={setErrorKey}
            codeLengths={codeLengths.length}
          />
        ))}
      </View>
      <ErrorMessage errorMessage={errorMessage} />
      <Button
        text={'Confirm One time password'}
        onPress={handleCofirm}
        style={{
          backgroundColor: isPinOkay ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
        }}
        disabled={!isPinOkay}
      />

      {typeof otpResend === 'number' ? (
        <BoldText style={styles.resend}>
          Resend in{' '}
          <BoldText style={styles.now}>
            {otpResend > 59 && Math.floor(otpResend / 60) + 'm '}
            {otpResend % 60}s
          </BoldText>
        </BoldText>
      ) : (
        <Pressable style={styles.resend} onPress={handleResend}>
          <BoldText style={styles.resendText}>Resend</BoldText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headers: {
    gap: 10,
    marginBottom: 5 + '%',
  },
  heading: {
    fontSize: 25,
  },
  form: {
    flex: 2,
    paddingVertical: 30,
    minHeight: 150,
  },
  codeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginVertical: 40,
  },
  codeInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center',
    fontSize: 35,
    fontFamily: 'OpenSans-700',
    width: 50,
    maxWidth: 8 + '%',
  },
  errorMessageText: {
    fontSize: 14,
    marginBottom: 5,
    paddingHorizontal: 5,
    color: 'red',
    textAlign: 'center',
  },
  resend: {
    marginVertical: 30,
    alignSelf: 'center',
  },
  resendText: {
    fontSize: 18,
  },
  now: {
    color: 'orange',
    textDecorationLine: 'underline',
  },
});
export default LoggedInForgetPassword;

export const OTPInput = ({
  codeLength,
  focusIndex,
  setFocusIndex,
  otpCode,
  setOtpCode,
  setErrorMessage,
  errorKey,
  setErrorKey,
  codeLengths,
}) => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (codeLength === focusIndex) {
      inputRef.current.focus();
      inputRef.current.clear();
      setInputValue('');
    }
  }, [focusIndex, codeLength]);

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key !== 'Backspace') {
      if (focusIndex < codeLengths) {
        setFocusIndex(prev => prev + 1);
      } else {
        Keyboard.dismiss();
        inputRef.current.blur();
      }
    } else {
      setOtpCode(prev => prev.slice(0, otpCode.length - 1));
      inputValue === ''
        ? focusIndex > 1 && setFocusIndex(prev => prev - 1)
        : inputRef.current.clear();
    }
  };

  return (
    <TextInput
      style={{
        ...styles.codeInput,
        borderBottomColor: errorKey === 'otpCode' ? 'red' : '#000',
        color: errorKey === 'otpCode' ? 'red' : '#000',
      }}
      value={inputValue}
      inputMode="numeric"
      maxLength={1}
      autoFocus={codeLength === focusIndex}
      ref={inputRef}
      onChangeText={text => {
        setInputValue(text);
        setOtpCode(prev => `${prev}${text}`);
      }}
      onKeyPress={handleKeyPress}
      onFocus={() => {
        setFocusIndex(codeLength);
        setErrorMessage('');
        setErrorKey('');
      }}
      name="otpCode"
    />
  );
};
