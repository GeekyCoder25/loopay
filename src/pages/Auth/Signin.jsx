/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Keyboard } from 'react-native';
import Email from '../../../assets/images/mail.svg';
import Lock from '../../../assets/images/lock.svg';
import Eye from '../../../assets/images/eye.svg';
import EyeClosed from '../../../assets/images/eye-slash.svg';
import { SignInData } from '../../database/data.js';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Header from '../../components/Header';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { AppContext } from '../../components/AppContext';
import { getEmail, loginUser } from '../../../utils/storage';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import { EmailVerify } from './Signup.jsx';
import { timeForInactivityInSecond } from '../../config/config.js';
import useFetchData from '../../../utils/fetchAPI.js';
import * as Device from 'expo-device';
import { randomUUID } from 'expo-crypto';

const SignIn = ({ navigation }) => {
  const { getFetchData, postFetchData } = useFetchData();
  const {
    vh,
    setIsLoggedIn,
    setAppData,
    setIsLoading,
    setIsAdmin,
    setCanChangeRole,
    setVerified,
    setIsSessionTimedOut,
    timerId,
    timerIdTotal,
  } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [verifyEmail, setVerifyEmail] = useState(false);

  useEffect(() => {
    getEmail().then(email => {
      if (email) {
        setFormData(prev => {
          return { ...prev, email };
        });
      }
    });
  }, []);

  const handleLogin = async () => {
    setErrorMessage('');
    if (Object.values(formData).includes('')) {
      setErrorMessage('Please input all fields');
    } else {
      setIsLoading(true);
      try {
        const saveSessionOptions = () => {
          return {
            deviceManufacturer: Device.manufacturer,
            deviceName: Device.deviceName,
            deviceModel: Device.modelName,
            deviceID: randomUUID(),
            osName: Device.osName,
            osVersion: Device.osVersion,
            firstSignIn: new Date(),
            lastSeen: new Date(),
          };
        };

        const sessionData = saveSessionOptions();
        const response = await postFetchData('auth/login', formData);
        const result = response.data;
        const data = result.data;

        if (response.status === 403) {
          setErrorKey(Object.keys(result)[0]);
          setErrorMessage(Object.values(result)[0]);
          return setVerifyEmail(true);
        }

        if (
          result?.data?.email.toLowerCase() === formData.email.toLowerCase()
        ) {
          await postFetchData('user/session', sessionData, data.token);
          await loginUser(data, sessionData.deviceID);
          setErrorMessage('');
          setSuccessMessage('Login Successful');
          const response2 = await getFetchData('user?popup=true');
          if (response2.status === 401) {
            return setErrorMessage('Unexpected error occurred');
          }
          if (data.role === 'admin') {
            setIsAdmin(true);
            setCanChangeRole(true);
          }
          setAppData(response2.data);
          setVerified(response2.data.verificationStatus || false);
          setIsLoggedIn(true);
          setIsLoading(false);
          setSuccessMessage('');
          setIsSessionTimedOut(false);
          clearTimeout(timerId.current);
          clearTimeout(timerIdTotal.current);
          timerId.current = setTimeout(() => {
            setIsSessionTimedOut(true);
          }, timeForInactivityInSecond * 1000);

          const isVerified =
            data.verificationStatus === 'verified' ||
            data.verificationStatus === 'pending';

          if (!isVerified) {
            return navigation.replace('FirstTimeVerifications');
          }
        } else {
          if (typeof response === 'string') {
            setErrorMessage(response);
          } else if (typeof Object.keys(result)[0] === 'string') {
            setErrorKey(Object.keys(result)[0]);
            setErrorMessage(Object.values(result)[0]);
          } else if (typeof Object.keys(data)[0] === 'string') {
            setErrorKey(Object.keys(data)[0]);
            setErrorMessage(Object.values(data)[0]);
          } else {
            setErrorMessage('Unexpected error');
          }
          setIsLoading(false);
        }
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const editInput = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <>
      <PageContainer scroll avoidKeyboardPushup avoidBounce>
        <View style={{ ...styles.container, minHeight: vh * 0.95 }}>
          <View style={styles.headers}>
            <Logo />
          </View>
          <View style={styles.form}>
            <Header
              title={'Login Information'}
              text={'To continue, kindly complete the following details'}
            />
            {SignInData.map(inputForm => (
              <FormField
                key={inputForm.name}
                inputForm={inputForm}
                formData={formData}
                setFormData={setFormData}
                editInput={editInput}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                showRedBorder={errorMessage}
              />
            ))}
            <ErrorMessage errorMessage={errorMessage} />
            <SuccessMessage successMessage={successMessage} />
            <View style={styles.forgetPressable}>
              <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                <BoldText style={styles.forget}>Forget Password?</BoldText>
              </Pressable>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <View style={styles.already}>
              <RegularText style={styles.alreadyText}>
                Don&apos;t have an account?
              </RegularText>
              <Pressable onPress={() => navigation.replace('SignUp')}>
                <BoldText style={styles.SignIn}>Sign up</BoldText>
              </Pressable>
            </View>
            <Button text={'Log in'} onPress={handleLogin} />
          </View>
        </View>
      </PageContainer>
      {verifyEmail && (
        <EmailVerify
          email={formData.email}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          navigation={navigation}
          setVerifyEmail={setVerifyEmail}
        />
      )}
    </>
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
    marginBottom: 80,
  },
  heading: {
    fontWeight: '600',
  },
  form: { flex: 1, paddingVertical: 30 },
  textInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  icon: {
    position: 'absolute',
    left: 10,
    zIndex: 9,
    top: 30 + '%',
  },
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
    paddingBottom: 20,
    color: 'red',
    textAlign: 'center',
  },
  successMessageText: {
    marginLeft: 5,
    fontSize: 13,
    paddingBottom: 20,
    marginTop: 2,
    color: 'green',
    textAlign: 'center',
  },
  forgetPressable: {
    alignItems: 'flex-end',
  },
  forget: {
    fontWeight: '600',
  },
  actionButtons: {
    flex: 1,
    paddingBottom: 5 + '%',
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
    marginVertical: 20,
    gap: 15,
  },
});
export default SignIn;

