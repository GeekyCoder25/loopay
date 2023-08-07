import { useContext, useEffect, useState } from 'react';
import AccInfoCard from '../../../components/AccInfoCard';
import PageContainer from '../../../components/PageContainer';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Clipboard,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import RegularText from '../../../components/fonts/RegularText';
import BoldText from '../../../components/fonts/BoldText';
import Paste from '../../../../assets/images/paste.svg';
import Button from '../../../components/Button';
import UserIconSVG from '../../../../assets/images/userMenu.svg';
import SwitchOn from '../../../../assets/images/switch.svg';
import SwitchOff from '../../../../assets/images/switchOff.svg';
import { postFetchData } from '../../../../utils/fetchAPI';
import { AppContext } from '../../../components/AppContext';
import { useBenefifciaryContext } from '../../../../context/BenefiaciariesContext';

const SendNew = ({ navigation, route }) => {
  const { appData } = useContext(AppContext);
  const { beneficiaryState } = useBenefifciaryContext();
  const [showPaste, setShowPaste] = useState(false);
  const [inputValue, setinputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(true);
  const [userFound, setUserFound] = useState(null);
  const [newBeneficiary, setNewBeneficiary] = useState(true);

  useEffect(() => {
    const getClipboard = async () => {
      const copiedText = await Clipboard.getString();
      //   copiedText.includes('#') &&
      setShowPaste(copiedText);
    };

    if (route.params) {
      setinputValue(route.params.tagName);
      setUserFound(route.params);
      const beneficiariesTagName = beneficiaryState?.map(
        beneficiary => beneficiary.tagName,
      );
      if (route.params.tagName && beneficiariesTagName) {
        if (beneficiariesTagName.includes(route.params.tagName)) {
          setNewBeneficiary(false);
          setSaveAsBeneficiary(true);
        }
      }
    }
    getClipboard();
  }, [beneficiaryState, route.params]);

  const handlePaste = async () => {
    setinputValue(showPaste);
  };

  const handleChange = async text => {
    try {
      setinputValue(text);
      if (text.length === 10) {
        setIsSearching(true);
        const { phoneNumber } = appData.userProfile;
        const result = await postFetchData(`user/get-phone/${phoneNumber}`, {
          phoneNumber: text,
        });
        if (result.status === 200) {
          // const beneficiariesTagName = beneficiaryState?.map(
          //   beneficiary => beneficiary.tagName || beneficiary.userName,
          // );
          // if (beneficiariesTagName) {
          //   beneficiariesTagName.includes(
          //     result.data.tagName || result.data.userName,
          //   )
          //     ? setNewBeneficiary(false)
          //     : setNewBeneficiary(true);
          // }
          return setUserFound(result.data);
        }
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleContinue = async () => {
    // Make Api Request with Paystack
    // if (saveAsBeneficiary) {
    //   const response = await postFetchData('user/beneficiary', userFound);
    // }
    navigation.navigate('TransferFunds', userFound);
  };

  return (
    <PageContainer paddingTop={0}>
      <ScrollView style={styles.body}>
        <View style={styles.top}>
          <AccInfoCard />
          <RegularText style={styles.header}>Send to new recipient</RegularText>
          <View style={styles.textInputContainer}>
            <View style={styles.symbolContainer}>
              <BoldText style={styles.symbol}>Acc No:</BoldText>
            </View>
            <TextInput
              style={styles.textInput}
              inputMode="text"
              onChangeText={text => handleChange(text)}
              value={inputValue}
              placeholder="9073002599"
              placeholderTextColor={'#525252'}
              maxLength={10}
            />
            <Pressable onPress={handlePaste} style={styles.paste}>
              <RegularText style={styles.pasteText}>Paste</RegularText>
              <Paste />
            </Pressable>
          </View>
        </View>
        {isSearching && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#1E1E1E" />
          </View>
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
                  <UserIconSVG width={25} height={25} />
                </View>
              )}
              <View style={styles.userFoundDetails}>
                <BoldText>{userFound.fullName}</BoldText>
                <BoldText>{userFound.tagName || userFound.userName}</BoldText>
              </View>
            </View>
            {/* {newBeneficiary && (
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
            )} */}
          </View>
        )}
        {/* <Paystack
          paystackKey={'pk_test_06a8106b8d1d1200d5a4e49dac462e614a3cce42'}
          amount={100}
          billingEmail={appData.email}
          activityIndicatorColor="green"
          onCancel={e => {
            // handle response here
            console.log(e);
          }}
          onSuccess={res => {
            console.log(res);
          }}
          autoStart={true}
        /> */}
        <Button
          text={'Continue'}
          disabled={!userFound}
          onPress={handleContinue}
          style={{
            ...styles.button,
            backgroundColor: userFound ? '#1E1E1E' : 'rgba(30, 30, 30, 0.7)',
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
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingLeft: 85,
    paddingRight: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  symbolContainer: {
    position: 'absolute',
    zIndex: 9,
    left: 10,
    borderRightWidth: 1,
    borderRightColor: '#868585',
    paddingRight: 5,
    height: 100 + '%',
    justifyContent: 'center',
  },
  symbol: {
    color: '#000',
    fontSize: 16,
  },
  paste: {
    position: 'absolute',
    top: 12,
    right: 15,
    backgroundColor: '#006E53',
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
  },
  userFoundDetails: {
    gap: 5,
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

export default SendNew;
