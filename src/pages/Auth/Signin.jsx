/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import Email from '../../../assets/images/mail.svg';
import Lock from '../../../assets/images/lock.svg';
import Eye from '../../../assets/images/eye.svg';
import EyeClosed from '../../../assets/images/eye-slash.svg';
import Apple from '../../../assets/images/apple.svg';
import Google from '../../../assets/images/google.svg';
import { signInData } from '../../database/data.js';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Header from '../../components/Header';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { AppContext } from '../../components/AppContext';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import LoadingModal from '../../components/LoadingModal';
import { loginUser } from '../../../utils/storage';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import saveSessionOptions from '../../services/Savesession';

const Signin = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // email: 'toyibe25@gmail.com',
    // password: '251101t',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const {
    vh,
    setIsLoggedIn,
    setAppData,
    isLoading,
    setIsLoading,
    setIsAdmin,
    setCanChangeRole,
  } = useContext(AppContext);

  const handleLogin = async () => {
    setIsLoading(true);
    if (Object.values(formData).includes('')) {
      setErrorMessage('Please input all fields');
      setIsLoading(false);
    } else {
      try {
        const sessionData = saveSessionOptions();
        const fetchedResult = await postFetchData('auth/login', formData);
        const result = fetchedResult.data;

        if (result?.data?.email === formData.email) {
          await postFetchData('user/session', sessionData, result.data.token);
          await loginUser(result.data, sessionData.deviceID);
          setSuccessMessage('Login Successful');
          const data = await getFetchData('user');
          if (result.data.role === 'admin') {
            setIsAdmin(true);
            setCanChangeRole(true);
          }
          setAppData(data.data);
          setIsLoggedIn(true);
          setIsLoading(false);
          setSuccessMessage('');
        } else {
          if (typeof fetchedResult === 'string') {
            setErrorMessage(fetchedResult);
          } else {
            setErrorKey(Object.keys(result)[0]);
            setErrorMessage(Object.values(result)[0]);
          }
          setIsLoading(false);
        }
      } catch (err) {
        setErrorMessage(err.message);
        setIsLoading(false);
      }
    }
  };

  const editInput = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <PageContainer scroll>
      <View style={{ ...styles.container, minHeight: vh }}>
        <View style={styles.headers}>
          <Logo />
        </View>
        <View style={styles.form}>
          <Header
            title={'Login Information'}
            text={'To continue, kindly complete the following details'}
          />
          {signInData.map(inputForm => (
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
          <View style={styles.signInIcons}>
            <Pressable onPress={() => console.log('apple was clicked')}>
              <Apple />
            </Pressable>
            <Pressable onPress={() => console.log('google was clicked')}>
              <Google />
            </Pressable>
          </View>
          <View style={styles.already}>
            <RegularText style={styles.alreadyText}>
              Don&apos;t have an account?
            </RegularText>
            <Pressable onPress={() => navigation.replace('Signup')}>
              <BoldText style={styles.signIn}>Sign up</BoldText>
            </Pressable>
          </View>
          <Button text={'Log in'} onPress={handleLogin} />
        </View>
      </View>
      <LoadingModal isLoading={isLoading} />
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
  signIn: {
    fontWeight: '600',
  },
  signInIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 15,
  },
});
export default Signin;

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
          // setRedBorder(formData[inputForm.name] === '');
          // setTempRedBorder(false);
        }}
        name={inputForm.name}
        autoComplete={inputForm.eye ? 'off' : inputForm.type}
        inputMode={inputForm.inputMode}
        autoCapitalize={inputForm.eye ? 'none' : undefined}
        autoCorrect={inputForm.eye || false}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
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