const FormField = ({
  inputForm,
  formData,
  setFormData,
  editInput,
  errorKey,
  setErrorKey,
  showRedBorder,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [inputFocus, setInputFocus] = useState(false);
  const [redBorder, setRedBorder] = useState(showRedBorder);

  const selectIcon = fill => {
    switch (inputForm.type) {
      case 'email':
        return <Email fill={fill} />;
      case 'password':
        return <Lock fill={fill} />;
      default:
        break;
    }
  };
  useEffect(() => {
    (showRedBorder && formData[inputForm.name] === '') || errorKey === 'error'
      ? setRedBorder(true)
      : setRedBorder(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRedBorder]);
  const fillColor = inputFocus ? '#000' : '#868585';
  return (
    <View style={styles.textInputContainer}>
      <View style={styles.icon}>{selectIcon(fillColor)}</View>
      <TextInput
        style={{
          ...styles.textInput,
          borderColor:
            errorKey === inputForm.name || redBorder
              ? 'red'
              : inputFocus
                ? '#000'
                : '#B1B1B1',
        }}
        placeholder={inputForm.placeholder}
        placeholderTextColor={inputFocus ? '#000' : '#80808080'}
        secureTextEntry={inputForm.eye ? showPassword : false}
        maxLength={inputForm.eye ? 6 : undefined}
        onChangeText={text => {
          setErrorKey('');
          editInput();
          setFormData(prev => {
            return { ...prev, [inputForm.name]: text };
          });
          inputForm.eye && text.length === 6 && Keyboard.dismiss();
        }}
        name={inputForm.name}
        autoComplete={inputForm.eye ? 'off' : inputForm.type}
        inputMode={inputForm.inputMode}
        autoCapitalize={inputForm.eye ? 'none' : undefined}
        autoCorrect={inputForm.eye || false}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        value={formData[inputForm.name]}
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
