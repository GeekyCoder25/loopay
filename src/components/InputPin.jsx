import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { PINInputFields } from './InputPinPage';
import RegularText from './fonts/RegularText';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { AppContext } from './AppContext';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';
import Button from './Button';
import * as LocalAuthentication from 'expo-local-authentication';

const InputPin = ({
  children,
  buttonText,
  setIsValidPin,
  customFunc,
  style,
}) => {
  const { setIsLoading, vh, setShowTabBar, isBiometricSupported } =
    useContext(AppContext);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pinCode, setPinCode] = useState('');
  const inputRef = useRef();

  const codeLengths = [1, 2, 3, 4];
  useLayoutEffect(() => {
    setShowTabBar(false);
  }, [setShowTabBar]);

  useEffect(() => {
    const options = {
      promptMessage: 'Verify fingerprint',
      cancelLabel: 'Use payment pin instead',
      disableDeviceFallback: true,
    };
    const checkFingerprint = async () => {
      if (isBiometricSupported) {
        const { success } = await LocalAuthentication.authenticateAsync(
          options,
        );
        if (success) {
          setIsLoading(true);
          setIsValidPin && setIsValidPin(true);
          await customFunc(setErrorMessage);
          return setIsLoading(false);
        } else {
          Keyboard.dismiss();
          inputRef.current?.focus();
        }
      }
    };
    setTimeout(() => {
      checkFingerprint();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePay = async paramsPinCode => {
    const code = paramsPinCode || pinCode;
    if (!code) {
      setErrorKey('pinCode');
      return setErrorMessage('No pin is provided');
    } else if (code.length < 4) {
      setErrorKey('pinCode');
      return setErrorMessage('Incomplete pin');
    }
    setIsLoading(true);
    try {
      const result = await postFetchData('user/check-pin', {
        pin: code,
      });
      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      }
      if (result.status === 200) {
        setIsValidPin && setIsValidPin(true);
        return await customFunc(setErrorMessage);
      }
      setErrorMessage(result.data);
      setErrorKey('pinCode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async text => {
    setPinCode(text);
    if (text.length === codeLengths.length) {
      Keyboard.dismiss();
      return handlePay(text);
    }
    setErrorMessage('');
    setErrorKey('');
  };

  return (
    <View style={{ ...styles.container, minHeight: vh * 0.55, ...style }}>
      <View style={styles.pinContainer}>
        <>
          <RegularText style={styles.text}>
            Enter transaction 4-digit PIN-C0de or use your biometric to perform
            action.
          </RegularText>
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
            onChangeText={text => handleChange(text)}
            maxLength={codeLengths.length}
            ref={inputRef}
            value={pinCode}
          />
        </>
      </View>
      <ErrorMessage errorMessage={errorMessage} />
      {children}
      <Button
        text={buttonText || 'Send'}
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
  text: {
    textAlign: 'center',
  },
  changePinCodeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
  codeInput: {
    color: '#fff',
    position: 'absolute',
    transform: [{ translateX: -1000 }],
  },
});

export default InputPin;
