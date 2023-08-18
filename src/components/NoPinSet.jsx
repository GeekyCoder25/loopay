import { useEffect, useState } from 'react';
import { postFetchData } from '../../utils/fetchAPI';
import RegularText from './fonts/RegularText';
import { Pressable, StyleSheet, View } from 'react-native';
import BoldText from './fonts/BoldText';
import { OTPInput } from './LoggedInForgetPassword';

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
  const [focusIndex, setFocusIndex] = useState(1);
  const codeLengths = [1, 2, 3, 4, 5, 6];

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