/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { signInData } from '../../database/data';
import Header from '../../components/Header';
import Email from '../../../assets/images/mail.svg';
import Apple from '../../../assets/images/apple.svg';
import Google from '../../../assets/images/google.svg';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import { AppContext } from '../../components/AppContext';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import { loginUser } from '../../../utils/storage';
import ErrorMessage from '../../components/ErrorMessage';

const ForgotPassword = ({ navigation }) => {
  const [codeSent, setCodeSent] = useState(false);
  const [focusIndex, setFocusIndex] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [errorKey, setErrorKey] = useState('');
  const [otpTimeout, setOtpTimeout] = useState(60);
  const [otpResend, setOtpResend] = useState(otpTimeout);
  const { setIsLoading, setIsLoggedIn, vh, setAppData } =
    useContext(AppContext);
  const codeLengths = [1, 2, 3, 4];

  useEffect(() => {
    setIsPinOkay(otpCode.length === codeLengths.length);
  }, [codeLengths.length, otpCode.length]);

  const handlePress = () => {
    if (Object.values(formData).includes('')) {
      setErrorMessage('Please input you email');
      setErrorKey('email');
    } else {
      setIsLoading(true);
      setOtpResend(otpTimeout);
      setErrorMessage('');
      postFetchData('auth/forget-password', formData).then(result => {
        result = result.data;
        if (result?.email === formData.email) {
          setCodeSent(true);
        } else {
          setErrorKey('email');
          setErrorMessage(result.email);
        }
        setIsLoading(false);
      });
    }
  };

  const handleCofirm = async () => {
    try {
      setIsLoading(true);
      console.log(otpCode);
      const fetchResult = await postFetchData(
        `auth/forget-password/${otpCode || 'fake'}`,
        formData,
      );
      const { data: result } = fetchResult;
      if (result === "Couldn't connect to server") {
        return setErrorMessage(result);
      } else if (Object.keys(result).includes('error')) {
        setErrorKey('otpCode');
        return setErrorMessage(result.error);
      }
      loginUser(result.data).then(() => {
        getFetchData('user').then(data => {
          try {
            setAppData(data);
            setIsLoggedIn(true);
          } catch {
            err => console.log(err);
          }
        });
      });
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
  return (
    <PageContainer padding={true} justify={true}>
      <View style={styles.container}>
        <View style={{ ...styles.container, minHeight: vh }}>
          <View style={styles.logo}>
            <Logo />
          </View>
          <View style={styles.form}>
            <Header
              title={'Forgot Password'}
              text={'To continue, kindly enter your email address'}
            />
            {codeSent ? (
              <>
                <View style={styles.codeLengthsContainer}>
                  {codeLengths.map(codeLength => (
                    <OTPInput
                      key={codeLength}
                      codeLength={codeLength}
                      focusIndex={focusIndex}
                      setFocusIndex={setFocusIndex}
                      otpCode={otpCode}
                      setOtpCode={setOtpCode}
                      setErrorMessage={setErrorMessage}
                      errorKey={errorKey}
                      setErrorKey={setErrorKey}
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
                <Button
                  text={'Confirm One time password'}
                  handlePress={handleCofirm}
                  style={{
                    backgroundColor: isPinOkay
                      ? '#1E1E1E'
                      : 'rgba(30, 30, 30, 0.7)',
                  }}
                  disabled={!isPinOkay}
                />
              </>
            ) : (
              <>
                {signInData.slice(0, 1).map(item => (
                  <Form
                    item={item}
                    setFormData={setFormData}
                    key={item.name}
                    errorKey={errorKey}
                    setErrorKey={setErrorKey}
                    editInput={editInput}
                  />
                ))}
                <ErrorMessage errorMessage={errorMessage} />
                <Button
                  text={'Send One time password'}
                  handlePress={handlePress}
                />
              </>
            )}
          </View>
          {!codeSent ? (
            <View style={styles.alreadyContainer}>
              <View style={styles.already}>
                <RegularText style={styles.alreadyText}>
                  Already have an account?
                </RegularText>
                <Pressable onPress={() => navigation.navigate('Signin')}>
                  <BoldText style={styles.signIn}>Sign in</BoldText>
                </Pressable>
              </View>
              <View style={styles.signInIcons}>
                <Pressable onPress={() => console.log('apple was clicked')}>
                  <Apple />
                </Pressable>
                <Pressable onPress={() => console.log('google was clicked')}>
                  <Google />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.alreadyContainer} />
          )}
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 50,
    textAlign: 'center',
    fontSize: 35,
    fontFamily: 'OpenSans-700',
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
  signIn: {
    fontWeight: '600',
  },
  signInIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 15,
  },
});

export default ForgotPassword;

const Form = ({ item, setFormData, errorKey, setErrorKey, editInput }) => {
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
      />
    </View>
  );
};

const OTPInput = ({
  codeLength,
  focusIndex,
  setFocusIndex,
  otpCode,
  setOtpCode,
  setErrorMessage,
  errorKey,
  setErrorKey,
}) => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (codeLength === focusIndex) {
      inputRef.current.focus();
      inputRef.current.clear();
      setInputValue('');
    }
  }, [focusIndex, codeLength]);

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key !== 'Backspace') {
      if (focusIndex < 4) {
        setFocusIndex(prev => prev + 1);
      } else {
        Keyboard.dismiss();
        inputRef.current.blur();
      }
    } else {
      setOtpCode(prev => prev.slice(0, otpCode.length - 1));
      inputValue === ''
        ? focusIndex > 1 && setFocusIndex(prev => prev - 1)
        : inputRef.current.clear();
    }
  };

  return (
    <TextInput
      style={{
        ...styles.codeInput,
        borderBottomColor: errorKey === 'otpCode' ? 'red' : '#000',
        color: errorKey === 'otpCode' ? 'red' : '#000',
      }}
      value={inputValue}
      inputMode="numeric"
      maxLength={1}
      autoFocus={codeLength === focusIndex}
      ref={inputRef}
      onChangeText={text => {
        setInputValue(text);
        setOtpCode(prev => `${prev}${text}`);
      }}
      onKeyPress={handleKeyPress}
      onFocus={() => {
        setFocusIndex(codeLength);
        setErrorMessage('');
        setErrorKey('');
      }}
      name="otpCode"
    />
  );
};
