/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useRef, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import Logo from '../../components/Logo';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import CheckPassword from '../../components/CheckPassword';
import LoggedInForgetPassword from '../../components/LoggedInForgetPassword';
import { TextInput } from 'react-native-gesture-handler';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { postFetchData } from '../../../utils/fetchAPI';
import SuccessMessage from '../../components/SuccessMessage';
import RegularText from '../../components/fonts/RegularText';

const TransactionPin = ({ navigation }) => {
  const { vh, appData } = useContext(AppContext);
  const [errorKey, setErrorKey] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [canEditPin, setCanEditPin] = useState(false);
  const [remembersPassword, setRemembersPassword] = useState(true);
  const [inputOldPin, setInputOldPin] = useState(false);
  const [justEnterRouteState, setJustEnterRouteState] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setJustEnterRouteState(true);
  }, []);

  useEffect(() => {
    appData.pin && setInputOldPin(true);
    !remembersPassword && setCanEditPin(true);
    justEnterRouteState &&
      remembersPassword &&
      !inputOldPin &&
      setCanEditPin(true);
  }, [appData.pin, inputOldPin, justEnterRouteState, remembersPassword]);

  return (
    <PageContainer justify={true}>
      <ScrollView>
        <View style={{ ...styles.container, minHeight: vh * 0.8 }}>
          <View style={styles.logo}>
            <Logo />
          </View>
          {!inputOldPin ? (
            remembersPassword ? (
              <CheckPassword
                setPassowrdIsValid={setInputOldPin}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                setRemembersPassword={setRemembersPassword}
              />
            ) : (
              <LoggedInForgetPassword setPassowrdIsValid={setInputOldPin} />
            )
          ) : canEditPin ? (
            <ChangePin
              setReload={setReload}
              navigation={navigation}
              key={reload}
            />
          ) : (
            <InputPin
              setCanEditPin={setCanEditPin}
              key={reload}
              setReload={setReload}
            />
          )}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5 + '%',
    padding: 3 + '%',
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
  },
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
  changePinCodeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginVertical: 10,
  },
  codeInput: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    textAlign: 'center',
    fontSize: 35,
    fontFamily: 'OpenSans-700',
    width: 50,
    maxWidth: 8 + '%',
  },
  formBodyContainer: {
    gap: 50,
    marginTop: 20,
  },
  formBody: { alignItems: 'center' },
  changePinHeader: {
    fontSize: 16,
  },
  messages: {
    marginTop: 20,
  },
  changePinButton: {
    marginTop: 30,
  },
});
export default TransactionPin;

const InputPin = ({ setCanEditPin, setReload }) => {
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
        setCanEditPin(true);
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
          <PINInput
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
        handlePress={handlePress}
        style={{
          backgroundColor: isPinOkay ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
        }}
        disabled={!isPinOkay}
      />
    </View>
  );
};

const PINInput = ({
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

const ChangePin = ({ navigation, setReload }) => {
  const { appData, setIsLoading } = useContext(AppContext);
  const [focusIndex, setFocusIndex] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [pinCode2, setPinCode2] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const [noFocus, setNoFocus] = useState(true);

  const codeLengths = [1, 2, 3, 4];

  const [formData, setFormData] = useState({
    pin1: pinCode,
    pin2: pinCode2,
  });

  useEffect(() => {
    setFormData({
      pin1: pinCode,
      pin2: pinCode2,
    });
  }, [pinCode, pinCode2]);

  useEffect(() => {
    setIsPinOkay(
      pinCode.length === codeLengths.length &&
        pinCode2.length === codeLengths.length,
    );
  }, [codeLengths.length, pinCode.length, pinCode2.length]);

  const handleChangePin = async () => {
    try {
      setIsLoading(true);
      const { pin1, pin2 } = formData;

      if (pin1 !== pin2) {
        setErrorKey('pinCode');
        return setErrorMessage("Pins arent't the same");
      }

      const result = await postFetchData('user/set-pin', { pin: pin1 });

      if (result.status === 200) {
        setSuccessMessage(result.data);
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        setErrorMessage(result.data);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setReload(prev => !prev);
      }, 1500);
    }
  };
  return (
    <View style={styles.form}>
      <Header
        title={'Create transaction PIN'}
        text={'Enter your transaction PIN'}
      />
      <View style={styles.formBodyContainer}>
        <View style={styles.formBody}>
          <RegularText style={styles.changePinHeader}>
            Enter new transaction PIN
          </RegularText>
          <View style={styles.changePinCodeLengthsContainer}>
            {codeLengths.map(input => (
              <PINInput
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
                noFocus={!noFocus}
                setNoFocus={setNoFocus}
              />
            ))}
          </View>
        </View>
        <View style={styles.formBody}>
          <RegularText style={styles.changePinHeader}>
            Confirm new transaction PIN
          </RegularText>
          <View style={styles.changePinCodeLengthsContainer}>
            {codeLengths.map(input => (
              <PINInput
                key={input}
                codeLength={input}
                focusIndex={focusIndex}
                setFocusIndex={setFocusIndex}
                pinCode={pinCode2}
                setPinCode={setPinCode2}
                setErrorMessage={setErrorMessage}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                codeLengths={codeLengths.length}
                noFocus={noFocus}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.messages}>
        <ErrorMessage errorMessage={errorMessage} />
        <SuccessMessage successMessage={successMessage} />
      </View>
      <Button
        text={appData.pin ? 'Change Pin' : 'Create Pin'}
        handlePress={handleChangePin}
        disabled={!isPinOkay}
        style={{
          ...styles.changePinButton,
          backgroundColor: isPinOkay ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
        }}
      />
    </View>
  );
};
