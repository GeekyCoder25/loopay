import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import RegularText from './fonts/RegularText';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppContext } from './AppContext';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import BoldText from './fonts/BoldText';
import IonIcon from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const InputPin = ({ setIsValidPin, customFunc, style }) => {
  const {
    setIsLoading,
    vw,
    vh,
    setShowTabBar,
    isBiometricSupported,
    enableBiometric,
  } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const navigation = useNavigation();
  const codeLengths = [1, 2, 3, 4];
  useLayoutEffect(() => {
    setShowTabBar(false);
  }, [setShowTabBar]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkFingerprint();
    }, 100);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkFingerprint = async () => {
    const options = {
      promptMessage: 'Verify fingerprint',
      cancelLabel: 'Use payment pin instead',
      disableDeviceFallback: true,
    };
    if (isBiometricSupported && enableBiometric) {
      const { success } = await LocalAuthentication.authenticateAsync(options);
      if (success) {
        setIsLoading(true);
        setIsValidPin && setIsValidPin(true);
        await customFunc(setErrorMessage);
        return setIsLoading(false);
      }
    }
  };

  const handlePay = async pin => {
    try {
      setIsLoading(true);
      const result = await postFetchData('user/check-pin', {
        pin,
      });
      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      }
      if (result.status === 200) {
        setIsValidPin && setIsValidPin(true);
        return await customFunc(setErrorMessage);
      }
      setErrorMessage(result.data);
      setErrorCode(true);
      setTimeout(() => {
        setErrorCode('');
        setPinCode('');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = input => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPinCode(prev => `${prev}${input}`);
    setErrorMessage('');
    if (pinCode.length + 1 >= codeLengths.length) {
      return handlePay(pinCode + input);
    }
  };

  return (
    <ScrollView>
      <View style={{ ...styles.container, minHeight: vh * 0.7, ...style }}>
        <RegularText style={styles.text}>
          Enter transaction 4-digit PIN-C0de or use your biometric to perform
          action.
        </RegularText>
        <View style={styles.changePinCodeLengthsContainer}>
          {/* {codeLengths.map(input => (
              <PINInputFields
                key={input}
                codeLength={input}
                pinCode={pinCode}
                setErrorMessage={setErrorMessage}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                inputRef={inputRef}
              />
            ))} */}
          <View style={styles.displayContainer}>
            {codeLengths.map(code =>
              pinCode.length >= code ? (
                errorCode ? (
                  <View key={code} style={styles.displayError} />
                ) : (
                  <View key={code} style={styles.displayFilled} />
                )
              ) : (
                <View key={code} style={styles.display} />
              ),
            )}
          </View>
        </View>
        <View style={styles.errorMessage}>
          <ErrorMessage errorMessage={errorMessage} />
        </View>
        <View style={styles.digits}>
          <View style={styles.row}>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('1')}>
              <BoldText style={styles.digitText}>1</BoldText>
            </Pressable>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('2')}>
              <BoldText style={styles.digitText}>2</BoldText>
            </Pressable>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('3')}>
              <BoldText style={styles.digitText}>3</BoldText>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('4')}>
              <BoldText style={styles.digitText}>4</BoldText>
            </Pressable>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('5')}>
              <BoldText style={styles.digitText}>5</BoldText>
            </Pressable>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('6')}>
              <BoldText style={styles.digitText}>6</BoldText>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('7')}>
              <BoldText style={styles.digitText}>7</BoldText>
            </Pressable>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('8')}>
              <BoldText style={styles.digitText}>8</BoldText>
            </Pressable>
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('9')}>
              <BoldText style={styles.digitText}>9</BoldText>
            </Pressable>
          </View>
          <View style={styles.row}>
            {enableBiometric && isBiometricSupported && (
              <Pressable
                style={{
                  ...styles.digit,
                  width: vw * 0.2,
                  height: vh * 0.08,
                }}
                onPress={checkFingerprint}>
                <IonIcon name="finger-print-sharp" size={50} />
              </Pressable>
            )}
            <Pressable
              disabled={pinCode.length >= codeLengths.length}
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => handleInput('0')}>
              <BoldText style={styles.digitText}>0</BoldText>
            </Pressable>
            <Pressable
              style={{
                ...styles.digit,
                width: vw * 0.2,
                height: vh * 0.08,
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPinCode(prev => prev.slice(0, -1));
              }}>
              <Image
                source={require('../../assets/images/delete.png')}
                style={styles.delete}
              />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('TransactionPin', { forgotPin: true });
          }}>
          <BoldText>Forgot PIN?</BoldText>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 800,
    gap: 30,
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
  button: {
    marginBottom: 30,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  displayContainer: {
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  display: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  displayFilled: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
  },
  displayError: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'red',
  },
  errorMessage: {
    height: 30,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digits: {
    gap: 20,
    alignItems: 'center',
  },
  digit: {
    fontSize: 24,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'OpenSans-700',
  },
  digitText: {
    fontSize: 32,
  },
  delete: {
    width: 30,
    height: 30,
  },
});

export default InputPin;
