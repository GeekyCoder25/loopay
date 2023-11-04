/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppContext } from '../../components/AppContext';
import Button from '../../components/Button';
import BoldText from '../../components/fonts/BoldText';
import FlagSelect from '../../components/FlagSelect';
import RegularText from '../../components/fonts/RegularText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { addingDecimal } from '../../../utils/AddingZero';
import ErrorMessage from '../../components/ErrorMessage';
import { useWalletContext } from '../../context/WalletContext';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import FooterCard from '../../components/FooterCard';
import { randomUUID } from 'expo-crypto';
import { useFocusEffect } from '@react-navigation/native';
import ToastMessage from '../../components/ToastMessage';
import AccInfoCard from '../../components/AccInfoCard';
import InputPin from '../../components/InputPin';

const Withdraw = ({ navigation }) => {
  const { appData, vh, selectedCurrency, setWalletRefresh } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const [bankSelected, setBankSelected] = useState(null);
  const [amountInput, setAmountInput] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [addedBanks, setAddedBanks] = useState([]);
  const [fee, setFee] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      getFetchData('user/savedbanks').then(response => {
        if (response.status === 200) {
          return setAddedBanks(
            response.data.filter(
              bank =>
                bank.currency === selectedCurrency.currency ||
                bank.currency === selectedCurrency.acronym,
            ),
          );
        }
      });
    }, [selectedCurrency]),
  );

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
    if (amountInput < selectedCurrency.minimumAmountToAdd) {
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
    }
  };

  const initiateWithdrawal = async () => {
    try {
      const id = randomUUID();
      const response = await postFetchData('user/transfer', {
        ...bankSelected,
        reason: 'Withdrawal to local NGN account',
        amount: amountInput,
        senderPhoto: appData.photoURL,
        id,
      });
      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        return navigation.replace('Success', {
          userToSendTo: bankSelected,
          amountInput,
          fee,
          id,
        });
      }
      typeof response === 'string'
        ? ToastMessage(response)
        : ToastMessage(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getFetchData('user/fees').then(response =>
      setFee(
        response.data.find(
          i =>
            i.group === 'transferOthers' &&
            i.currency === selectedCurrency.currency,
        ).amount,
      ),
    );
  }, [selectedCurrency.currency]);

  return (
    <PageContainer scroll>
      <View style={{ ...styles.container, minHeight: vh * 0.75 }}>
        <AccInfoCard disableSwitchCurrency={bankSelected} />
        {!canContinue && (
          <RegularText style={styles.headerText}>
            In cases of insufficient fund, you have to swap to{' '}
            {selectedCurrency.acronym} before placing withdrawal.
          </RegularText>
        )}
        {!bankSelected ? (
          <>
            <BoldText style={styles.paymentHeader}>Payment Bank</BoldText>
            <View>
              {addedBanks.length ? (
                addedBanks.map(bank => (
                  <Pressable
                    key={bank.accNo + bank.bankName}
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
            <View style={styles.button}>
              <Button text="Withdraw" onPress={handleWithdraw} />
            </View>
          </View>
        ) : (
          <InputPin
            buttonText={'Confirm'}
            customFunc={() => initiateWithdrawal()}
            style={styles.inputPin}>
            <ErrorMessage errorMessage={errorMessage} />
            <View style={styles.footer}>
              <FooterCard
                userToSendTo={bankSelected}
                amountInput={amountInput}
                fee={fee}
              />
            </View>
          </InputPin>
        )}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
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
  currencyType: {
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
    flex: 1,
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
  noBank: { minHeight: 200, justifyContent: 'center', alignItems: 'center' },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    marginTop: 50,
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
  },
  inputPin: { flex: 1 },
});

export default Withdraw;
