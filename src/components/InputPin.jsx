import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import RegularText from './fonts/RegularText';
import {
  Image,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { AppContext } from './AppContext';
import { postFetchData } from '../../utils/fetchAPI';
import ErrorMessage from './ErrorMessage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import BoldText from './fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import IonIcon from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Countdown from './Countdown';
import { getInvalidPinStatus, setInvalidPinStatus } from '../../utils/storage';
import Back from './Back';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingModal from './LoadingModal';

const InputPin = ({
  setIsValidPin,
  customFunc,
  handleCancel,
  disableBiometric,
}) => {
  const {
    isLoading,
    setIsLoading,
    vw,
    vh,
    setShowTabBar,
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
  useLayoutEffect(() => {
    setShowTabBar(false);
  }, [setShowTabBar]);

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
        const { success } = await LocalAuthentication.authenticateAsync(
          options,
        );
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
      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      }
      if (result.status === 200) {
        setIsValidPin && setIsValidPin(true);
        !showBiometrics && setInvalidPinStatus(false);
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
    setModalOpen(false);
  };

  return (
    <>
      <Modal
        visible={modalOpen}
        animationType="fade"
        onRequestClose={() => {
          handleCancel ? handleCancel() : handleCancelDefault();
        }}>
        <LoadingModal isLoading={isLoading} />
        <SafeAreaView>
          {Platform.OS === 'ios' ? (
            <View style={styles.back}>
              <Back
                onPress={() => {
                  handleCancel ? handleCancel() : handleCancelDefault();
                }}
              />
            </View>
          ) : (
            <Back
              onPress={() => {
                handleCancel ? handleCancel() : handleCancelDefault();
              }}
            />
          )}
          <ScrollView
            contentContainerStyle={{
              minHeight: vh * 0.9,
              ...styles.container,
            }}>
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
                        <IonIcon name="finger-print-sharp" size={50} />
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
                    navigation.navigate('TransactionPin', { forgotPin: true });
                  }}>
                  <BoldText>Forgot PIN?</BoldText>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  back: {
    marginVertical: 20,
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
