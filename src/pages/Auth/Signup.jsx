import { useContext, useState } from 'react';
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

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const handleLogin = () => {
    console.log(formData);
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords doesn't match");
      // setLoading(false);
    }
    navigation.navigate('AccountType');
  };

  const editInput = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };
  const { vh } = useContext(AppContext);

  return (
    <PageContainer>
      <ScrollView>
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
                setFormData={setFormData}
                editInput={editInput}
              />
            ))}
            {errorMessage && (
              <>
                {/* <Icon name="warning" size={15} color="red" /> */}
                <BoldText style={styles.errorMessageBold}>
                  {errorMessage}
                </BoldText>
              </>
            )}
            {successMessage && (
              <>
                {/* <Icon name="check-circle" size={20} color="green" />{' '} */}
                <BoldText style={styles.successMessageText}>
                  {successMessage}
                </BoldText>
              </>
            )}
          </View>
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
            <Button text={'Register'} handlePress={handleLogin} />
          </View>
        </View>
      </ScrollView>
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
    marginLeft: 5,
    fontSize: 13,
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

const FormField = ({ inputForm, setFormData }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [inputFocus, setInputFocus] = useState(false);

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
          borderColor: inputFocus ? '#000' : '#B1B1B1',
        }}
        placeholder={inputForm.placeholder}
        placeholderTextColor={inputFocus ? '#000' : '#80808080'}
        secureTextEntry={inputForm.eye ? showPassword : false}
        onChangeText={text => {
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
          <Eye />
        </Pressable>
      )}
    </View>
  );
};
