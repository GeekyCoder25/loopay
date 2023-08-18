/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { AppContext } from '../../components/AppContext';
import Button from '../../components/Button';
import BoldText from '../../components/fonts/BoldText';
import WalletAmount from '../../components/WalletAmount';
import FlagSelect from '../../components/FlagSelect';
import RegularText from '../../components/fonts/RegularText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { addingDecimal } from '../../../utils/AddingZero';
import ErrorMessage from '../../components/ErrorMessage';
import { useWalletContext } from '../../context/WalletContext';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import FooterCard from '../../components/FooterCard';
import { PINInputFields } from '../../components/InputPinPage';
import NoPInSet from '../../components/NoPinSet';
import { randomUUID } from 'expo-crypto';
import { useFocusEffect } from '@react-navigation/native';

const Withdraw = ({ navigation }) => {
  const { appData, vh, selectedCurrency, setIsLoading } =
    useContext(AppContext);
  const { wallet, setWallet } = useWalletContext();
  const [bankSelected, setBankSelected] = useState(null);
  const [amountInput, setAmountInput] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [haveSetPin] = useState(appData.pin);
  const [canContinue, setCanContinue] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [reload, setReload] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(60);
  const [otpResend, setOtpResend] = useState(otpTimeout);
  const [focusIndex, setFocusIndex] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [formData] = useState({
    email: appData.email,
    otpCodeLength: 6,
  });
  const [addedBanks, setAddedBanks] = useState([]);

  const codeLengths = [1, 2, 3, 4];

  useFocusEffect(
    React.useCallback(() => {
      getFetchData('user/savedbanks').then(response => {
        if (response.status === 200) {
          return setAddedBanks(response.data);
        }
      });
    }, []),
  );

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
    if (amountInput < 100) {
      setErrorMessage(
        `Minimum transfer amount is ${selectedCurrency.symbol}${selectedCurrency.minimumAmountToAdd}`,
      );
      setErrorKey('amountInput');
    }
  };

  const handleChange = async text => {
    setAmountInput(text);
    setErrorMessage('');
    setErrorKey('');
  };

  const handleWithdraw = async () => {
    if (!amountInput) {
      setErrorMessage('Please provide the amount to be transferred');
      setErrorKey('amountInput');
    } else if (!Number(amountInput)) {
      setErrorMessage('Please provide a valid amount');
      setErrorKey('amountInput');
    } else if (amountInput < 100) {
      setErrorMessage(
        `Minimum transfer amount is ${selectedCurrency.symbol}${selectedCurrency.minimumAmountToAdd}`,
      );
      setErrorKey('amountInput');
    } else if (amountInput > wallet.balance) {
      setErrorKey('amountInput');
      setErrorMessage('Insufficient funds');
    } else {
      setAmountInput(prev => `${Number(prev) + Number(fee)}`);
      setCanContinue(true);
      if (!haveSetPin) {
        await postFetchData('auth/forget-password', formData);
      }
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (haveSetPin) {
        const result = await postFetchData('user/check-pin', { pin: pinCode });
        if (result === "Couldn't connect to server") {
          return setErrorMessage(result);
        }
        if (result.status === 200) {
          return await initiateWithdrawal();
        }
        setErrorMessage(result.data);
        setErrorKey('pinCode');
      } else {
        const result = await postFetchData(
          `auth/confirm-otp/${otpCode || 'fake'}`,
          formData,
        );
        if (result === "Couldn't connect to server") {
          return setErrorMessage(result);
        }
        if (result.status === 200) {
          return await initiateWithdrawal();
        }
        setErrorMessage('Incorrect OTP Code');
        setErrorKey('otpCode');
      }
      setTimeout(() => {
        setPinCode('');
        setOtpCode('');
        setReload(prev => !prev);
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };
  const initiateWithdrawal = async () => {
    try {
      const response = await postFetchData('user/transfer', {
        ...bankSelected,
        reason: 'Withdrawal to local NGN account',
        amount: amountInput,
        senderPhoto: appData.photoURL,
        id: randomUUID(),
      });
      if (response.status === 200) {
        const balance = response.data.amount;
        setWallet(prev => {
          //   return { ...prev, balance: prev.balance - Number(balance) };
          return { ...prev, balance: prev.balance - balance };
        });
        return navigation.replace('Success', {
          userToSendTo: bankSelected,
          amountInput,
          fee,
        });
      }
      typeof response === 'string'
        ? ToastAndroid.show(response, ToastAndroid.SHORT)
        : ToastAndroid.show(response.data, ToastAndroid.SHORT);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fee = addingDecimal(`${50.25}`);
  return (
    <PageContainer>
      <ScrollView style={{ paddingHorizontal: 5 + '%' }}>
        <View style={{ ...styles.container, minHeight: vh * 0.75 }}>
          <ImageBackground
            source={require('../../../assets/images/cardBg.png')}
            resizeMode="cover"
            style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.amountContainer}>
                <View style={styles.symbolContainer}>
                  <Text style={styles.symbol}>{selectedCurrency.symbol}</Text>
                </View>
                <View>
                  <WalletAmount />
                  <View style={styles.flagContainer}>
                    <RegularText style={styles.currrencyType}>
                      {selectedCurrency.currency}
                    </RegularText>
                    <FlagSelect country={selectedCurrency.currency} />
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
          {!canContinue && (
            <RegularText style={styles.headerText}>
              In cases of insufficient fund, make to have swap to NGN before
              placing withrawal.
            </RegularText>
          )}
          {!bankSelected ? (
            <>
              <BoldText style={styles.paymentHeader}>Payment Bank</BoldText>
              <View>
                {addedBanks.length ? (
                  addedBanks.map(bank => (
                    <Pressable
                      key={bank.accNo}
                      style={styles.bank}
                      onPress={() => setBankSelected(bank)}>
                      <View style={styles.bankDetails}>
                        <RegularText style={styles.bankName}>
                          {bank.name}
                        </RegularText>
                        <BoldText>{bank.accNo}</BoldText>
                        <RegularText>{bank.bankName}</RegularText>
                      </View>
                      <FaIcon name="chevron-right" size={18} />
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.noBank}>
                    <BoldText>No payment bank has been added yet</BoldText>
                  </View>
                )}
              </View>
              <View style={styles.button}>
                <Button
                  text="Add new Payment Bank"
                  onPress={() => navigation.navigate('AddWithdraw')}
                />
              </View>
            </>
          ) : !canContinue ? (
            <View>
              <View style={styles.form}>
                <BoldText>Amount</BoldText>
                <View style={styles.textInputContainer}>
                  <View style={styles.textInputSymbolContainer}>
                    <FlagSelect
                      country={selectedCurrency.currency}
                      style={styles.flag}
                    />
                    <BoldText style={styles.textInputSymbol}>
                      {selectedCurrency.acronym}
                    </BoldText>
                  </View>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: errorKey === 'amountInput' ? 'red' : '#ccc',
                    }}
                    inputMode="numeric"
                    value={amountInput}
                    onChangeText={text => handleChange(text)}
                    onBlur={handleBlur}
                  />
                </View>
                <ErrorMessage errorMessage={errorMessage} />
                <View style={styles.feeTextInputContainer}>
                  <View style={styles.feeTextInput}>
                    <RegularText>Loopay Withdrawal</RegularText>
                  </View>
                  <View style={styles.fee}>
                    <RegularText style={styles.feeText}>
                      Service Charged
                    </RegularText>
                    <RegularText style={styles.feeText}>
                      {selectedCurrency.symbol}
                      {fee}
                    </RegularText>
                  </View>
                </View>
              </View>
              <View style={styles.button}>
                <Button text="Withdraw" onPress={handleWithdraw} />
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.pinContainer} key={reload}>
                {haveSetPin ? (
                  <>
                    <RegularText>Enter your transaction pin</RegularText>
                    <View style={styles.changePinCodeLengthsContainer}>
                      {codeLengths.map(input => (
                        <PINInputFields
                          key={input}
                          codeLength={input}
                          focusIndex={focusIndex}
                          setFocusIndex={setFocusIndex}
                          pinCode={pinCode}
                          setPinCode={setPinCode}
                          setErrorMessage={setErrorMessage}
                          errorKey={errorKey}
                          setErrorKey={setErrorKey}
                          codeLengths={codeLengths.length}
                        />
                      ))}
                    </View>
                  </>
                ) : (
                  <NoPInSet
                    otpCode={otpCode}
                    setOtpCode={setOtpCode}
                    setErrorMessage={setErrorMessage}
                    errorKey={errorKey}
                    setErrorKey={setErrorKey}
                    otpResend={otpResend}
                    setOtpResend={setOtpResend}
                    otpTimeout={otpTimeout}
                    setOtpTimeout={setOtpTimeout}
                    formData={formData}
                  />
                )}
              </View>
              <ErrorMessage errorMessage={errorMessage} />
              <View style={styles.footer}>
                <FooterCard
                  userToSendTo={bankSelected}
                  amountInput={`${Number(amountInput).toLocaleString()}${
                    Number(amountInput).toLocaleString().includes('.')
                      ? ''
                      : '.00'
                  }`}
                  fee={fee}
                />
                <View style={styles.button}>
                  <Button text={'Confirm'} onPress={handleConfirm} />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000',
    height: 120,
    width: 100 + '%',
    marginBottom: 30,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  symbolContainer: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 28,
    fontFamily: 'AlfaSlabOne-Regular',
    transform: [{ translateY: -4 }],
  },
  amount: {
    color: '#ccc',
    fontSize: 40,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currrencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
  },
  headerText: {
    color: '#868585',
  },
  paymentHeader: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  bank: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#BBBBBB',
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginTop: 25,
  },
  bankDetails: {
    gap: 3,
  },
  bankName: {
    marginBottom: 3,
    fontSize: 16,
  },
  form: {
    marginTop: 30,
  },
  textInputContainer: {
    position: 'relative',
    marginVertical: 10,
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
    paddingLeft: 80,
    paddingRight: 15,
    paddingVertical: 10,
    borderWidth: 1,
  },
  descTextInput: {
    paddingLeft: 15,
    fontFamily: 'OpenSans-500',
    fontSize: 14,
  },
  textInputSymbolContainer: {
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
  textInputSymbol: {
    color: '#000',
    fontSize: 12,
  },
  feeTextInputContainer: {
    marginVertical: 40,
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
    paddingLeft: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
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
  noBank: { minHeight: 250, justifyContent: 'center', alignItems: 'center' },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePinCodeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
  footer: {
    marginTop: 50,
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
});

export default Withdraw;
