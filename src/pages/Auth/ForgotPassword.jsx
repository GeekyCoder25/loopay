import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { signInData } from '../../../utils/data';
import Header from '../../components/Header';
import Email from '../../../assets/images/mail.svg';
import Apple from '../../../assets/images/apple.svg';
import Google from '../../../assets/images/google.svg';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';

const ForgotPassword = ({ navigation }) => {
  const [codeSent, setCodeSent] = useState(false);
  const [focusIndex, setFocusIndex] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [isPinOkay, setIsPinOkay] = useState(false);
  const handlePress = () => {
    console.log(formData);
    setCodeSent(true);
  };

  useEffect(() => {
    setIsPinOkay(otpCode.length === 4);
  }, [otpCode.length]);
  const handleCofirm = () => {
    isPinOkay
      ? navigation.navigate('BottomTabs')
      : console.log(Number(otpCode));
  };

  const codeLengths = [1, 2, 3, 4];
  return (
    <PageContainer padding={true} justify={true}>
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
                    otpCode={otpCode}
                    setOtpCode={setOtpCode}
                  />
                ))}
              </View>
              <View>
                <RegularText style={styles.enterCodeText}>
                  Enter the Four Digit code sent to your email
                </RegularText>
              </View>
              <Button
                text={'Confirm One time password'}
                handlePress={handleCofirm}
                disabled={!isPinOkay}
              />
            </>
          ) : (
            <>
              {signInData.slice(0, 1).map(item => (
                <Form item={item} setFormData={setFormData} key={item.name} />
              ))}
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

const OTPInput = ({
  codeLength,
  focusIndex,
  setFocusIndex,
  otpCode,
  setOtpCode,
}) => {
  const inputRef = useRef();
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    if (codeLength === focusIndex) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      inputRef.current.clear();
      setInputValue('');
      setFocused(true);
    }
  }, [focusIndex, codeLength]);
  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key !== 'Backspace') {
      focusIndex < 4
        ? setFocusIndex(prev => prev + 1)
        : inputRef.current.blur();
    } else {
      setOtpCode(prev => prev.slice(0, otpCode.length - 1));
      inputValue === ''
        ? focusIndex > 1 && setFocusIndex(prev => prev - 1)
        : inputRef.current.clear();
    }
  };
  return (
    <TextInput
      style={styles.codeInput}
      value={inputValue}
      inputMode="numeric"
      maxLength={1}
      autoFocus={focused}
      ref={inputRef}
      onChangeText={text => {
        setInputValue(text);
        setOtpCode(prev => `${prev}${text}`);
      }}
      onKeyPress={handleKeyPress}
      onFocus={() => setFocusIndex(codeLength)}
    />
  );
};
