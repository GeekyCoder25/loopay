import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import RegularText from '../../components/fonts/RegularText';
import { postFetchData } from '../../../utils/fetchAPI';
import UserIcon from '../../components/UserIcon';
import { AppContext } from '../../components/AppContext';
import ForgotPassword from '../Auth/ForgotPassword';
import ChangePassword from '../MenuPages/ChangePassword';
import BoldText from '../../components/fonts/BoldText';
import Back from '../../components/Back';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import IonIcon from '@expo/vector-icons/Ionicons';
import { timeForInactivityInSecond } from '../../config/config';
import { getBiometric } from '../../../utils/storage';

const LockScreen = () => {
  const {
    vw,
    vh,
    isLoggedIn,
    isSessionTimedOut,
    setIsSessionTimedOut,
    setWalletRefresh,
    isBiometricSupported,
    setIsBiometricSupported,
    enableBiometric,
    setEnableBiometric,
    timerId,
  } = useContext(AppContext);
  const [inputCode, setInputCode] = useState('');
  const [hasForgot, setHasForgot] = useState(false);
  const [canChange, setCanChange] = useState(false);
  const [switchIcon, setSwitchIcon] = useState(true);
  const [errorCode, setErrorCode] = useState(false);
  const [biometricSwitch, setBiometricSwitch] = useState(false);
  const codeLength = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const checkFingerprint = async () => {
      const biometric = (await getBiometric()) || false;
      setEnableBiometric(biometric);
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        if (savedBiometrics) {
          setIsBiometricSupported(compatible);
          const options = {
            promptMessage: 'Login with Biometrics',
            cancelLabel: 'Use Loopay password instead',
            disableDeviceFallback: true,
          };
          if (enableBiometric) {
            const { success } = await LocalAuthentication.authenticateAsync(
              options,
            );
            if (success) {
              setIsSessionTimedOut(false);
              setWalletRefresh(prev => !prev);
              setInputCode('');
              clearTimeout(timerId.current);
              return (timerId.current = setTimeout(() => {
                setIsSessionTimedOut(true);
              }, timeForInactivityInSecond * 1000));
            }
          }
        }
      }
    };
    checkFingerprint();
  }, [
    setIsSessionTimedOut,
    setWalletRefresh,
    biometricSwitch,
    setIsBiometricSupported,
    setEnableBiometric,
    enableBiometric,
    timerId,
  ]);
  useEffect(() => {
    setTimeout(() => {
      setSwitchIcon(prev => !prev);
    }, 2500);
  }, [setIsSessionTimedOut]);

  const handleInput = async input => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputCode(prev => `${prev}${input}`);
    if (inputCode.length + 1 >= codeLength.length) {
      try {
        const response = await postFetchData('auth/check-password', {
          password: `${inputCode}${input}`,
        });
        if (response.status === 200) {
          setWalletRefresh(prev => !prev);
          setIsSessionTimedOut(false);
          setInputCode('');
          clearTimeout(timerId.current);
          return (timerId.current = setTimeout(() => {
            setIsSessionTimedOut(true);
          }, timeForInactivityInSecond * 1000));
        } else {
          setErrorCode(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setTimeout(() => {
            setInputCode('');
            setErrorCode(false);
          }, 500);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <Modal visible={isSessionTimedOut && isLoggedIn} animationType="fade">
      {hasForgot ? (
        canChange ? (
          <>
            <Back onPress={() => setCanChange(false)} />
            <ChangePassword skipCheck />
          </>
        ) : (
          <>
            <Back onPress={() => setHasForgot(false)} />
            <ForgotPassword setCanChange={setCanChange} />
          </>
        )
      ) : (
        <ScrollView
          contentContainerStyle={{ minHeight: vh, ...styles.container }}>
          <View
            style={{
              ...styles.container,
              gap: vh * 0.043,
            }}>
            {switchIcon ? (
              <Image
                style={styles.logo}
                source={require('../../../assets/icon.png')}
                resizeMode="contain"
              />
            ) : (
              <UserIcon style={styles.icon} />
            )}
            <RegularText>Enter Password</RegularText>
            <View style={styles.displayContainer}>
              {codeLength.map(code =>
                inputCode.length >= code ? (
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
            <View style={styles.digits}>
              <View style={styles.row}>
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
                  style={{
                    ...styles.digit,
                    width: vw * 0.2,
                    height: vh * 0.08,
                  }}
                  onPress={() => handleInput('1')}>
                  <BoldText style={styles.digitText}>1</BoldText>
                </Pressable>
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
                  style={{
                    ...styles.digit,
                    width: vw * 0.2,
                    height: vh * 0.08,
                  }}
                  onPress={() => handleInput('2')}>
                  <BoldText style={styles.digitText}>2</BoldText>
                </Pressable>
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
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
                  disabled={inputCode.length >= codeLength.length}
                  style={{
                    ...styles.digit,
                    width: vw * 0.2,
                    height: vh * 0.08,
                  }}
                  onPress={() => handleInput('4')}>
                  <BoldText style={styles.digitText}>4</BoldText>
                </Pressable>
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
                  style={{
                    ...styles.digit,
                    width: vw * 0.2,
                    height: vh * 0.08,
                  }}
                  onPress={() => handleInput('5')}>
                  <BoldText style={styles.digitText}>5</BoldText>
                </Pressable>
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
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
                  disabled={inputCode.length >= codeLength.length}
                  style={{
                    ...styles.digit,
                    width: vw * 0.2,
                    height: vh * 0.08,
                  }}
                  onPress={() => handleInput('7')}>
                  <BoldText style={styles.digitText}>7</BoldText>
                </Pressable>
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
                  style={{
                    ...styles.digit,
                    width: vw * 0.2,
                    height: vh * 0.08,
                  }}
                  onPress={() => handleInput('8')}>
                  <BoldText style={styles.digitText}>8</BoldText>
                </Pressable>
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
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
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
                  style={{
                    ...styles.digit,
                    width: vw * 0.2,
                    height: vh * 0.08,
                  }}
                />
                <Pressable
                  disabled={inputCode.length >= codeLength.length}
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
                    setInputCode(prev => prev.slice(0, -1));
                  }}>
                  <Image
                    source={require('../../../assets/images/delete.png')}
                    style={styles.delete}
                  />
                </Pressable>
              </View>
            </View>
            {enableBiometric && isBiometricSupported && (
              <Pressable onPress={() => setBiometricSwitch(prev => !prev)}>
                <IonIcon name="finger-print-sharp" size={50} />
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setHasForgot(true);
              }}>
              <BoldText>Forgot Password?</BoldText>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
export default LockScreen;
