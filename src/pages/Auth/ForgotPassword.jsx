/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { SignInData } from '../../database/data';
import Header from '../../components/Header';
import Email from '../../../assets/images/mail.svg';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import { AppContext } from '../../components/AppContext';
import { getEmail, loginUser } from '../../../utils/storage';
import ErrorMessage from '../../components/ErrorMessage';
import saveSessionOptions from '../../services/saveSession';
import { PINInputFields } from '../../components/InputPinPage';
import useFetchData from '../../../utils/fetchAPI';

const ForgotPassword = ({ navigation, setCanChange }) => {
  const { getFetchData, postFetchData } = useFetchData();
  const {
    appData,
    isSessionTimedOut,
    isLoading,
    setIsLoading,
    vh,
    setAppData,
    isLoggedIn,
    setVerified,
    setCanChangeRole,
  } = useContext(AppContext);
  const [codeSent, setCodeSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [otpTimeout, setOtpTimeout] = useState(60);
  const [otpResend, setOtpResend] = useState(otpTimeout);
  const [reload, setReload] = useState(false);
  const inputRef = useRef();

  const codeLengths = [1, 2, 3, 4];

  useEffect(() => {
    getEmail().then(email => {
      if (email) {
        setFormData(prev => {
          return { ...prev, email };
        });
      }
    });
  }, []);

  useEffect(() => {
    setIsPinOkay(otpCode.length === codeLengths.length);
  }, [codeLengths.length, otpCode.length]);

  const handlePress = async () => {
    try {
      if (Object.values(formData).includes('')) {
        setErrorMessage('Please input you email');
        setErrorKey('email');
      } else {
        setIsLoading(true);
        setOtpResend(otpTimeout);
        setErrorMessage('');
        setErrorKey('');
        const response = await postFetchData('auth/forget-password', formData);
        const result = response.data;
        if (result?.email === formData.email) {
          setCodeSent(true);
          inputRef.current.focus();
        } else {
          if (typeof response === 'string') {
            setErrorMessage(response);
          } else {
            setErrorKey('email');
            setErrorMessage(result.error);
          }
        }
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async ({ pinCode: paramsPinCode }) => {
    const code = paramsPinCode || otpCode;
    setIsLoading(true);
    try {
      const fetchResult = await postFetchData(
        `auth/confirm-otp/${code || 'fake'}`,
        formData,
      );
      const { data: result } = fetchResult;
      if (fetchResult === "Couldn't connect to server") {
        return setErrorMessage(fetchResult);
      } else if (Object.keys(result).includes('error')) {
        setErrorKey('pinCode');
        setTimeout(() => {
          setOtpCode('');
          Keyboard.dismiss();
          setReload(prev => !prev);
        }, 1500);
        return setErrorMessage(result.error);
      }
      const sessionData = saveSessionOptions();
      await postFetchData('user/session', sessionData, result.data.token);
      await loginUser(result.data, sessionData.deviceID);
      setCanChange ? setCanChange(true) : navigation.replace('ChangePassword');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editInput = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    codeSent &&
      setTimeout(() => {
        otpResend > 1 ? setOtpResend(prev => prev - 1) : setOtpResend('now');
        otpResend === 1 && setOtpTimeout(prev => prev * 2);
      }, 1000);
  }, [codeSent, otpResend]);

  useEffect(() => {
    isLoggedIn && setFormData({ email: appData.email });
    isLoggedIn &&
      isSessionTimedOut &&
      postFetchData('auth/forget-password', { email: appData.email }).then(
        result => {
          result = result.data;
          if (result?.email === appData.email) {
            setCodeSent(true);
          }
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appData.email, isLoggedIn, isSessionTimedOut]);

  return (
    <PageContainer padding justify={true} avoidKeyboardPushup>
      <View style={{ ...styles.container, minHeight: vh * 0.95 }}>
        <View style={styles.logo}>
          <Logo />
        </View>
        <View style={styles.form} key={reload}>
          <Header
            title={'Forgot Password'}
            text={
              codeSent
                ? 'Kindly input the OTP sent to your email address'
                : 'To continue, kindly enter your email address'
            }
          />
          <TextInput
            autoFocus
            style={styles.codeInput}
            inputMode="numeric"
            onChangeText={text => {
              setOtpCode(text);
              text.length === codeLengths.length && Keyboard.dismiss();
              text.length === codeLengths.length &&
                handleConfirm({ pinCode: text });
              setErrorMessage('');
              setErrorKey('');
            }}
            maxLength={codeLengths.length}
            ref={inputRef}
            value={otpCode}
          />
          {codeSent ? (
            <>
              <View style={styles.codeLengthsContainer}>
                {codeLengths.map(input => (
                  <PINInputFields
                    key={input}
                    codeLength={input}
                    pinCode={otpCode}
                    inputRef={inputRef}
                    errorKey={errorKey}
                  />
                ))}
              </View>

              <View>
                <RegularText style={styles.enterCodeText}>
                  Enter the Four Digit code sent to your email
                </RegularText>
              </View>
              <ErrorMessage errorMessage={errorMessage} />
              <View style={styles.didnt}>
                <BoldText>Didn&apos;t receive the code? Resend </BoldText>
                {typeof otpResend === 'number' ? (
                  <BoldText>
                    in{' '}
                    <BoldText style={styles.now}>
                      {otpResend > 59 && Math.floor(otpResend / 60) + 'm '}
                      {otpResend % 60}s
                    </BoldText>
                  </BoldText>
                ) : (
                  <Pressable onPress={handlePress}>
                    <BoldText style={styles.now}>{otpResend}</BoldText>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <>
              {SignInData.slice(0, 1).map(item => (
                <Form
                  item={item}
                  formData={formData}
                  setFormData={setFormData}
                  key={item.name}
                  errorKey={errorKey}
                  setErrorKey={setErrorKey}
                  editInput={editInput}
                />
              ))}
              <ErrorMessage errorMessage={errorMessage} />
              <Button text={'Send One time password'} onPress={handlePress} />
            </>
          )}
        </View>
        {!codeSent && !isLoggedIn ? (
          <View style={styles.alreadyContainer}>
            <View style={styles.already}>
              <RegularText style={styles.alreadyText}>
                Already have an account?
              </RegularText>
              <Pressable onPress={() => navigation.navigate('SignIn')}>
                <BoldText style={styles.SignIn}>Sign in</BoldText>
              </Pressable>
            </View>
            {/* <View style={styles.SignInIcons}>
              <Pressable onPress={() => console.log('apple was clicked')}>
                <Apple />
              </Pressable>
              <Pressable onPress={() => console.log('google was clicked')}>
                <Google />
              </Pressable>
            </View> */}
          </View>
        ) : (
          <View style={styles.button} />
        )}
        {codeSent && (
          <View style={styles.button}>
            <Button
              text={'Confirm One time password'}
              onPress={handleConfirm}
              style={{
                backgroundColor: isPinOkay
                  ? '#1E1E1E'
                  : 'rgba(30, 30, 30, 0.7)',
              }}
              disabled={!isPinOkay || isLoading}
            />
          </View>
        )}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5 + '%',
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  checkTitle: {
    fontWeight: '600',
  },
  form: {
    flex: 1,
    paddingVertical: 30,
    minHeight: 150,
  },
  codeInput: {
    color: '#fff',
    position: 'absolute',
    transform: [{ translateX: -1000 }],
  },
  codeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  icon: {
    position: 'absolute',
    left: 10,
    zIndex: 9,
    top: 30 + '%',
  },
  textInput: {
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 40,
    borderWidth: 1,
    alignItems: 'flex-start',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
  },
  enterCodeText: {
    color: '#7A7A7A',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessageText: {
    fontSize: 14,
    marginBottom: 5,
    paddingHorizontal: 5,
    color: 'red',
    textAlign: 'center',
  },
  didnt: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  now: {
    color: 'orange',
    textDecorationLine: 'underline',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  alreadyContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  already: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  alreadyText: {
    color: '#868585',
  },
  SignIn: {
    fontWeight: '600',
  },
  SignInIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 15,
  },
});

export default ForgotPassword;

const Form = ({
  item,
  formData,
  setFormData,
  errorKey,
  setErrorKey,
  editInput,
}) => {
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <View style={styles.textInputContainer}>
      <View style={styles.icon}>
        <Email fill={inputFocus ? '#000' : '#868585'} />
      </View>
      <TextInput
        style={{
          ...styles.textInput,
          borderColor:
            errorKey === 'email' ? 'red' : inputFocus ? '#000' : '#B1B1B1',
        }}
        placeholder={item.placeholder}
        placeholderTextColor={inputFocus ? '#000' : '#80808080'}
        onChangeText={text => {
          setErrorKey('');
          editInput();
          setFormData({ [item.name]: text });
        }}
        name={item.name}
        inputMode={item.inputMode}
        autoCapitalize="none"
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        value={formData.email}
      />
    </View>
  );
};
