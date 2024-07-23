/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import User from '../../../assets/images/user.svg';
import Email from '../../../assets/images/mail.svg';
import Phone from '../../../assets/images/phone.svg';
import Lock from '../../../assets/images/lock.svg';
import Eye from '../../../assets/images/eye.svg';
import EyeClosed from '../../../assets/images/eye-slash.svg';
import Refer from '../../../assets/images/referral.svg';
import { SignUpData } from '../../database/data.js';
import Logo from '../../components/Logo.jsx';
import Button from '../../components/Button.jsx';
import Header from '../../components/Header.jsx';
import PageContainer from '../../components/PageContainer.jsx';
import BoldText from '../../components/fonts/BoldText.jsx';
import RegularText from '../../components/fonts/RegularText.jsx';
import { AppContext } from '../../components/AppContext.js';
import useFetchData from '../../../utils/fetchAPI.js';
import { loginUser } from '../../../utils/storage.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import SuccessMessage from '../../components/SuccessMessage.jsx';
import saveSessionOptions from '../../services/saveSession.js';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { CountryPicker } from 'react-native-country-codes-picker';
import * as Haptics from 'expo-haptics';
import ToastMessage from '../../components/ToastMessage.jsx';
import { CurrencyFullDetails } from '../../../utils/allCountries.js';
import Toast from 'react-native-toast-message';

