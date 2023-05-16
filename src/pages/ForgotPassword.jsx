import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { signInData } from '../../utils/data';
import Header from '../components/Header';
import Email from '../../assets/images/mail.svg';
import Apple from '../../assets/images/apple.svg';
import Google from '../../assets/images/google.svg';

const ForgotPassword = ({ navigation }) => {
  const [codeSent, setCodeSent] = useState(false);
  const [focusIndex, setFocusIndex] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const handlePress = () => {
    console.log(formData);
    setCodeSent(true);
  };

  const handleCofirm = () => {
    navigation.navigate('Home');
  };

  const codeLengths = [1, 2, 3, 4];

  return (
    <View style={styles.container}>
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
                  setOtpCode={setOtpCode}
                  otpCode={otpCode}
                />
              ))}
            </View>
            <View>
              <Text style={styles.enterCodeText}>
                Enter the Four Digit code sent to your email
              </Text>
            </View>
            <Button
              text={'Confirm One time password'}
              handlePress={handleCofirm}
            />
          </>
        ) : (
          <>
            {signInData.slice(0, 1).map(item => (
              <Form item={item} setFormData={setFormData} key={item.name} />
            ))}
            <Button text={'Send One time password'} handlePress={handlePress} />
          </>
        )}
      </View>
      {!codeSent ? (
        <View style={styles.alreadyContainer}>
          <View style={styles.already}>
            <Text style={styles.alreadyText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.signIn}>Sign in</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 5 + '%',
    paddingHorizontal: 3 + '%',
    backgroundColor: '#fff',
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
  form: { flex: 1, paddingVertical: 30 },
  codeInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 50,
    textAlign: 'center',
    fontSize: 35,
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
    // fontFamily: 'Poppins-Regular',
  },
  enterCodeText: {
    color: '#7A7A7A',
    marginTop: 20,
    textAlign: 'center',
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

const Form = ({ item, setFormData }) => {
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <View style={styles.textInputContainer}>
      <View style={styles.icon}>
        <Email fill={inputFocus ? '#000' : '#868585'} />
      </View>
      <TextInput
        style={{
          ...styles.textInput,
          borderColor: inputFocus ? '#000' : '#B1B1B1',
        }}
        placeholder={item.placeholder}
        placeholderTextColor={inputFocus ? '#000' : '#80808080'}
        onChangeText={text => {
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

export const OTPInput = ({
  codeLength,
  focusIndex,
  setFocusIndex,
  setOtpCode,
  otpCode,
}) => {
  const inputRef = useRef();
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (codeLength === focusIndex) {
      inputRef.current.focus();
      setFocused(true);
    }
  }, [focusIndex, codeLength]);
  return (
    <TextInput
      style={styles.codeInput}
      inputMode="numeric"
      maxLength={1}
      autoFocus={focused}
      ref={inputRef}
      onChangeText={text => {
        setOtpCode(prev => `${prev}${text}`);
        setFocusIndex(prev => prev + 1);
      }}
      onFocus={() => setFocusIndex(codeLength)}
    />
  );
};
