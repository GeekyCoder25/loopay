/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import AccInfoCard from '../../../components/AccInfoCard';
import PageContainer from '../../../components/PageContainer';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import RegularText from '../../../components/fonts/RegularText';
import BoldText from '../../../components/fonts/BoldText';
import Paste from '../../../../assets/images/paste.svg';
import Button from '../../../components/Button';
import UserIconSVG from '../../../../assets/images/userMenu.svg';
import SwitchOn from '../../../../assets/images/switch.svg';
import SwitchOff from '../../../../assets/images/switchOff.svg';
import { tagNameRules } from '../../../database/data';
import { AppContext } from '../../../components/AppContext';
import { useBeneficiaryContext } from '../../../context/BeneficiariesContext';
import FaIcon from '@expo/vector-icons/FontAwesome';
import IonIcon from '@expo/vector-icons/Ionicons';
import ErrorMessage from '../../../components/ErrorMessage';
import useFetchData from '../../../../utils/fetchAPI';

const SendLoopay = ({ navigation, route }) => {
  const { postFetchData } = useFetchData();
  const { appData } = useContext(AppContext);
  const { beneficiaryState } = useBeneficiaryContext();
  const [showPaste, setShowPaste] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);
  const [userFound, setUserFound] = useState(null);
  const [newBeneficiary, setNewBeneficiary] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const { minimum, maximum } = tagNameRules;

  useEffect(() => {
    const getClipboard = async () => {
      const copiedText = await Clipboard.getStringAsync();
      // copiedText.includes('#') &&
      setShowPaste(copiedText);
    };
    getClipboard();
    // if (route.params) {
    //   setInputValue(route.params.tagName);
    //   setUserFound(route.params);
    //   const beneficiariesTagName = beneficiaryState?.map(
    //     beneficiary => beneficiary.tagName,
    //   );
    //   if (route.params.tagName && beneficiariesTagName) {
    //     if (beneficiariesTagName.includes(route.params.tagName)) {
    //       setNewBeneficiary(false);
    //       setSaveAsBeneficiary(true);
    //     }
    //   }
    // }
  }, []);
  // console  .log(route.params);

  const handlePaste = async () => {
    const copiedText = await Clipboard.getString();
    setInputValue(copiedText);
    handleCheck(copiedText);
  };

  const handleCheck = async () => {
    setErrorMessage('');
    setUserSelected(false);
    if (inputValue.length >= minimum && inputValue.length <= maximum) {
      setIsSearching(true);
      const senderTagName = appData.tagName;
      try {
        const result = await postFetchData(`user/get-tag/${senderTagName}`, {
          tagName: inputValue,
        });
        if (result.status === 200) {
          const beneficiariesTagName = beneficiaryState?.map(
            beneficiary => beneficiary.tagName,
          );
          if (beneficiariesTagName) {
            beneficiariesTagName.includes(result.data.tagName)
              ? setNewBeneficiary(false)
              : setNewBeneficiary(true);
          }
          return setUserFound(result.data);
        }
        setErrorMessage(result.data);
      } finally {
        setIsSearching(false);
      }
      setUserFound(null);
      return setUserSelected(null);
    } else {
      setUserFound(null);
      return setUserSelected(null);
    }
  };

  const handleContinue = async () => {
    const params = { saveAsBeneficiary, ...userFound };
    if (route.params?.schedule) {
      params.schedule = route.params?.schedule;
    }
    navigation.navigate('TransferFunds', params);
  };

  return (
    <PageContainer paddingTop={0} avoidKeyboardPushup>
      <ScrollView style={styles.body}>
        <View style={styles.top}>
          <AccInfoCard />
          <RegularText style={styles.header}>Send to Loopay</RegularText>
          <View style={styles.textInputContainer}>
            <View style={styles.symbolContainer}>
              <BoldText style={styles.symbol}>To:</BoldText>
            </View>
            <TextInput
              style={styles.textInput}
              inputMode="text"
              onChangeText={text => setInputValue(text)}
              onBlur={handleCheck}
              value={inputValue}
              placeholder="#username or account no"
              placeholderTextColor={'#525252'}
              maxLength={maximum}
              autoFocus
            />
            {showPaste && !inputValue ? (
              <Pressable onPress={handlePaste} style={styles.paste}>
                <Paste />
              </Pressable>
            ) : (
              <Pressable onPress={handleCheck} style={styles.paste}>
                <RegularText style={styles.pasteText}>Check</RegularText>
                <FaIcon name="check-circle" color="#fff" />
              </Pressable>
            )}
          </View>
        </View>
        {isSearching && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#1E1E1E" />
          </View>
        )}
        {errorMessage && (
          <ErrorMessage errorMessage={errorMessage} style={styles.error} />
        )}
        {!isSearching && userFound && (
          <View style={styles.userFoundContainer}>
            <RegularText style={styles.top}>Result</RegularText>
            <View style={styles.userFound}>
              {userFound.photo ? (
                <Image
                  source={{ uri: userFound.photo }}
                  style={styles.userIconStyle}
                />
              ) : (
                <View style={styles.nonUserIconStyle}>
                  <UserIconSVG width={60} height={60} />
                </View>
              )}
              <View style={styles.userFoundDetails}>
                <View style={styles.verifyContainer}>
                  <BoldText>{userFound.fullName} </BoldText>
                  {userFound.verificationStatus === 'verified' && (
                    <Image
                      source={require('../../../../assets/images/verify.png')}
                      style={styles.verify}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <BoldText>{userFound.tagName}</BoldText>
              </View>

              <Pressable
                style={styles.selected}
                onPress={() => setUserSelected(prev => !prev)}>
                {userSelected ? (
                  <IonIcon name="radio-button-on-outline" size={24} />
                ) : (
                  <IonIcon name="radio-button-off-outline" size={24} />
                )}
              </Pressable>
            </View>
            {newBeneficiary && (
              <View style={styles.beneficiary}>
                <RegularText style={styles.save}>
                  Save as beneficiary
                </RegularText>
                <Pressable onPress={() => setSaveAsBeneficiary(prev => !prev)}>
                  {saveAsBeneficiary ? (
                    <SwitchOn width={40} height={40} />
                  ) : (
                    <SwitchOff width={40} height={40} />
                  )}
                </Pressable>
              </View>
            )}
          </View>
        )}
        <Button
          text={'Continue'}
          disabled={!userSelected || !userFound}
          onPress={handleContinue}
          style={{
            ...styles.button,
            backgroundColor:
              userSelected && userFound ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
          }}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  top: { paddingHorizontal: 4 + '%' },
  textInputContainer: {
    position: 'relative',
    marginTop: 10,
  },
  textInput: {
    color: '#000000',
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingLeft: 65,
    paddingRight: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  symbolContainer: {
    position: 'absolute',
    zIndex: 9,
    left: 15,
    borderRightWidth: 1,
    borderRightColor: '#868585',
    paddingRight: 10,
    height: 100 + '%',
    justifyContent: 'center',
  },
  symbol: {
    color: '#000',
    fontSize: 18,
  },
  paste: {
    position: 'absolute',
    top: 12,
    right: 15,
    backgroundColor: '#000',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
  },
  pasteText: {
    color: '#fff',
    fontSize: 14,
  },
  loader: {
    alignItems: 'flex-start',
    padding: 5 + '%',
    marginTop: 10,
  },
  error: {
    marginTop: 10,
    marginBottom: 0,
  },
  userFoundContainer: {
    marginTop: 30,
  },
  userFound: {
    marginVertical: 20,
    backgroundColor: '#EEEEEE',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  userIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#979797',
  },
  nonUserIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(160, 160, 160, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  userFoundDetails: {
    gap: 5,
  },
  verifyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verify: {
    width: 15,
    height: 15,
  },
  selected: {
    flex: 1,
    alignItems: 'flex-end',
  },
  beneficiary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4 + '%',
  },
  save: {
    fontFamily: 'OpenSans-600',
    fontSize: 15,
  },
  button: {
    marginTop: 50,
    marginBottom: 50,
  },
});
export default SendLoopay;
