/* eslint-disable react-native/no-inline-styles */
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import ErrorMessage from './ErrorMessage';
import Header from './Header';
import { postFetchData } from '../../utils/fetchAPI';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './AppContext';
import Button from './Button';
import BoldText from './fonts/BoldText';

const InputPinPage = ({
  setCanContinue,
  setReload,
  setInputOldPin,
  customPinFunc,
}) => {
  const codeLengths = [1, 2, 3, 4];
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const { setIsLoading, appData } = useContext(AppContext);

  useEffect(() => {
    setIsPinOkay(pinCode.length === codeLengths.length);
  }, [codeLengths.length, pinCode.length]);

  const handlePress = async ({ pinCode: paramsPinCode }) => {
    const code = paramsPinCode || pinCode;
    if (!code) {
      setErrorKey('pinCode');
      return setErrorMessage('No pin is provided');
    } else if (code.length < 4) {
      setErrorKey('pinCode');
      return setErrorMessage('Incomplete pin');
    }
    try {
      setIsLoading(true);
      const result = await postFetchData('user/check-pin', { pin: code });

      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      } else if (result.status >= 400) {
        setErrorKey('pinCode');
        return setErrorMessage(result.data);
      }
      if (result.status === 200) {
        if (result.data === false) {
          return setErrorMessage('Invalid Pin');
        }
        setCanContinue(true);
        customPinFunc && customPinFunc();
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setReload(prev => !prev);
      }, 1000);
    }
  };

  const inputRef = useRef();

  return (
    appData.pin && (
      <View style={styles.form}>
        <Header
          title={'Input PIN'}
          text={'Enter your current transaction PIN'}
        />
        <View style={styles.codeLengthsContainer}>
          {codeLengths.map(input => (
            <PINInputFields
              key={input}
              codeLength={input}
              pinCode={pinCode}
              inputRef={inputRef}
              errorKey={errorKey}
            />
          ))}
        </View>
        <Pressable style={styles.forgot} onPress={() => setInputOldPin(false)}>
          <BoldText>Forgot PIN?</BoldText>
        </Pressable>
        <TextInput
          autoFocus
          style={{ height: 1 }}
          inputMode="numeric"
          onChangeText={text => {
            setPinCode(text);
            text.length === codeLengths.length && Keyboard.dismiss();
            handlePress({ pinCode: text });
            setErrorMessage('');
            setErrorKey('');
          }}
          maxLength={codeLengths.length}
          ref={inputRef}
          value={pinCode}
        />
        <ErrorMessage errorMessage={errorMessage} style={styles.errorMessage} />
        <View style={styles.button}>
          <Button
            text={'Continue'}
            onPress={handlePress}
            style={{
              backgroundColor: isPinOkay ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
            }}
            disabled={!isPinOkay}
          />
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 3,
    paddingVertical: 30,
    minHeight: 150,
  },
  codeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginVertical: 0,
  },
  codeInput: {
    borderWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center',
    fontFamily: 'OpenSans-700',
    width: 50,
    height: 50,
    justifyContent: 'center',
    marginTop: 40,
  },
  codeInputText: {
    textAlign: 'center',
    fontSize: 35,
    fontFamily: 'OpenSans-700',
  },
  forgot: {
    alignItems: 'center',
    marginVertical: 70,
  },
  errorMessage: {
    marginTop: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
  },
});

export default InputPinPage;

export const PINInputFields = ({ codeLength, pinCode, errorKey, inputRef }) => {
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
        inputRef.current.focus();
      }}
      style={{
        ...styles.codeInput,
        borderColor: errorKey === 'pinCode' ? 'red' : '#000',
      }}
      name="pin">
      <BoldText
        style={{
          ...styles.codeInputText,
          color: errorKey === 'pinCode' ? 'red' : '#000',
        }}>
        {pinCode.charAt(codeLength - 1)}
      </BoldText>
    </Pressable>
  );
};
