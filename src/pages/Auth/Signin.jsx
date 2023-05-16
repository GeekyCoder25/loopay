import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import User from '../../../assets/images/user.svg';
import Email from '../../../assets/images/mail.svg';
import Phone from '../../../assets/images/phone.svg';
import Lock from '../../../assets/images/lock.svg';
import Eye from '../../../assets/images/eye.svg';
import Apple from '../../../assets/images/apple.svg';
import Google from '../../../assets/images/google.svg';
import { signInData } from '../../../utils/data.js';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Header from '../../components/Header';

const Signin = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const handleLogin = () => {
    console.log(formData);
  };

  const editInput = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <View style={styles.container}>
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
            setFormData={setFormData}
            editInput={editInput}
          />
        ))}
        {errorMessage && (
          <>
            {/* <Icon name="warning" size={15} color={'red'} /> */}
            <Text style={styles.errorMessageText}>{errorMessage}</Text>
          </>
        )}
        {successMessage && (
          <>
            {/* <Icon name="check-circle" size={20} color="green" />{' '} */}
            <Text style={styles.successMessageText}>{successMessage}</Text>
          </>
        )}
        <View style={styles.forgetPressable}>
          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forget}>Forget Password?</Text>
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
          <Text style={styles.alreadyText}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signIn}>Sign up</Text>
          </Pressable>
        </View>
        <Button
          text={'Log in'}
          handlePress={() => {
            navigation.navigate('Home');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 5 + '%',
    paddingHorizontal: 3 + '%',
    backgroundColor: '#fff',
  },
  headers: {
    flex: 1,
    gap: 10,
    justifyContent: 'flex-end',
    marginBottom: 50,
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
    // fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  successMessageText: {
    marginLeft: 5,
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
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
    // justifyContent: 'center',
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
