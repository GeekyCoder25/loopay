/* eslint-disable react-native/no-inline-styles */
import { Pressable, StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';
import Logo from '../../components/Logo';
import { useContext, useState } from 'react';
import { AppContext } from '../../components/AppContext';
import { TextInput } from 'react-native-gesture-handler';
import Eye from '../../../assets/images/eye.svg';
import Button from '../../components/Button';
import BoldText from '../../components/fonts/BoldText';
import { postFetchData } from '../../../utils/fetchAPI';
import LoggedInForgetPassword from '../../components/LoggedInForgetPassword';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import CheckPassword from '../../components/CheckPassword';

const ChangePassword = ({ navigation }) => {
  const { vh, appData, setIsLoading } = useContext(AppContext);
  const [remembersPassword, setRemembersPassword] = useState(true);

  const [newFormData, setNewFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errorKey, setErrorKey] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passowrdIsValid, setPassowrdIsValid] = useState(false);
  const { email } = appData;

  const editInput = () => {
    setErrorMessage('');
    setErrorKey(false);
  };

  const passwordFormData = [
    {
      title: 'Enter new password',
      name: 'password',
    },
    {
      title: 'Confirm new password',
      name: 'confirmPassword',
    },
  ];

  const handleChange = async () => {
    try {
      setIsLoading(true);
      if (Object.values(newFormData).includes('')) {
        setErrorMessage('Please input all reuired fields');
        return setErrorKey(true);
      } else if (newFormData.password !== newFormData.confirmPassword) {
        setErrorKey(true);
        return setErrorMessage("Passwords aren't the same");
      }

      const fetchResult = await postFetchData(
        `auth/change-password/${email}`,
        newFormData,
      );
      const { data: result } = fetchResult;

      if (result?.password?.includes('successfully')) {
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
        return setSuccessMessage(result.password);
      }
      setErrorMessage(result.error || result);
      setErrorKey(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer padding={true} justify={true}>
      <View style={styles.container}>
        <View style={{ ...styles.container, minHeight: vh }}>
          <View style={styles.logo}>
            <Logo />
          </View>
          {!passowrdIsValid ? (
            remembersPassword ? (
              <CheckPassword
                setPassowrdIsValid={setPassowrdIsValid}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                setRemembersPassword={setRemembersPassword}
              />
            ) : (
              <LoggedInForgetPassword setPassowrdIsValid={setPassowrdIsValid} />
            )
          ) : (
            <View style={styles.form}>
              {passwordFormData.map(inputForm => (
                <FormField
                  key={inputForm.name}
                  inputForm={inputForm}
                  errorKey={errorKey}
                  setFormData={setNewFormData}
                  editInput={editInput}
                />
              ))}
              <ErrorMessage errorMessage={errorMessage} />
              <SuccessMessage successMessage={successMessage} />
              <Button text={'Change Password'} handlePress={handleChange} />
            </View>
          )}
          <View style={{ flex: 1 }} />
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
    flex: 1.5,
    paddingVertical: 30,
    minHeight: 150,
  },
  textInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  textInputContainer2: {
    position: 'relative',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 30,
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
  textInput2: {
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 10,
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
  eye2: {
    height: 100 + '%',
    position: 'absolute',
    right: 0,
    paddingHorizontal: 15,
    zIndex: 9,
    justifyContent: 'center',
  },
  forgetPressable: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forget: {
    fontWeight: '600',
  },
});

export default ChangePassword;

export const FormField = ({ inputForm, errorKey, setFormData, editInput }) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <>
      <BoldText>{inputForm.title}</BoldText>
      <View style={styles.textInputContainer2}>
        <TextInput
          style={{
            ...styles.textInput2,
            borderColor: errorKey ? 'red' : inputFocus ? '#000' : '#B1B1B1',
          }}
          onChangeText={text => {
            editInput();
            setFormData(prev => {
              return { ...prev, [inputForm.name]: text };
            });
          }}
          name={'password'}
          inputMode={'text'}
          autoCapitalize="none"
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          secureTextEntry={hidePassword}
        />
        <Pressable
          style={styles.eye2}
          onPress={() => setHidePassword(prev => !prev)}>
          <Eye />
        </Pressable>
      </View>
    </>
  );
};
