import React, { useContext, useEffect, useRef, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import Logo from '../../components/Logo';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import CheckPassword from '../../components/CheckPassword';
import LoggedInForgetPassword from '../../components/LoggedInForgetPassword';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import SuccessMessage from '../../components/SuccessMessage';
import RegularText from '../../components/fonts/RegularText';
import InputPinPage, { PINInputFields } from '../../components/InputPinPage';
import { useWalletContext } from '../../context/WalletContext';
import useFetchData from '../../../utils/fetchAPI';

const TransactionPin = ({ navigation, route }) => {
  const { vh, appData } = useContext(AppContext);
  const [errorKey, setErrorKey] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [canEditPin, setCanEditPin] = useState(false);
  const [remembersPassword, setRemembersPassword] = useState(true);
  const [inputOldPin, setInputOldPin] = useState(
    JSON.parse(appData.pin) ?? !route.params?.forgotPin,
  );
  const [reload, setReload] = useState(false);
  const [hasSetPin] = useState(JSON.parse(appData.pin));

  useEffect(() => {
    !remembersPassword && setCanEditPin(true);
    remembersPassword && !inputOldPin && setCanEditPin(true);
  }, [appData.pin, inputOldPin, remembersPassword]);

  return (
    <PageContainer justify={true} avoidKeyboardPushup avoidBounce>
      <View style={{ ...styles.container, minHeight: vh * 0.8 }}>
        <View style={styles.logo}>
          <Logo />
        </View>
        {!inputOldPin ? (
          remembersPassword ? (
            <CheckPassword
              setPasswordIsValid={setInputOldPin}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              errorKey={errorKey}
              setErrorKey={setErrorKey}
              setRemembersPassword={setRemembersPassword}
              header={
                <Header
                  title={`${hasSetPin ? 'Change' : 'Create'} PIN`}
                  text={`To ${
                    hasSetPin ? 'change' : 'create'
                  } your PIN, kindly input your current password below to continue.`}
                />
              }
            />
          ) : (
            <LoggedInForgetPassword setPasswordIsValid={setInputOldPin} />
          )
        ) : canEditPin ? (
          <ChangePin
            setReload={setReload}
            navigation={navigation}
            key={reload}
          />
        ) : (
          <InputPinPage
            setCanContinue={setCanEditPin}
            key={reload}
            setReload={setReload}
            setInputOldPin={setInputOldPin}
          />
        )}
      </View>
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
    height: 100,
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
    color: '#fff',
    position: 'absolute',
    transform: [{ translateX: -1000 }],
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
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  changePinButton: {
    marginTop: 30,
  },
});
export default TransactionPin;

const ChangePin = ({ navigation, setReload }) => {
  const { postFetchData } = useFetchData();
  const { appData, setAppData, setIsLoading } = useContext(AppContext);
  const walletContext = useWalletContext();
  const [pinCode, setPinCode] = useState('');
  const [pinCode2, setPinCode2] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [isPin1, setIsPin1] = useState(true);
  const inputRef = useRef();

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

  const handleChangePin = async ({ pinCode: paramsPinCode }) => {
    const code = paramsPinCode || pinCode;
    const code2 = paramsPinCode || pinCode2;
    if (isPin1) {
      if (code.length !== codeLengths.length) {
        setErrorKey('pinCode');
        return setErrorMessage('Input your new transaction pin');
      } else {
        setIsPin1(false);
      }
    } else {
      try {
        setIsLoading(true);
        const { pin1 } = formData;

        if (pin1 !== code2) {
          setErrorKey('pinCode');
          return setErrorMessage("Pins aren't the same");
        }

        const result = await postFetchData('user/set-pin', { pin: pin1 });

        if (result.status === 200) {
          setSuccessMessage(
            appData.pin
              ? 'Transaction pin updated successfully'
              : 'Transaction pin set successfully',
          );
          setAppData(prev => {
            return {
              ...prev,
              pin: true,
            };
          });

          const isVerified =
            appData.verificationStatus === 'verified' ||
            appData.verificationStatus === 'pending';

          !isVerified
            ? navigation.replace('FirstTimeVerifications')
            : setTimeout(() => {
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
    }
  };

  return (
    <View style={styles.form}>
      <Header
        title={`${JSON.parse(appData.pin) ? 'Change' : 'Create'} transaction PIN`}
        text={'Enter your new transaction PIN'}
      />
      <View style={styles.formBodyContainer}>
        {isPin1 ? (
          <View style={styles.formBody}>
            <RegularText style={styles.changePinHeader}>
              Enter new transaction PIN
            </RegularText>
            <TextInput
              autoFocus
              style={styles.codeInput}
              inputMode="numeric"
              onChangeText={text => {
                setPinCode(text);
                setErrorMessage('');
                setErrorKey('');
                text.length === codeLengths.length && Keyboard.dismiss();
                text.length === codeLengths.length &&
                  handleChangePin({ pinCode: text });
              }}
              maxLength={codeLengths.length}
              ref={inputRef}
              value={pinCode}
            />
            <View style={styles.changePinCodeLengthsContainer}>
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
          </View>
        ) : (
          <View style={styles.formBody} key={isPin1}>
            <RegularText style={styles.changePinHeader}>
              Confirm new transaction PIN
            </RegularText>
            <View style={styles.changePinCodeLengthsContainer}>
              {codeLengths.map(input => (
                <PINInputFields
                  key={input}
                  codeLength={input}
                  pinCode={pinCode2}
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
                setPinCode2(text);
                setErrorMessage('');
                setErrorKey('');
                text.length === codeLengths.length && Keyboard.dismiss();
                text.length === codeLengths.length &&
                  handleChangePin({ pinCode: text });
              }}
              maxLength={codeLengths.length}
              ref={inputRef}
              value={pinCode2}
            />
          </View>
        )}
      </View>

      <View style={styles.messages}>
        <ErrorMessage errorMessage={errorMessage} />
        <SuccessMessage successMessage={successMessage} />
      </View>
      <View style={styles.button}>
        <Button
          text={isPin1 ? 'Continue' : appData.pin ? 'Change Pin' : 'Create Pin'}
          onPress={handleChangePin}
          style={{
            ...styles.changePinButton,
          }}
        />
      </View>
    </View>
  );
};
