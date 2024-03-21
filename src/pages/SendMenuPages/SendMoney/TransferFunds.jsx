/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import UserIconSVG from '../../../../assets/images/userMenu.svg';
import RegularText from '../../../components/fonts/RegularText';
import FlagSelect from '../../../components/FlagSelect';
import FaIcon from '@expo/vector-icons/FontAwesome';
import Button from '../../../components/Button';
import SelectCurrencyModal from '../../../components/SelectCurrencyModal';
import { AppContext } from '../../../components/AppContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import ErrorMessage from '../../../components/ErrorMessage';
import BackArrow from '../../../../assets/images/backArrowWhite.svg';
import { useWalletContext } from '../../../context/WalletContext';
import { randomUUID } from 'expo-crypto';
import InputPin from '../../../components/InputPin';
import { useBeneficiaryContext } from '../../../context/BeneficiariesContext';
import RecurringSwitch from '../../../components/RecurringSwitch';
import SchedulePayment from '../SchedulePayments/SchedulePayment';
import useFetchData from '../../../../utils/fetchAPI';

const TransferFunds = ({ navigation, route }) => {
  const { postFetchData } = useFetchData();
  const { appData, selectedCurrency, setWalletRefresh } =
    useContext(AppContext);
  const { wallet, setWallet } = useWalletContext();
  const { setRefetchBeneficiary } = useBeneficiaryContext();
  const [userToSendTo] = useState(route.params);
  const [amountInput, setAmountInput] = useState(null);
  const [description, setDescription] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [hasAskedPin, setHasAskedPin] = useState(false);
  const { minimumAmountToAdd } = selectedCurrency;
  const editInput = () => {
    setErrorMessage('');
    setErrorKey('');
  };

  const handleChange = async text => {
    setAmountInput(text);
    editInput();
    if (text > wallet.balance) {
      setErrorKey('amountInput');
      setErrorMessage('Insufficient funds');
    }
  };

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
    if (amountInput < minimumAmountToAdd) {
      setErrorMessage(
        `Minimum transfer amount is ${selectedCurrency.symbol}${minimumAmountToAdd}`,
      );
      setErrorKey('amountInput');
    }
  };

  const handleContinue = async () => {
    if (!amountInput) {
      setErrorMessage('Please provide the amount to be transferred');
      setErrorKey('amountInput');
    } else if (!Number(amountInput)) {
      setErrorMessage('Please provide a valid amount');
      setErrorKey('amountInput');
    } else if (amountInput < minimumAmountToAdd) {
      setErrorMessage(
        `Minimum transfer amount is ${selectedCurrency.symbol}${minimumAmountToAdd}`,
      );
      setErrorKey('amountInput');
    } else if (amountInput > wallet.balance) {
      setErrorKey('amountInput');
      setErrorMessage('Insufficient funds');
    } else {
      setCanContinue(true);
      setHasAskedPin(true);
    }
  };

  const initiateTransfer = async () => {
    try {
      const response = await postFetchData('user/loopay/transfer', {
        ...userToSendTo,
        currency: selectedCurrency.currency,
        amount: amountInput,
        description,
        senderPhoto: appData.photoURL,
        id: randomUUID(),
        scheduleData,
      });
      if (response.status === 200) {
        const balance = response.data.amount;
        setWallet(prev => {
          return { ...prev, balance: prev.balance - Number(balance) };
        });
        if (route.params.saveAsBeneficiary) {
          await postFetchData('user/beneficiary', userToSendTo);
          setRefetchBeneficiary(prev => !prev);
        }
        setWalletRefresh(prev => !prev);
        navigation.replace('Success', {
          userToSendTo,
          amountInput,
          transaction: response.data.transaction,
        });
        return response.status;
      }
      // ToastMessage(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  if (canContinue) {
    return (
      <InputPin
        customFunc={initiateTransfer}
        handleCancel={() => setCanContinue(false)}
      />
    );
  }

  return (
    <>
      <PageContainer paddingTop={0} avoidKeyboardPushup={isRecurring}>
        <View style={styles.backContainer}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backContainer}>
            <BackArrow />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.body}>
          <View style={styles.headerContainer}>
            <BoldText style={styles.header}>Transfer Funds</BoldText>
            <View style={styles.userIconContainer}>
              {userToSendTo.photo ? (
                <Image
                  source={{ uri: userToSendTo.photo }}
                  style={styles.userIconStyle}
                />
              ) : (
                <View style={styles.nonUserIconStyle}>
                  <UserIconSVG width={50} height={50} />
                </View>
              )}
              <View>
                <BoldText style={styles.fullName}>
                  {userToSendTo.fullName}{' '}
                  {userToSendTo.verificationStatus === 'verified' && (
                    <Image
                      source={require('../../../../assets/images/verify.png')}
                      style={styles.verify}
                      resizeMode="contain"
                    />
                  )}
                </BoldText>
                <RegularText style={styles.tagName}>
                  {userToSendTo.tagName || userToSendTo.userName}
                </RegularText>
              </View>
              <View style={styles.modalBorder} />
            </View>
          </View>
          <View style={styles.content}>
            <>
              <View style={styles.form}>
                <View>
                  <BoldText>Amount</BoldText>
                  <View style={styles.textInputContainer}>
                    <Pressable
                      onPress={() => {
                        setModalOpen(true);
                        setErrorKey('');
                        setErrorMessage('');
                      }}
                      style={styles.symbolContainer}>
                      <FlagSelect
                        country={selectedCurrency.currency}
                        style={styles.flag}
                      />
                      <BoldText style={styles.symbol}>
                        {selectedCurrency.acronym}
                      </BoldText>
                      <FaIcon name="chevron-down" color={'#868585'} />
                    </Pressable>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderColor:
                          errorKey === 'amountInput' ? 'red' : '#ccc',
                      }}
                      inputMode="decimal"
                      value={amountInput}
                      onChangeText={text => handleChange(text)}
                      onBlur={handleBlur}
                    />
                  </View>
                </View>
                <View>
                  <BoldText>Description</BoldText>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        ...styles.descTextInput,
                        borderColor: errorKey === 'desc' ? 'red' : '#ccc',
                      }}
                      inputMode="text"
                      onChangeText={text => {
                        setDescription(text);
                        editInput();
                      }}
                      value={description}
                      maxLength={40}
                      placeholder="optional"
                    />
                  </View>
                </View>
                <ErrorMessage errorMessage={errorMessage} />
              </View>

              <View style={styles.recurringContainer}>
                <RecurringSwitch
                  isRecurring={isRecurring}
                  setIsRecurring={setIsRecurring}
                  scheduleData={scheduleData}
                  setScheduleData={setScheduleData}
                  setHasAskedPin={setHasAskedPin}
                  type="loopay"
                />
              </View>
              <Button
                text={'Continue'}
                style={styles.button}
                onPress={handleContinue}
              />
            </>
          </View>
        </ScrollView>
      </PageContainer>
      {scheduleData && !hasAskedPin && (
        <SchedulePayment
          isRecurring={isRecurring}
          setIsRecurring={setIsRecurring}
          scheduleData={scheduleData}
          setScheduleData={setScheduleData}
          type="loopay"
        />
      )}
      <SelectCurrencyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingLeft: 2 + '%',
    width: 100 + '%',
    paddingVertical: 5,
  },
  backText: {
    fontFamily: 'OpenSans-600',
    color: '#fff',
    fontSize: 18,
  },
  headerContainer: {
    paddingHorizontal: 5 + '%',
    backgroundColor: '#1e1e1e',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 30,
  },
  header: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff',
  },
  userIconContainer: {
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  userIconStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#979797',
  },
  nonUserIconStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(160, 160, 160, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullName: {
    color: '#fff',
  },
  verify: {
    width: 15,
    height: 15,
  },
  tagName: {
    textAlign: 'center',
    marginTop: 5,
    color: '#fff',
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  content: {
    paddingHorizontal: 5 + '%',
    paddingBottom: 40,
  },
  form: {
    gap: 30,
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 10,
  },
  flag: { width: 20, height: 20 },
  textInput: {
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-700',
    fontSize: 20,
    paddingLeft: 100,
    paddingRight: 15,
    paddingVertical: 10,
    borderWidth: 1,
  },
  descTextInput: {
    paddingLeft: 15,
    fontFamily: 'OpenSans-500',
    fontSize: 14,
  },
  symbolContainer: {
    position: 'absolute',
    zIndex: 9,
    left: 5,
    borderRightWidth: 1,
    borderRightColor: '#868585',
    paddingRight: 5,
    height: 100 + '%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  symbol: {
    color: '#000',
    fontSize: 12,
  },
  feeTextInputContainer: {
    position: 'relative',
    marginBottom: 40,
    marginTop: 10,
  },
  feeTextInput: {
    borderRadius: 15,
    backgroundColor: '#eee',
    height: 55,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingLeft: 50,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  toReceive: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  feeSymbol: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 9,
    top: 15,
    left: 15,
    color: '#525252',
  },
  fee: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#1E1E1E',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  feeText: {
    color: '#f9f9f9',
    fontSize: 13,
  },

  recurringContainer: {
    marginVertical: 20,
  },
  button: {
    marginBottom: 50,
  },
  footer: {
    marginTop: 50,
  },
});
export default TransferFunds;
