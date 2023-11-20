import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
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
  const { setIsLoading, vh, setShowTabBar } = useContext(AppContext);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pinCode, setPinCode] = useState('');
  const inputRef = useRef();

  const codeLengths = [1, 2, 3, 4];
  useLayoutEffect(() => {
    setShowTabBar(false);
  }, [setShowTabBar]);

  const handlePay = async () => {
    if (!pinCode) {
      setErrorKey('pinCode');
      return setErrorMessage('No pin is provided');
    } else if (pinCode.length < 4) {
      setErrorKey('pinCode');
      return setErrorMessage('Incomplete pin');
    }
    setIsLoading(true);
    try {
      const result = await postFetchData('user/check-pin', {
        pin: pinCode,
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
