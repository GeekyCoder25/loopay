/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import User from '../../../assets/images/user.svg';
import Email from '../../../assets/images/mail.svg';
import Phone from '../../../assets/images/phone.svg';
import Lock from '../../../assets/images/lock.svg';
import Eye from '../../../assets/images/eye.svg';
import EyeClosed from '../../../assets/images/eye-slash.svg';
import Apple from '../../../assets/images/apple.svg';
import Google from '../../../assets/images/google.svg';
import { signUpData } from '../../database/data.js';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Header from '../../components/Header';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { AppContext } from '../../components/AppContext';
import { postFetchData } from '../../../utils/fetchAPI';
import LoadingModal from '../../components/LoadingModal';
import { loginUser } from '../../../utils/storage';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import saveSessionOptions from '../../services/Savesession';

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    // firstName: '',
    // lastName: '',
    // userName: '',
    // email: '',
    // password: '',
    // confirmPassword: '',
    // phoneNumber: '',
    firstName: 'Toyyib',
    lastName: 'Lawal',
    userName: 'Geeky Coder',
    email: 'toyibe25@gmail.com',
    phoneNumber: '9073002599',
    password: '251',
    confirmPassword: '251',
    role: 'admin',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const { vh, setAppData, isLoading, setIsLoading } = useContext(AppContext);

  const handleSignup = async () => {
    setIsLoading(true);
    if (Object.values(formData).includes('')) {
      setErrorMessage('Please input all fields');
      setIsLoading(false);
    } else if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords doesn't match");
      setErrorKey('password');
      setIsLoading(false);
    } else {
      editInput();
      try {
        const sessionData = saveSessionOptions();
        const { email, firstName, lastName, userName, phoneNumber } = formData;
        const fetchedResult = await postFetchData('auth/register', {
          formData,
          sessionData,
        });
        const result = fetchedResult.data;
        if (fetchedResult.status === 201) {
          setSuccessMessage(Object.values(result)[0]);
          await loginUser(result.data, sessionData.deviceID);
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
          setIsLoading(false);
          setErrorMessage('');
          setSuccessMessage('');
          navigation.replace('AccountType');
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
        setErrorMessage(err);
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
          {signUpData.map(inputForm => (
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
        </View>
        <View style={styles.alreadyContainer}>
          <View style={styles.already}>
            <RegularText style={styles.alreadyText}>
              Already have an account?
            </RegularText>
            <Pressable onPress={() => navigation.replace('Signin')}>
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
          <Button text={'Register'} onPress={handleSignup} />
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
export default Signup;

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

  useEffect(() => {
    showRedBorder && formData[inputForm.name] === ''
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
      default:
        break;
    }
  };

  const fillColor = inputFocus ? '#000' : '#868585';
  return (
    <View style={styles.textInputContainer}>
      <View style={styles.icon}>{selectIcon(fillColor)}</View>
      <TextInput
        style={{
          ...styles.textInput,
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
        secureTextEntry={inputForm.eye ? showPassword : false}
        onChangeText={text => {
          setErrorKey('');
          editInput();
          setFormData(prev => {
            return { ...prev, [inputForm.name]: text };
          });
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
