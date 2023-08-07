/* eslint-disable react-native/no-inline-styles */
import { Keyboard, StyleSheet, View } from 'react-native';
import ErrorMessage from './ErrorMessage';
import Header from './Header';
import { postFetchData } from '../../utils/fetchAPI';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './AppContext';
import Button from './Button';
import { TextInput } from 'react-native-gesture-handler';

const InputPinPage = ({ setCanContinue, setReload }) => {
  const codeLengths = [1, 2, 3, 4];
  const [focusIndex, setFocusIndex] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const { setIsLoading } = useContext(AppContext);

  useEffect(() => {
    setIsPinOkay(pinCode.length === codeLengths.length);
  }, [codeLengths.length, pinCode.length]);

  const handlePress = async () => {
    try {
      setIsLoading(true);
      const result = await postFetchData('user/check-pin', { pin: pinCode });

      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      } else if (result.status >= 400) {
        setErrorKey('pinCode');
        return setErrorMessage(result.data);
      }
      if (result.status < 400) {
        if (result.data === false) {
          return setErrorMessage('Invalid Pin');
        }
        setCanContinue(true);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setReload(prev => !prev);
      }, 1000);
    }
  };

  return (
    <View style={styles.form}>
      <Header title={'Input PIN'} text={'Enter your current transaction PIN'} />
      <View style={styles.codeLengthsContainer}>
        {codeLengths.map(codeLength => (
          <PINInputFields
            key={codeLength}
            codeLength={codeLength}
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
      <ErrorMessage errorMessage={errorMessage} />
      <Button
        text={'Continue'}
        onPress={handlePress}
        style={{
          backgroundColor: isPinOkay ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
        }}
        disabled={!isPinOkay}
      />
    </View>
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
    marginVertical: 40,
  },
});

export default InputPinPage;

export const PINInputFields = ({
  codeLength,
  focusIndex,
  setFocusIndex,
  pinCode,
  setPinCode,
  setErrorMessage,
  errorKey,
  setErrorKey,
  codeLengths,
  noFocus,
  setNoFocus,
}) => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!noFocus) {
      if (codeLength === focusIndex) {
        inputRef.current.focus();
        inputRef.current.clear();
        setInputValue('');
      }
    }
  }, [focusIndex, codeLength, noFocus]);

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key !== 'Backspace') {
      if (focusIndex < codeLengths + 1) {
        setFocusIndex(prev => prev + 1);
      } else {
        Keyboard.dismiss();
        inputRef.current.blur();
      }
    } else {
      setPinCode(prev => prev.slice(0, pinCode.length - 1));
      inputValue === ''
        ? focusIndex > 1 && setFocusIndex(prev => prev - 1)
        : inputRef.current.clear();
    }
  };

  return (
    <TextInput
      style={{
        ...styles.codeInput,
        borderBottomColor: errorKey === 'pinCode' ? 'red' : '#000',
        color: errorKey === 'pinCode' ? 'red' : '#000',
      }}
      value={inputValue}
      inputMode="numeric"
      maxLength={1}
      autoFocus={!noFocus && codeLength === focusIndex}
      ref={inputRef}
      onChangeText={text => {
        setInputValue(text);
        setPinCode(prev => `${prev}${text}`);
        codeLengths + 1 === focusIndex &&
          setNoFocus &&
          setNoFocus(prev => !prev) &&
          setFocusIndex(1);
      }}
      onKeyPress={handleKeyPress}
      onFocus={() => {
        setFocusIndex(codeLength);
        setErrorMessage('');
        setErrorKey('');
      }}
      name="pin"
    />
  );
};