const SignUp = ({ navigation }) => {
  const { postFetchData } = useFetchData();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    // firstName: 'John',
    // lastName: 'Doe',
    // userName: 'johndoes',
    // email: 'john257@gmail.com',
    // password: '251101',
    // confirmPassword: '251101',
    // phoneNumber: '',
    // localCurrencyCode: 'NGN',
    // country: {
    //   name: 'Nigeria',
    //   code: 'NG',
    // },
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryCodeData, setCountryCodeData] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const { vh, setIsLoading } = useContext(AppContext);
  const [verifyEmail, setVerifyEmail] = useState(false);

  const handleSignUp = async () => {
    if (Object.values({ ...formData, referralCode: '0' }).includes('')) {
      setErrorMessage('Please input all fields');
    } else if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords doesn't match");
      setErrorKey('password');
    } else if (!countryCode) {
      setErrorMessage('Please input all fields');
      setErrorKey('phoneNumber');
    } else {
      editInput();
      const localCurrencyCode = Object.values(CurrencyFullDetails).find(
        currency =>
          // (currency.name
          //   .split(' ')[0]
          //   ?.slice(0, 4)
          //   ?.startsWith(countryCodeData.name.en?.slice(0, 4)) ||
          //   currency.name
          //     .split(' ')[1]
          //     ?.slice(0, 4)
          //     ?.startsWith(countryCodeData.name.en?.slice(0, 4)) ||
          //   countryCodeData.name.en
          //     ?.slice(0, 4)
          //     .startsWith(currency.name.split(' ')[1]?.slice(0, 4)) ||
          //   countryCodeData.name.en
          //     ?.slice(0, 4)
          //     .startsWith(currency.name.split(' ')[2]?.slice(0, 4))) &&
          currency.code.slice(0, 2) === countryCodeData.code,
      )?.code;

      if (!localCurrencyCode) {
        return setErrorMessage("This region isn't supported yet");
      }
      try {
        setIsLoading(true);
        const { email, phoneNumber } = formData;
        const response = await postFetchData('auth/register', {
          ...formData,
          phoneNumber: countryCode + phoneNumber.split(' ').join(''),
          localCurrencyCode,
          currencyDetails: CurrencyFullDetails[localCurrencyCode],
        });
        setFormData({
          ...formData,
          phoneNumber,
          countryCode,
          localCurrencyCode,
          currencyDetails: CurrencyFullDetails[localCurrencyCode],
        });
        const result = response.data;
        if (
          response.status === 200 &&
          result.email.toLowerCase() === email.toLowerCase()
        ) {
          setIsLoading(false);
          setErrorMessage('');
          setErrorKey('');
          return setVerifyEmail(true);
        } else {
          if (typeof response === 'string') {
            setErrorMessage(response);
          } else {
            setErrorKey(Object.keys(result)[0]);
            setErrorMessage(Object.values(result)[0]);
          }
          setIsLoading(false);
        }
      } catch (err) {
        setErrorMessage(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const editInput = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCountrySelect = item => {
    const localCurrencyCode = Object.values(CurrencyFullDetails).find(
      currency => currency.code.slice(0, 2) === item.code,
    );
    if (!localCurrencyCode) {
      setErrorKey('phoneNumber');
      Toast.show({
        type: 'error',
        text1: 'Currency currently not supported',
        text2: "Our service doesn't cover for this region yet",
      });
    } else {
      Toast.show({
        type: 'success',
        text1: localCurrencyCode?.code,
        text2: localCurrencyCode?.name,
      });
    }
    setCountryCode(item.dial_code);
    setShowPicker(false);
    setCountryCodeData(item);
    setFormData(prev => {
      return {
        ...prev,
        phoneNumber: '',
        country: { code: item.code, name: item.name.en },
      };
    });
  };

  if (verifyEmail) {
    return (
      <EmailVerify
        email={formData.email}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
        navigation={navigation}
        setVerifyEmail={setVerifyEmail}
        formData={formData}
      />
    );
  }
  return (
    <PageContainer scroll avoidBounce avoidKeyboardPushup>
      <View
        style={{
          ...styles.container,
          minHeight: vh,
        }}>
        <View style={styles.headers}>
          <Logo />
        </View>
        <View style={styles.form}>
          <Header
            title={'Personal Info'}
            text={'To continue, kindly complete the following fields.'}
          />
          {SignUpData.map(inputForm => (
            <FormField
              key={inputForm.name}
              inputForm={inputForm}
              formData={formData}
              setFormData={setFormData}
              editInput={editInput}
              errorKey={errorKey}
              setErrorKey={setErrorKey}
              showRedBorder={errorMessage}
              countryCode={countryCode}
              setShowPicker={setShowPicker}
              countryCodeData={countryCodeData}
            />
          ))}
          <ErrorMessage errorMessage={errorMessage} />
          <SuccessMessage successMessage={successMessage} />
        </View>
        <View style={styles.alreadyContainer}>
          <View style={styles.already}>
            <RegularText style={styles.alreadyText}>
              Already have an account?
            </RegularText>
            <Pressable onPress={() => navigation.replace('SignIn')}>
              <BoldText style={styles.SignIn}>Sign in</BoldText>
            </Pressable>
          </View>
          <Button text={'Register'} onPress={handleSignUp} />
        </View>
      </View>
      <CountryPicker
        show={showPicker}
        pickerButtonOnPress={handleCountrySelect}
        searchMessage={'Search here'}
        onRequestClose={() => setShowPicker(false)}
        onBackdropPress={() => setShowPicker(false)}
        style={{
          modal: {
            marginTop: SafeAreaView.length ? SafeAreaView.length * 8 : 100,
            flex: 1,
          },
        }}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5 + '%',
    paddingHorizontal: 3 + '%',
  },
  headers: {
    flex: 1,
    gap: 10,
    justifyContent: 'flex-end',
    minHeight: 100,
  },
  heading: {
    fontWeight: '600',
  },
  form: { flex: 2, paddingVertical: 30, justifyContent: 'center' },
  textInputContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  icon: {
    position: 'absolute',
    left: 10,
    zIndex: 9,
    justifyContent: 'center',
    height: 100 + '%',
    alignItems: 'center',
    minWidth: 5,
  },
  phonePicker: {
    minWidth: 60,
    position: 'absolute',
    zIndex: 9,
    left: 5,
    justifyContent: 'space-between',
    paddingRight: 5,
    borderRightWidth: 1,
    height: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  code: { width: 85, paddingLeft: 45, textAlign: 'center' },
  textInput: {
    width: 100 + '%',
    height: 45,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    borderWidth: 1,
    alignItems: 'flex-start',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
  },
  eye: {
    height: 100 + '%',
    position: 'absolute',
    right: 0,
    paddingHorizontal: 15,
    zIndex: 9,
    justifyContent: 'center',
  },
  errorMessage: {
    flexDirection: 'row',
    top: -20,
  },
  errorMessageText: {
    fontSize: 14,
    marginTop: 2,
    paddingHorizontal: 5,
    color: 'red',
    textAlign: 'center',
  },
  successMessageText: {
    marginLeft: 5,
    fontSize: 13,
    marginTop: 2,
    color: 'green',
    textAlign: 'center',
  },
  alreadyContainer: { flex: 1, paddingBottom: 50 },
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
  verifyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
    minHeight: Dimensions.get('screen').height * 0.98,
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
  footer: {
    alignItems: 'center',
    rowGap: 10,
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
});
export default SignUp;

const FormField = ({
  inputForm,
  formData,
  setFormData,
  editInput,
  errorKey,
  setErrorKey,
  showRedBorder,
  countryCode,
  setShowPicker,
  countryCodeData,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [inputFocus, setInputFocus] = useState(false);
  const [redBorder, setRedBorder] = useState(showRedBorder);
  useEffect(() => {
    showRedBorder && formData[inputForm.name] === '' && !inputForm.optional
      ? setRedBorder(true)
      : setRedBorder(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRedBorder]);

  const selectIcon = fill => {
    switch (inputForm.type) {
      case 'name':
        return <User fill={fill} />;
      case 'username':
        return <User fill={fill} />;
      case 'email':
        return <Email fill={fill} />;
      case 'tel':
        return <Phone fill={fill} />;
      case 'password':
        return <Lock fill={fill} />;
      case 'referral':
        return <Refer fill={fill} />;
      default:
        break;
    }
  };

  const fillColor = inputFocus ? '#000' : '#868585';
  return (
    <View style={styles.textInputContainer}>
      {inputForm.countryCode ? (
        <Pressable
          style={styles.phonePicker}
          onPress={() => setShowPicker(true)}>
          {countryCodeData ? (
            <>
              <View style={{ ...styles.icon, left: 5 }}>
                <Image
                  source={{
                    uri: `https://flagcdn.com/w160/${countryCodeData.code.toLowerCase()}.png`,
                  }}
                  width={32}
                  height={25}
                  style={{ borderRadius: 5 }}
                />
              </View>
            </>
          ) : (
            <View style={styles.icon}>{selectIcon(fillColor)}</View>
          )}
          <BoldText style={styles.code}>{countryCode}</BoldText>

          <View style={styles.phoneChevron}>
            <FaIcon name="chevron-down" size={18} color={'#b1b1b1'} />
          </View>
        </Pressable>
      ) : (
        <View style={styles.icon}>{selectIcon(fillColor)}</View>
      )}
      <TextInput
        style={{
          ...styles.textInput,
          paddingLeft: inputForm.countryCode ? 130 : 40,
          borderColor:
            errorKey === inputForm.name ||
            (errorKey === 'password' && inputForm.name === 'confirmPassword') ||
            redBorder
              ? 'red'
              : inputFocus
                ? '#000'
                : '#B1B1B1',
        }}
        placeholder={inputForm.placeholder}
        placeholderTextColor={inputFocus ? '#000' : '#80808080'}
        maxLength={inputForm.eye ? 6 : undefined}
        onChangeText={text => {
          inputForm.countryCode && !countryCode && setShowPicker(true);
          setErrorKey('');
          editInput();
          setFormData(prev => {
            return {
              ...prev,
              [inputForm.name]: text,
            };
          });
        }}
        name={inputForm.name}
        autoComplete={
          inputForm.eye || inputForm.type === 'referral'
            ? 'off'
            : inputForm.type
        }
        inputMode={inputForm.inputMode}
        autoCapitalize={inputForm.eye ? 'none' : undefined}
        autoCorrect={inputForm.eye || false}
        onFocus={() => {
          inputForm.countryCode && !countryCode && setShowPicker(true);
          setInputFocus(true);
        }}
        onBlur={() => setInputFocus(false)}
        value={formData[inputForm.name]}
        secureTextEntry={inputForm.eye ? showPassword : false}
      />
      {inputForm.eye && (
        <Pressable
          style={styles.eye}
          onPress={() => setShowPassword(prev => !prev)}>
          {showPassword ? <Eye /> : <EyeClosed />}
        </Pressable>
      )}
    </View>
  );
};

export const EmailVerify = ({
  email,
  setErrorMessage,
  setSuccessMessage,
  setVerifyEmail,
  formData,
}) => {
  const { postFetchData, putFetchData } = useFetchData();
  const {
    vw,
    vh,
    setAppData,
    setIsLoading,
    setIsSessionTimedOut,
    setIsLoggedIn,
  } = useContext(AppContext);
  const [inputCode, setInputCode] = useState('');
  const [errorCode, setErrorCode] = useState(false);
  const [errorMessage2, setErrorMessage2] = useState('');
  const [otpTimeout, setOtpTimeout] = useState(60);
  const [otpResend, setOtpResend] = useState(otpTimeout);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      otpResend > 1 ? setOtpResend(prev => prev - 1) : setOtpResend('now');
      otpResend === 1 && setOtpTimeout(prev => prev * 2);
    }, 1000);
  }, [codeSent, otpResend]);

  const handleInput = async input => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputCode(prev => `${prev}${input}`);
    setErrorMessage2('');

    if (inputCode.length + 1 >= codeLength.length) {
      try {
        setIsLoading(true);
        const session = saveSessionOptions();
        const response = await putFetchData('auth/register', {
          otp: `${inputCode}${input}`,
          email,
          session,
        });
        if (response.status === 201) {
          setVerifyEmail(false);
          const result = response.data;
          const { firstName, lastName, userName, phoneNumber } = result.data;
          setSuccessMessage(Object.values(result)[0]);
          await loginUser(result.data, session.deviceID);
          const data = {
            email,
            userProfile: {
              lastName,
              firstName,
              userName,
              phoneNumber,
            },
          };
          setAppData(data);
          setErrorMessage('');
          setSuccessMessage('');
          setIsSessionTimedOut(false);
          setIsLoggedIn(true);
        } else {
          setErrorMessage2(response.data?.error || response.data);
          setErrorCode(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setTimeout(() => {
            setInputCode('');
            setErrorCode(false);
          }, 500);
        }
      } catch (err) {
        ToastMessage(err.message);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleResend = async () => {
    try {
      setIsLoading(true);
      setOtpResend(otpTimeout);
      setErrorMessage('');
      const response = await postFetchData('auth/register', {
        ...formData,
        phoneNumber: formData.countryCode + formData.phoneNumber,
      });
      const result = response.data;
      if (result?.email === email) {
        setCodeSent(true);
      } else {
        if (typeof response === 'string') {
          setErrorMessage(response || 'An unexpected error occurred');
        } else {
          setErrorMessage(Object.values(result)[0]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const codeLength = [1, 2, 3, 4];

  return (
    <ScrollView contentContainerStyle={styles.verifyContainer} bounces={false}>
      <Image
        style={styles.logo}
        source={require('../../../assets/images/icon.png')}
        resizeMode="contain"
      />
      <RegularText>Enter the verification code sent to your email </RegularText>
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
      <View style={styles.errorMessage}>
        <ErrorMessage errorMessage={errorMessage2} />
      </View>
      <View style={styles.digits}>
        <View style={styles.row}>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('1')}>
            <BoldText style={styles.digitText}>1</BoldText>
          </Pressable>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('2')}>
            <BoldText style={styles.digitText}>2</BoldText>
          </Pressable>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('3')}>
            <BoldText style={styles.digitText}>3</BoldText>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('4')}>
            <BoldText style={styles.digitText}>4</BoldText>
          </Pressable>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('5')}>
            <BoldText style={styles.digitText}>5</BoldText>
          </Pressable>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('6')}>
            <BoldText style={styles.digitText}>6</BoldText>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('7')}>
            <BoldText style={styles.digitText}>7</BoldText>
          </Pressable>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('8')}>
            <BoldText style={styles.digitText}>8</BoldText>
          </Pressable>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('9')}>
            <BoldText style={styles.digitText}>9</BoldText>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
          />
          <Pressable
            disabled={inputCode.length >= codeLength.length}
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => handleInput('0')}>
            <BoldText style={styles.digitText}>0</BoldText>
          </Pressable>

          <Pressable
            style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
            onPress={() => setInputCode(prev => prev.slice(0, -1))}>
            <Image
              source={require('../../../assets/images/delete.png')}
              style={styles.delete}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
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
            <Pressable onPress={handleResend}>
              <BoldText style={styles.now}>{otpResend}</BoldText>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => {
            setVerifyEmail(false);
          }}>
          <BoldText>Go Back</BoldText>
        </Pressable>
      </View>
    </ScrollView>
  );
};
