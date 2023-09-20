import React, { useContext, useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import RegularText from '../../components/fonts/RegularText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { postFetchData } from '../../../utils/fetchAPI';
import UserIcon from '../../components/UserIcon';
import { AppContext } from '../../components/AppContext';
import ForgotPassword from '../Auth/ForgotPassword';
import ChangePassword from '../MenuPages/ChangePassword';
import BoldText from '../../components/fonts/BoldText';

const LockScreen = () => {
  const { vw, vh, isSessionTimedOut, setIsSessionTimedOut } =
    useContext(AppContext);
  const [inputCode, setInputCode] = useState('');
  const [hasForgot, setHasForgot] = useState(false);
  const [canChange, setCanChange] = useState(false);
  const [switchIcon, setSwitchIcon] = useState(true);
  const [errorCode, setErrorCode] = useState(false);
  const codeLength = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    setTimeout(() => {
      setSwitchIcon(prev => !prev);
    }, 2500);
  }, [switchIcon]);

  const handleInput = async input => {
    setInputCode(prev => `${prev}${input}`);
    if (inputCode.length + 1 >= codeLength.length) {
      try {
        const response = await postFetchData('auth/check-password', {
          password: `${inputCode}${input}`,
        });
        if (response.status === 200) {
          return setIsSessionTimedOut(false);
        } else {
          setErrorCode(true);
          setTimeout(() => {
            setInputCode('');
            setErrorCode(false);
          }, 500);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <Modal visible={isSessionTimedOut} animationType="fade">
      {hasForgot ? (
        canChange ? (
          <ChangePassword skipCheck />
        ) : (
          <ForgotPassword setCanChange={setCanChange} />
        )
      ) : (
        <View style={styles.container}>
          {switchIcon ? (
            <UserIcon style={styles.icon} />
          ) : (
            <Image
              style={styles.logo}
              source={require('../../../assets/icon.png')}
              resizeMode="contain"
            />
          )}
          <RegularText>Enter Password</RegularText>
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
          <View style={styles.digits}>
            <View style={styles.row}>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('1')}>
                <RegularText style={styles.digitText}>1</RegularText>
              </Pressable>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('2')}>
                <RegularText style={styles.digitText}>2</RegularText>
              </Pressable>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('3')}>
                <RegularText style={styles.digitText}>3</RegularText>
              </Pressable>
            </View>
            <View style={styles.row}>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('4')}>
                <RegularText style={styles.digitText}>4</RegularText>
              </Pressable>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('5')}>
                <RegularText style={styles.digitText}>5</RegularText>
              </Pressable>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('6')}>
                <RegularText style={styles.digitText}>6</RegularText>
              </Pressable>
            </View>
            <View style={styles.row}>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('7')}>
                <RegularText style={styles.digitText}>7</RegularText>
              </Pressable>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('8')}>
                <RegularText style={styles.digitText}>8</RegularText>
              </Pressable>
              <Pressable
                disabled={inputCode.length >= codeLength.length}
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => handleInput('9')}>
                <RegularText style={styles.digitText}>9</RegularText>
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
                <RegularText style={styles.digitText}>0</RegularText>
              </Pressable>
              <Pressable
                style={{ ...styles.digit, width: vw * 0.2, height: vh * 0.08 }}
                onPress={() => setInputCode(prev => prev.slice(0, -1))}>
                <FaIcon name="close" />
              </Pressable>
            </View>
          </View>
          <Pressable onPress={() => setHasForgot(true)}>
            <BoldText>Forgot Password?</BoldText>
          </Pressable>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  },
  digitText: {
    fontSize: 32,
    fontWeight: 700,
  },
});
export default LockScreen;
