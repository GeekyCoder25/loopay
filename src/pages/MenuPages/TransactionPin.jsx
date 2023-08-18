/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { ScrollView, StyleSheet, View } from 'react-native';
import Logo from '../../components/Logo';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import CheckPassword from '../../components/CheckPassword';
import LoggedInForgetPassword from '../../components/LoggedInForgetPassword';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { postFetchData } from '../../../utils/fetchAPI';
import SuccessMessage from '../../components/SuccessMessage';
import RegularText from '../../components/fonts/RegularText';
import InputPinPage, { PINInputFields } from '../../components/InputPinPage';

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
                header={
                  <Header
                    title={`${appData.pin ? 'Change' : 'Create'} PIN`}
                    text={`To ${
                      appData.pin ? 'change' : 'create'
                    } your PIN, kindly input your current password below to continue.`}
                  />
                }
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
            <InputPinPage
              setCanContinue={setCanEditPin}
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

const ChangePin = ({ navigation, setReload }) => {
  const { appData, setAppData, setIsLoading } = useContext(AppContext);
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
        setAppData(prev => {
          return {
            ...prev,
            pin: true,
          };
        });
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
              <PINInputFields
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
              <PINInputFields
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
        onPress={handleChangePin}
        disabled={!isPinOkay}
        style={{
          ...styles.changePinButton,
          backgroundColor: isPinOkay ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
        }}
      />
    </View>
  );
};
