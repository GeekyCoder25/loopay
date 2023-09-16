/* eslint-disable react-native/no-inline-styles */
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import BoldText from './fonts/BoldText';
import RegularText from './fonts/RegularText';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './AppContext';
import Button from './Button';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';
import { PINInputFields } from './InputPinPage';

const LoggedInForgetPassword = ({ setPasswordIsValid }) => {
  const { appData, setIsLoading } = useContext(AppContext);
  const { email } = appData;
  const [formData] = useState({
    email,
  });
  const [otpCode, setOtpCode] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [otpTimeout, setOtpTimeout] = useState(0);
  const [otpResend, setOtpResend] = useState(60);
  const inputRef = useRef();

  const codeLengths = [1, 2, 3, 4];

  useEffect(() => {
    setIsPinOkay(otpCode.length === codeLengths.length);
  }, [codeLengths.length, otpCode.length]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const result = await postFetchData(
        `auth/confirm-otp/${otpCode || 'fake'}`,
        formData,
      );
      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      } else if (result.status === 200) return setPasswordIsValid(true);
      setErrorKey('otpCode');
      return setErrorMessage(result.data.error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setOtpCode('');
      }, 1500);
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
        {codeLengths.map(input => (
          <PINInputFields
            key={input}
            codeLength={input}
            pinCode={otpCode}
            inputRef={inputRef}
            errorKey={errorKey}
          />
        ))}
      </View>
      <TextInput
        autoFocus
        style={styles.codeInput}
        inputMode="numeric"
        onChangeText={text => {
          setOtpCode(text);
          text.length === codeLengths.length && Keyboard.dismiss();
          setErrorMessage('');
          setErrorKey('');
        }}
        maxLength={codeLengths.length}
        ref={inputRef}
        value={otpCode}
      />
      <ErrorMessage errorMessage={errorMessage} />
      <View style={styles.button}>
        <Button
          text={'Confirm One time password'}
          onPress={handleConfirm}
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
    height: 1,
    width: 1,
  },
  errorMessageText: {
    fontSize: 14,
    marginBottom: 5,
    paddingHorizontal: 5,
    color: 'red',
    textAlign: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
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
