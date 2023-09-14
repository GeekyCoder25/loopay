import { useEffect, useRef } from 'react';
import { postFetchData } from '../../utils/fetchAPI';
import RegularText from './fonts/RegularText';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import BoldText from './fonts/BoldText';
import { PINInputFields } from './InputPinPage';
import { TextInput } from 'react-native-gesture-handler';

const NoPInSet = ({
  otpCode,
  setOtpCode,
  setErrorMessage,
  errorKey,
  setErrorKey,
  formData,
  otpResend,
  setOtpResend,
  otpTimeout,
  setOtpTimeout,
}) => {
  const inputRef = useRef();
  const codeLengths = [1, 2, 3, 4];

  useEffect(() => {
    setTimeout(() => {
      otpResend > 1 ? setOtpResend(prev => prev - 1) : setOtpResend('now');
      otpResend === 1 && setOtpTimeout(prev => prev * 2);
    }, 1000);
  }, [otpResend, setOtpResend, setOtpTimeout]);

  const handleResend = async () => {
    const result = await postFetchData('auth/forget-password', formData);
    if (result === "Couldn't connect to server") {
      return setErrorMessage(result);
    }
    setOtpResend(otpTimeout);
  };
  return (
    <>
      <RegularText>Enter six digit Pin sent to your mail</RegularText>
      <View style={styles.changePinCodeLengthsContainer}>
        {codeLengths.map(input => (
          <PINInputFields
            key={input}
            codeLength={input}
            pinCode={otpCode}
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
          setOtpCode(text);
          text.length === codeLengths.length && Keyboard.dismiss();
          setErrorMessage('');
          setErrorKey('');
        }}
        maxLength={codeLengths.length}
        ref={inputRef}
        value={otpCode}
      />
      <View style={styles.didnt}>
        <BoldText>Didn&apos;t receive the code? Resend </BoldText>
        {typeof otpResend === 'number' ? (
          <BoldText>
            in{' '}
            <BoldText style={styles.now}>
              {otpResend > 59 && Math.floor(otpResend / 60) + 'm '}
              {otpResend % 60}s
            </BoldText>
          </BoldText>
        ) : (
          <Pressable onPress={handleResend}>
            <BoldText style={styles.now}>{otpResend}</BoldText>
          </Pressable>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  changePinCodeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
  didnt: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
  },
  now: {
    color: 'orange',
    textDecorationLine: 'underline',
  },
});

export default NoPInSet;
