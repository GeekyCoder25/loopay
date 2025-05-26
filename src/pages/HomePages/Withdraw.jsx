/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppContext } from '../../components/AppContext';
import Button from '../../components/Button';
import BoldText from '../../components/fonts/BoldText';
import FlagSelect from '../../components/FlagSelect';
import RegularText from '../../components/fonts/RegularText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { addingDecimal } from '../../../utils/AddingZero';
import ErrorMessage from '../../components/ErrorMessage';
import { useWalletContext } from '../../context/WalletContext';
import { randomUUID } from 'expo-crypto';
import { useFocusEffect } from '@react-navigation/native';
import AccInfoCard from '../../components/AccInfoCard';
import InputPin from '../../components/InputPin';
import { AddBankFields, BanksModal } from './AddWithdraw';
import ChevronDown from '../../../assets/images/chevron-down.svg';
import useFetchData from '../../../utils/fetchAPI';

const Withdraw = ({ navigation }) => {
  const { getFetchData, postFetchData } = useFetchData();
  const { appData, vh, selectedCurrency, setWalletRefresh } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const [bankSelected, setBankSelected] = useState(null);
  const [banks, setBanks] = useState([]);
  const [noBanks, setNoBanks] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amountInput, setAmountInput] = useState(null);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [addedBanks, setAddedBanks] = useState([]);
  const [fee, setFee] = useState(0);
  const [recipientData, setRecipientData] = useState(null);
  const [formData, setFormData] = useState({
    accNo: '',
    bank: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      getFetchData(
        `user/saved/bank?limit=${3}&currency=${selectedCurrency.currency},${selectedCurrency.acronym}`,
      ).then(response => {
        if (response.status === 200) {
          return setAddedBanks(response.data);
        } else {
          setAddedBanks([]);
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCurrency]),
  );

  useEffect(() => {
    getFetchData(`user/banks?currency=${selectedCurrency.acronym}`).then(
      response => {
        if (response.status === 200) {
          setNoBanks(false);
          return setBanks(response.data);
        }
        setNoBanks(response.data);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banks.length, selectedCurrency.acronym, showBankModal]);

  useEffect(() => {
    if (!Object.values(formData).includes('') && formData.accNo.length === 10) {
      handleConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    getFetchData('user/fees').then(response =>
      response.status === 200
        ? setFee(
            response.data.find(
              i =>
                i.group === 'transferOthers' &&
                i.currency === selectedCurrency.currency,
            )?.amount,
          )
        : setFee(0),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency.currency]);

  const formFields = [
    {
      label: 'Bank account Number',
      id: 'accNo',
      keyboard: 'numeric',
    },
  ];

  const handleConfirm = async () => {
    setFullName('');
    if (formData.accNo === '') {
      setErrorMessage('Please provide you bank account number');
      return setErrorKey('accNo');
    } else if (!formData.bank) {
      setErrorMessage('Please select a bank');
      return setErrorKey('bank');
    }
    try {
      setIsLoading(true);
      const response = await postFetchData('user/check-recipient', formData);
      if (response.status === 200) {
        setFullName(response.data.name);
        setRecipientData(response.data);
      } else {
        throw new Error(response.data);
      }
    } catch (err) {
      setErrorMessage(err.message);
      setFullName('');
    } finally {
      setIsLoading(false);
    }
  };
  const handleContinue = async () => {
    if (formData.accNo === '') {
      setErrorMessage('Please provide you bank account number');
      return setErrorKey('accNo');
    } else if (!formData.bank) {
      setErrorMessage('Please select a bank');
      return setErrorKey('bank');
    }
    setBankSelected(recipientData);
  };

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
    if (amountInput < selectedCurrency.minimumAmountToAdd) {
      setErrorMessage(
        `Minimum transfer amount is ${selectedCurrency.symbol}${selectedCurrency.minimumAmountToAdd}`,
      );
      setErrorKey('amountInput');
    }
  };

  const editInput = () => {
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
      setCanContinue(true);
    }
  };

  const initiateWithdrawal = async () => {
    try {
      const id = randomUUID();
      const response = await postFetchData('user/transfer', {
        ...bankSelected,
        reason: description,
        amount: amountInput,
        fee,
        senderPhoto: appData.photoURL,
        id,
      });
      if (response.status === 200) {
        const { transaction } = response.data;
        await postFetchData('user/saved/bank', formData);
        navigation.replace('Success', {
          userToSendTo: bankSelected,
          amountInput,
          fee,
          id,
          transaction,
        });
        setWalletRefresh(prev => !prev);
        return response.status;
      }
      typeof response === 'string'
        ? setErrorMessage(response)
        : setErrorMessage(response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  if (bankSelected && canContinue) {
    return (
      <InputPin
        customFunc={() => initiateWithdrawal()}
        handleCancel={() => setCanContinue(false)}
      />
    );
  }

  return (
    <PageContainer scroll>
      <View style={{ ...styles.container, minHeight: vh * 0.75 }}>
        <AccInfoCard disableSwitchCurrency={bankSelected} />
        <RegularText style={styles.headerText}>
          In cases of insufficient fund, you have to swap to{' '}
          {selectedCurrency.acronym} before placing withdrawal.
        </RegularText>
        {!bankSelected ? (
          <View>
            <View style={styles.form}>
              {formFields.map(field => (
                <AddBankFields
                  key={field.id}
                  field={field}
                  errorKey={errorKey}
                  setErrorKey={setErrorKey}
                  setErrorMessage={setErrorMessage}
                  setFormData={setFormData}
                  formData={formData}
                />
              ))}
              <BoldText>Bank Name</BoldText>
              <Pressable
                style={styles.textInputContainer}
                onPress={() => setShowBankModal(true)}>
                <View
                  style={{
                    ...styles.bankInput,
                    borderColor: errorKey === 'bank' ? 'red' : '#B1B1B1',
                  }}>
                  <BoldText>{selectedBank?.name || 'Choose bank'}</BoldText>
                  <ChevronDown />
                </View>
              </Pressable>
              <BanksModal
                modalOpen={showBankModal}
                setModalOpen={setShowBankModal}
                banks={banks}
                setSelectedBank={setSelectedBank}
                setFormData={setFormData}
                setErrorKey={setErrorKey}
                setErrorMessage={setErrorMessage}
                noBanks={noBanks}
              />
              {!isLoading ? (
                fullName && (
                  <BoldText style={styles.name}>
                    <FaIcon name="check-circle" size={20} color="green" />
                    {'  '}
                    {fullName}
                  </BoldText>
                )
              ) : (
                <BoldText style={styles.name}>
                  <ActivityIndicator
                    color={'green'}
                    style={{ alignItems: 'flex-start' }}
                  />
                </BoldText>
              )}
              <ErrorMessage errorMessage={errorMessage} />
            </View>
            {!fullName && (
              <View style={styles.recent}>
                <BoldText style={styles.headerText}>Recent</BoldText>
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
                      <BoldText>No recent banks will show here</BoldText>
                    </View>
                  )}
                </View>
              </View>
            )}
            <View style={styles.button}>
              <Button
                text={'Continue'}
                onPress={recipientData ? handleContinue : handleConfirm}
              />
            </View>
          </View>
        ) : (
          !canContinue && (
            <View style={styles.form}>
              <View>
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
                    inputMode="decimal"
                    value={amountInput}
                    onChangeText={text => {
                      setAmountInput(text);
                      editInput();
                    }}
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
                    placeholder="Sent from Loopay"
                  />
                </View>
              </View>
              <ErrorMessage errorMessage={errorMessage} />
              {/* <View style={styles.feeTextInputContainer}>
                <View style={styles.feeTextInput}>
                  <RegularText>Send money to other banks</RegularText>
                </View>
                <View style={styles.fee}>
                  <RegularText style={styles.feeText}>
                    Service Charge
                  </RegularText>
                  <RegularText style={styles.feeText}>
                    {selectedCurrency.symbol}
                    {addingDecimal(`${fee}`)}
                  </RegularText>
                </View>
              </View> */}
              <View style={styles.button}>
                <Button text="Send" onPress={handleWithdraw} />
              </View>
            </View>
          )
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
  recent: {
    marginVertical: 30,
  },
  bankInput: {
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bank: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#BBBBBB',
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginTop: 15,
  },
  bankDetails: {
    gap: 3,
  },
  bankName: {
    marginBottom: 3,
    fontSize: 16,
  },
  name: {
    color: 'green',
    marginVertical: 20,
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
    color: '#000000',
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
});

export default Withdraw;
