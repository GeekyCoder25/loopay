import React, { useCallback, useContext, useEffect, useState } from 'react';
import RegularText from './fonts/RegularText';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppContext } from './AppContext';
import ErrorMessage from './ErrorMessage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import BoldText from './fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import IonIcon from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Countdown from './Countdown';
import { getInvalidPinStatus, setInvalidPinStatus } from '../../utils/storage';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import BackArrow from '../../assets/images/backArrow.svg';
import FaceIDIcon from '../../assets/images/face-id.svg';
import useFetchData from '../../utils/fetchAPI';

const InputPin = ({
  setIsValidPin,
  customFunc,
  handleCancel,
  disableBiometric,
}) => {
  const { postFetchData } = useFetchData();

  const {
    setIsLoading,
    vw,
    vh,
    isBiometricSupported,
    enableBiometric,
    isAdmin,
  } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [modalOpen, setModalOpen] = useState(true);
  const navigation = useNavigation();
  const codeLengths = [1, 2, 3, 4];
  const [hideDigits, setHideDigits] = useState(false);
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [errorAnimated, setErrorAnimated] = useState(false);
  const [hasFaceID, setHasFaceID] = useState(false);
  const errorPosition = useSharedValue(0);

  useEffect(() => {
    LocalAuthentication.supportedAuthenticationTypesAsync().then(result =>
      setHasFaceID(result[0] === 2),
    );

    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

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

  useFocusEffect(
    useCallback(() => {
      getInvalidPinStatus().then(result => {
        if (result === true) {
          setShowBiometrics(false);
        } else {
          setShowBiometrics(
            enableBiometric && isBiometricSupported && !disableBiometric,
          );
          checkFingerprint();
        }
      });
      return () => setErrorMessage('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const checkFingerprint = async () => {
    try {
      const options = {
        promptMessage: 'Verify fingerprint',
        cancelLabel: 'Use payment pin instead',
        disableDeviceFallback: true,
      };
      if (isBiometricSupported && enableBiometric && !disableBiometric) {
        const { success } =
          await LocalAuthentication.authenticateAsync(options);
        if (success) {
          setIsLoading(true);
          setIsValidPin && setIsValidPin(true);
          if (customFunc) {
            const customFuncStatus = await customFunc(setErrorMessage);
            return setTimeout(() => {
              customFuncStatus === 200
                ? setTimeout(() => {
                    setModalOpen(false);
                  }, 1000)
                : setErrorMessage(customFuncStatus);
            }, 200);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePay = async pin => {
    try {
      setIsLoading(true);
      const result = await postFetchData('user/check-pin', {
        pin,
      });
      setIsLoading(true);
      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      }
      if (result.status === 200) {
        setIsValidPin && setIsValidPin(true);
        !showBiometrics && setInvalidPinStatus(false);
        if (customFunc) {
          setIsLoading(true);
          const customFuncStatus = await customFunc(setErrorMessage);
          return setTimeout(() => {
            customFuncStatus === 200
              ? setTimeout(() => {
                  setModalOpen(false);
                }, 1000)
              : setErrorMessage(`${customFuncStatus || ''}`);
          }, 200);
        }
      }

      if (result.status === 400) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setErrorMessage(result.data);
        setErrorCode(true);
        setTimeout(() => {
          setErrorMessage('');
          setErrorCode('');
          setPinCode('');
        }, 1500);
      } else {
        const queryCheck = 'try again in ';
        if (result.data.includes(queryCheck)) {
          const message = result.data.split(queryCheck)[0];
          const countDown = result.data.split(queryCheck)[1];
          const message2 = 'Please click on forgot pin or contact support';
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setErrorMessage(
            <Countdown
              targetDate={countDown}
              message={message + queryCheck}
              message2={message2}
            />,
          );
          setInvalidPinStatus(true);
          setHideDigits(true);
        }
        setErrorCode(true);
      }
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

  const handleCancelDefault = () => {
    navigation.goBack();
    // setModalOpen(false);
  };

  return (
    <>
      {modalOpen && (
        <View style={styles.back}>
          <Pressable
            onPress={() => {
              handleCancel ? handleCancel() : handleCancelDefault();
            }}
            style={styles.backContainer}>
            <BackArrow />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <ScrollView
            contentContainerStyle={{
              minHeight: vh * 0.85,
              ...styles.container,
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                ...styles.container,
                gap: vh * 0.043,
              }}>
              <View>
                <BoldText style={styles.headerText}>
                  {hideDigits ? 'PIN Blocked' : 'Enter PIN'}
                </BoldText>
                {!hideDigits && (
                  <RegularText style={styles.text}>
                    Enter transaction 4-digit PIN-Code{' '}
                    {enableBiometric &&
                      isBiometricSupported &&
                      'or use your biometric to perform action.'}
                  </RegularText>
                )}
              </View>
              {hideDigits ? (
                <View>
                  <FaIcon name="ban" size={35} />
                </View>
              ) : (
                <View style={styles.changePinCodeLengthsContainer}>
                  <View style={styles.displayContainer}>
                    {codeLengths.map(code =>
                      pinCode.length >= code ? (
                        errorCode ? (
                          <Animated.View
                            key={code}
                            style={{
                              ...styles.displayError,
                              left: errorPosition,
                            }}
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
                </View>
              )}
              <View style={styles.errorMessage}>
                <ErrorMessage errorMessage={errorMessage} />
              </View>
              {!hideDigits && (
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
                    {showBiometrics ? (
                      <Pressable
                        style={{
                          ...styles.digit,
                          width: vw * 0.2,
                          height: vh * 0.08,
                        }}
                        onPress={checkFingerprint}>
                        {hasFaceID ? (
                          <FaceIDIcon width={50} height={50} />
                        ) : (
                          <IonIcon name="finger-print-sharp" size={50} />
                        )}
                      </Pressable>
                    ) : (
                      <Pressable
                        style={{
                          ...styles.digit,
                          width: vw * 0.2,
                          height: vh * 0.08,
                        }}
                      />
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
              )}

              {!isAdmin && (
                <Pressable
                  onPress={() => {
                    handleCancel ? handleCancel() : handleCancelDefault();
                    navigation.navigate('TransactionPin', {
                      forgotPin: true,
                    });
                  }}>
                  <BoldText>Forgot PIN?</BoldText>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  back: {
    marginVertical: 10,
    marginHorizontal: '3%',
  },
  backContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 15,
  },
  backText: {
    fontFamily: 'OpenSans-600',
    fontSize: 18,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3 + '%',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
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
    marginVertical: 15,
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
    minHeight: 30,
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
