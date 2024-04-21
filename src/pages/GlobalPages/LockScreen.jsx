import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import RegularText from '../../components/fonts/RegularText';
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
import FaceIDIcon from '../../../assets/images/face-id.svg';
import Animated, {
  Easing,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import useFetchData from '../../../utils/fetchAPI';

const LockScreen = () => {
  const { postFetchData } = useFetchData();
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
    timerIdTotal,
    hasFaceID,
    setHasFaceID,
  } = useContext(AppContext);
  const [inputCode, setInputCode] = useState('');
  const [hasForgot, setHasForgot] = useState(false);
  const [canChange, setCanChange] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const [biometricSwitch, setBiometricSwitch] = useState(false);
  const codeLength = [1, 2, 3, 4, 5, 6];
  const [errorAnimated, setErrorAnimated] = useState(false);
  const [switchIcon, setSwitchIcon] = useState(false);

  const logoPosition = useSharedValue(0);
  const iconPosition = useSharedValue(100);
  const errorPosition = useSharedValue(0);

  useEffect(() => {
    LocalAuthentication.supportedAuthenticationTypesAsync().then(result =>
      setHasFaceID(result[0] === 2),
    );
  }, [setHasFaceID]);
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
            const { success } =
              await LocalAuthentication.authenticateAsync(options);
            if (success) {
              setIsSessionTimedOut(false);
              setWalletRefresh(prev => !prev);
              setInputCode('');
              clearTimeout(timerId.current);
              clearTimeout(timerIdTotal.current);
              return (timerId.current = setTimeout(() => {
                setIsSessionTimedOut(true);
              }, timeForInactivityInSecond * 1000));
            }
          }
        }
      }
    };
    checkFingerprint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricSwitch, enableBiometric, timerId]);

  useEffect(() => {
    setTimeout(() => {
      logoPosition.value = withTiming(logoPosition.value + 100, {
        duration: 1000,
        easing: Easing.in(Easing.ease),
      });
      setTimeout(() => {
        iconPosition.value = withTiming(iconPosition.value - 100, {
          duration: 1000,
          easing: Easing.out(Easing.ease),
        });
      }, 300);
      setTimeout(() => {
        setSwitchIcon(true);
      }, 400);
    }, 2500);
    return () => {
      logoPosition.value = 0;
      iconPosition.value = 100;
      setSwitchIcon(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsSessionTimedOut]);

  const handleInput = async input => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputCode(prev => `${prev}${input}`);
    setErrorAnimated(false);
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
          clearTimeout(timerIdTotal.current);
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

  const errorAnimation = () => {
    if (!errorAnimated) {
      errorPosition.value = withSpring(errorPosition.value - 10, {
        duration: 100,
      });
      setTimeout(() => {
        errorPosition.value = withSpring(errorPosition.value + 10, {
          duration: 100,
        });
      }, 200);
      setErrorAnimated(true);
    }
  };

  const digitDimension = { width: vw * 0.2, height: vh * 0.08 };
  const disabled = inputCode.length >= codeLength.length;
  if (isSessionTimedOut && isLoggedIn) {
    return (
      <View style={styles.lockScreen}>
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
            contentContainerStyle={{ minHeight: vh, ...styles.container }}
            bounces={false}>
            <View
              style={{
                ...styles.container,
                gap: vh * 0.043,
              }}>
              <View style={styles.logoContainer}>
                <Animated.Image
                  style={{
                    ...styles.logo,
                    top: logoPosition,
                    right: logoPosition,
                  }}
                  source={require('../../../assets/images/icon.png')}
                  resizeMode="contain"
                />
                <Animated.View
                  style={{
                    ...styles.icon,
                    top: iconPosition,
                    right: iconPosition,
                  }}>
                  {switchIcon && <UserIcon style={{ ...styles.icon }} />}
                </Animated.View>
              </View>
              <RegularText>Enter Password</RegularText>
              <View style={styles.displayContainer}>
                {codeLength.map(code =>
                  inputCode.length >= code ? (
                    errorCode ? (
                      <Animated.View
                        key={code}
                        style={{ ...styles.displayError, left: errorPosition }}
                        onLayout={errorAnimation}
                      />
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
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('1')}>
                    <BoldText style={styles.digitText}>1</BoldText>
                  </Pressable>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('2')}>
                    <BoldText style={styles.digitText}>2</BoldText>
                  </Pressable>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('3')}>
                    <BoldText style={styles.digitText}>3</BoldText>
                  </Pressable>
                </View>
                <View style={styles.row}>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('4')}>
                    <BoldText style={styles.digitText}>4</BoldText>
                  </Pressable>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('5')}>
                    <BoldText style={styles.digitText}>5</BoldText>
                  </Pressable>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('6')}>
                    <BoldText style={styles.digitText}>6</BoldText>
                  </Pressable>
                </View>
                <View style={styles.row}>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('7')}>
                    <BoldText style={styles.digitText}>7</BoldText>
                  </Pressable>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('8')}>
                    <BoldText style={styles.digitText}>8</BoldText>
                  </Pressable>
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('9')}>
                    <BoldText style={styles.digitText}>9</BoldText>
                  </Pressable>
                </View>
                <View style={styles.row}>
                  {enableBiometric && isBiometricSupported ? (
                    <Pressable
                      style={{
                        ...styles.digit,
                        ...digitDimension,
                      }}
                      onPress={() => setBiometricSwitch(prev => !prev)}>
                      {hasFaceID ? (
                        <FaceIDIcon width={50} height={50} />
                      ) : (
                        <IonIcon name="finger-print-sharp" size={50} />
                      )}
                    </Pressable>
                  ) : (
                    <View
                      disabled={disabled}
                      style={{
                        ...styles.digit,
                        ...digitDimension,
                      }}
                    />
                  )}
                  <Pressable
                    disabled={disabled}
                    style={{
                      ...styles.digit,
                      ...digitDimension,
                    }}
                    onPress={() => handleInput('0')}>
                    <BoldText style={styles.digitText}>0</BoldText>
                  </Pressable>

                  <Pressable
                    style={{
                      ...styles.digit,
                      ...digitDimension,
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
      </View>
    );
  }
};

const styles = StyleSheet.create({
  lockScreen: {
    zIndex: 99999,
    position: 'absolute',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    backgroundColor: '#fff',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
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
