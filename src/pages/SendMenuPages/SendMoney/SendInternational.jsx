/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import Back from '../../../components/Back';
import AccInfoCard from '../../../components/AccInfoCard';
import BoldText from '../../../components/fonts/BoldText';
import FlagSelect from '../../../components/FlagSelect';
import { AppContext } from '../../../components/AppContext';
import { CurrencyFullDetails } from '../../../../utils/allCountries';
import RegularText from '../../../components/fonts/RegularText';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import { addingDecimal } from '../../../../utils/AddingZero';
import SelectCurrencyModal from '../../../components/SelectCurrencyModal';
import IonIcon from '@expo/vector-icons/Ionicons';
import FaIcon from '@expo/vector-icons/FontAwesome';
import useFetchData from '../../../../utils/fetchAPI';
import Button from '../../../components/Button';
import ErrorMessage from '../../../components/ErrorMessage';
import InputPin from '../../../components/InputPin';
import ToastMessage from '../../../components/ToastMessage';
import { useWalletContext } from '../../../context/WalletContext';
import { randomUUID } from 'expo-crypto';

const SendInternational = ({ navigation }) => {
  const { getFetchData, postFetchData } = useFetchData();
  const { selectedCurrency, setWalletRefresh, setIsLoading } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    sendTo: '',
    toReceiveAmount: '',
    fee: '',
    receiverName: '',
    receiverAccountNo: '',
    receiverBank: '',
  });
  const [openSendFromModal, setOpenSendFromModal] = useState(false);
  const [openSendToModal, setOpenToModal] = useState(false);
  const [rate, setRate] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const getRates = async () => {
      try {
        setIsLoading(true);
        const response = await getFetchData(
          `user/rate/${selectedCurrency.acronym}`,
        );
        if (response.status === 200) {
          setRate(response.data[formData.sendTo.code]);
          formData.amount &&
            setFormData(prev => {
              return {
                ...prev,
                toReceiveAmount: Number(
                  (
                    formData.amount * response.data[formData.sendTo.code]
                  ).toFixed(2),
                ),
              };
            });
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    if (formData.sendTo) {
      getRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.sendTo, selectedCurrency.acronym, setIsLoading]);

  const handleAmountInput = text => {
    if (!formData.amount && text === '.') {
      return setFormData(prev => {
        return {
          ...prev,
          amount: '',
          toReceiveAmount: '',
        };
      });
    } else if (
      formData.amount.includes('.') &&
      text.endsWith('.') &&
      text.slice(0, text.length - 1).includes('.')
    ) {
      return;
    }
    if (text > wallet.balance) {
      setErrorMessage('Insufficient funds');
      setErrorKey('amount');
      return setFormData(prev => {
        return {
          ...prev,
          amount: text,
          toReceiveAmount: '',
        };
      });
    } else {
      setErrorMessage('');
      setErrorKey('');
    }
    setFormData(prev => {
      return {
        ...prev,
        amount: text,
        toReceiveAmount: Number((text * rate).toFixed(2)),
        fee: Number((0.035 * text).toFixed(2)),
      };
    });
  };

  const handleStep1 = () => {
    if (formData.amount > wallet.balance) {
      setErrorKey('amount');
      setErrorMessage('Insufficient funds');
      setFormData(prev => {
        return {
          ...prev,
          toReceiveAmount: '',
        };
      });
    } else if (!rate) {
      setErrorMessage('Network error');
    } else if (!formData.amount) {
      setErrorKey('amount');
      setErrorMessage('Please input amount to send');
    } else if (formData.toReceiveAmount < 1) {
      setErrorKey('amount');
      setErrorMessage(
        `Amount too low, minimum amount is ${selectedCurrency.symbol}${(1 / rate).toFixed(2)}`,
      );
    } else {
      setStep(2);
      setErrorMessage('');
    }
  };

  const handleStep2 = () => {
    if (!formData.receiverName) {
      setErrorKey('receiverName');
    } else if (!formData.receiverAccountNo) {
      setErrorKey('receiverAccountNo');
    } else if (!formData.receiverBank) {
      setErrorKey('receiverBank');
    } else {
      setStep(3);
      setErrorKey('');
    }
  };

  const transactionDetails = [
    {
      title: 'Transaction Fee',
      value: selectedCurrency.symbol + (formData.fee || '0.00'),
    },
    {
      title: 'Pay From',
      value: `${selectedCurrency.acronym} Balance`,
    },
    {
      title: 'Rate',
      value: (
        <>
          1 {selectedCurrency.acronym} = {rate} {formData.sendTo.code}
        </>
      ),
    },
    {
      title: 'Receiver Bank',
      value: `${formData.receiverBank}`,
    },
    {
      title: 'Receiver Account',
      value: `${formData.receiverAccountNo}`,
    },
    { title: 'Receiver Full name', value: `${formData.receiverName}` },
  ];

  if (step === 4) {
    const handleSend = async () => {
      try {
        setIsLoading(true);
        formData.sendFrom = CurrencyFullDetails[selectedCurrency.acronym];
        formData.sendFromCurrency = selectedCurrency.currency;
        formData.id = randomUUID();
        if (!formData.sendFrom) {
          return setErrorMessage('Currency not currently supported');
        }
        formData.rate = {
          from: selectedCurrency.acronym,
          to: formData.sendTo.code,
          rate,
        };
        const response = await postFetchData(
          'user/transfer/international',
          formData,
        );
        if (response.status === 200) {
          navigation.replace('Success', {
            amountInput: formData.amount,
            rate: {
              from: selectedCurrency.acronym,
              to: formData.sendTo.code,
              rate,
            },
            fee: formData.fee,
            id: formData.id,
            transaction: response.data.transaction,
          });
          return setWalletRefresh(prev => !prev);
        }
        throw new Error(response.data);
      } catch (error) {
        ToastMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <InputPin
        customFunc={() => handleSend()}
        handleCancel={() => setStep(prev => prev - 1)}
      />
    );
  }

  return (
    <>
      <Back
        onPress={() =>
          step === 2 ? setStep(prev => prev - 1) : navigation.goBack()
        }
      />

      <PageContainer padding paddingTop={10} scroll>
        <AccInfoCard />
        <BoldText>Send International</BoldText>
        {openSendToModal && (
          <CurrenciesModal
            setOpenToModal={setOpenToModal}
            setFormData={setFormData}
          />
        )}
        {step === 1 && (
          <View style={styles.form}>
            <View>
              <RegularText style={styles.label}>You send</RegularText>
              <View style={styles.textInputContainer}>
                <Pressable
                  style={styles.textInputSymbolContainer}
                  onPress={() => setOpenSendFromModal(true)}>
                  <FlagSelect
                    country={selectedCurrency.currency}
                    style={styles.flag}
                  />
                  <BoldText style={styles.textInputSymbol}>
                    {selectedCurrency.acronym}
                  </BoldText>
                  <ChevronDown />
                </Pressable>
                <TextInput
                  style={{
                    ...styles.textInput,
                    paddingLeft: 90,
                    borderColor: errorKey === 'amount' ? 'red' : '#ccc',
                  }}
                  inputMode="decimal"
                  value={formData.amount}
                  onChangeText={text => handleAmountInput(text)}
                  onBlur={() =>
                    formData.amount &&
                    setFormData(prev => {
                      return {
                        ...prev,
                        amount: addingDecimal(prev.amount),
                      };
                    })
                  }
                />
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 5 + '%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: -10,
                marginBottom: 20,
                columnGap: 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 15,
                }}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      backgroundColor: '#000',
                      width: 1,
                      height: 20,
                    }}
                  />
                  <View>
                    <FaIcon name="arrow-circle-o-down" size={18} />
                  </View>
                  <View
                    style={{
                      backgroundColor: '#000',
                      width: 1,
                      height: 30,
                    }}
                  />
                  <View style={{ marginTop: -2 }}>
                    <IonIcon name="time-outline" size={18} />
                    {/* <ActivityIndicator color={'#1e1e1e'} /> */}
                  </View>
                  <View
                    style={{
                      backgroundColor: '#000',
                      width: 1,
                      height: 30,
                    }}
                  />
                  <View>
                    <FaIcon name="arrow-circle-o-right" size={18} />
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      width: 1,
                      height: 20,
                    }}
                  />
                  <RegularText>Fee</RegularText>
                  <View
                    style={{
                      width: 1,
                      height: 31.5,
                    }}
                  />
                  <RegularText>Total to pay</RegularText>
                  <View
                    style={{
                      width: 1,
                      height: 31.5,
                    }}
                  />
                  <RegularText>Rate</RegularText>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <View
                  style={{
                    width: 1,
                    height: 20,
                  }}
                />
                <View>
                  <BoldText>
                    {`${addingDecimal(Number(formData.fee).toLocaleString())} ${selectedCurrency.acronym}`}
                  </BoldText>
                </View>
                <View
                  style={{
                    width: 1,
                    height: 31.5,
                  }}
                />
                <View>
                  <BoldText>
                    {addingDecimal(Number(formData.amount).toLocaleString())}{' '}
                    {selectedCurrency.acronym}
                  </BoldText>
                </View>
                <View
                  style={{
                    width: 1,
                    height: 31.5,
                  }}
                />
                <View>
                  {rate ? (
                    <BoldText>
                      1 {selectedCurrency.acronym} = {rate}{' '}
                      {formData.sendTo.code}
                    </BoldText>
                  ) : (
                    <BoldText>
                      1 {selectedCurrency.acronym} = {formData.sendTo.code}
                    </BoldText>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.textInputContainer}>
              <RegularText style={styles.label}>Receiver Gets</RegularText>
              <View style={styles.textInputContainer}>
                {formData.sendTo ? (
                  <View style={styles.textInput}>
                    <BoldText>
                      {formData.sendTo.symbol}
                      {'  '}
                      {addingDecimal(
                        Number(formData.toReceiveAmount).toLocaleString(),
                      )}
                    </BoldText>
                    <Pressable
                      style={styles.textInputRow}
                      onPress={() => setOpenToModal(true)}>
                      <Image
                        source={{
                          uri: `https://flagcdn.com/w160/${formData.sendTo.code.slice(0, 2).toLowerCase()}.png`,
                        }}
                        width={20}
                        height={20}
                        style={{ borderRadius: 30, marginRight: -5 }}
                        resizeMode="stretch"
                      />
                      <BoldText>{formData.sendTo.code}</BoldText>
                      <ChevronDown />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={styles.textInput}
                    onPress={() => setOpenToModal(true)}>
                    <RegularText>Select currency to send to</RegularText>
                    <ChevronDown />
                  </Pressable>
                )}
              </View>
            </View>
            <ErrorMessage errorMessage={errorMessage} />
            <View style={styles.button}>
              <Button
                text={'Go to Receiver details'}
                onPress={handleStep1}
                disabled={!formData.amount || !formData.sendTo}
              />
            </View>
          </View>
        )}
        {step === 2 && (
          <View style={styles.receiverForm}>
            <View style={styles.receiverTextInputContainer}>
              <RegularText style={styles.label}>
                Receiver Account Name
              </RegularText>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorKey === 'receiverName' ? 'red' : '#ccc',
                }}
                value={formData.receiverName}
                onChangeText={text => {
                  setErrorKey('');
                  setErrorMessage('');
                  setFormData(prev => {
                    return {
                      ...prev,
                      receiverName: text,
                    };
                  });
                }}
              />
            </View>
            <View style={styles.receiverTextInputContainer}>
              <RegularText style={styles.label}>
                Receiver Account No
              </RegularText>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor:
                    errorKey === 'receiverAccountNo' ? 'red' : '#ccc',
                }}
                inputMode="decimal"
                value={formData.receiverAccountNo}
                onChangeText={text => {
                  setErrorKey('');
                  setErrorMessage('');
                  setFormData(prev => {
                    return {
                      ...prev,
                      receiverAccountNo: text,
                    };
                  });
                }}
                maxLength={10}
              />
            </View>
            <View style={styles.receiverTextInputContainer}>
              <RegularText style={styles.label}>Receiver Bank Name</RegularText>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorKey === 'receiverBank' ? 'red' : '#ccc',
                }}
                value={formData.receiverBank}
                onChangeText={text => {
                  setErrorKey('');
                  setErrorMessage('');
                  setFormData(prev => {
                    return {
                      ...prev,
                      receiverBank: text,
                    };
                  });
                }}
              />
            </View>
            <ErrorMessage errorMessage={errorMessage} />
            <View style={styles.button}>
              <Button
                text={'Continue to Pay'}
                onPress={handleStep2}
                disabled={
                  !formData.receiverName ||
                  !formData.receiverAccountNo ||
                  !formData.receiverBank
                }
              />
            </View>
          </View>
        )}
        {step === 3 && (
          <Modal
            visible={step === 3}
            animationType="none"
            transparent
            onRequestClose={() => setStep(prev => prev - 1)}>
            <Pressable
              style={styles.overlay}
              onPress={() => setStep(prev => prev - 1)}
            />
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <View style={styles.modalBorder} />
                <BoldText style={styles.modalTextHeader}>
                  Confirm Details
                </BoldText>
                <View style={styles.modalContent}>
                  <View style={styles.swapModal}>
                    <FlagSelect
                      country={selectedCurrency.currency}
                      style={styles.modalFlag}
                    />
                    <RegularText>From</RegularText>
                    <BoldText>
                      {`${addingDecimal(Number(formData.amount).toLocaleString())} ${selectedCurrency.acronym}`}
                    </BoldText>
                  </View>
                  <View style={styles.modalIcon}>
                    <IonIcon
                      name="arrow-forward-sharp"
                      size={50}
                      color={'#5c5c5c'}
                    />
                  </View>
                  <View style={styles.swapModal}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w160/${formData.sendTo.code.slice(0, 2).toLowerCase()}.png`,
                      }}
                      width={40}
                      height={40}
                      style={{
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#dcdcdc',
                        ...styles.modalFlag,
                      }}
                      resizeMode="stretch"
                    />
                    <RegularText>Receive</RegularText>
                    <BoldText>
                      {`${formData.toReceiveAmount?.toLocaleString()} ${formData.sendTo.code}`}
                    </BoldText>
                  </View>
                </View>
                <View style={styles.card}>
                  {transactionDetails.map(detail => (
                    <View style={styles.cardRow} key={detail.title}>
                      <RegularText style={styles.cardKey}>
                        {detail.title}
                      </RegularText>
                      <RegularText style={styles.cardValue}>
                        {detail.value}
                      </RegularText>
                    </View>
                  ))}
                </View>
                <Button
                  text="Pay Now"
                  onPress={() => setStep(prev => prev + 1)}
                  style={styles.modalButton}
                />

                <Pressable onPress={() => setStep(prev => prev - 1)}>
                  <BoldText>Back</BoldText>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        <SelectCurrencyModal
          modalOpen={openSendFromModal}
          setModalOpen={setOpenSendFromModal}
        />
      </PageContainer>
    </>
  );
};

export default SendInternational;

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
    flex: 1,
  },
  textInputContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  label: {
    color: '#868585',
    fontFamily: 'OpenSans-400',
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 10,
    backgroundColor: '#dcdcdc',
    padding: 8,
    borderRadius: 10,
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
  button: {
    marginVertical: 50,
  },
  currencies: {
    paddingHorizontal: 3 + '%',
    // marginBottom: 700,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  receiverForm: {
    rowGap: 20,
    marginVertical: 20,
  },
  receiverTextInputContainer: {
    rowGap: 10,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    height: 70 + '%',
    minHeight: 500,
    maxHeight: 100 + '%',
    width: 100 + '%',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingVertical: 30,
    paddingHorizontal: 5 + '%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    alignItems: 'center',
    gap: 20,
  },
  modalContainerSuccess: {
    position: 'absolute',
    height: 100 + '%',
    width: 100 + '%',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalSuccess: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingVertical: 30,
    paddingHorizontal: 5 + '%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  modalTextHeader: {
    fontSize: 18,
  },
  modalContent: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    width: 80 + '%',
    maxHeight: 250,
  },
  swapModal: {
    alignItems: 'center',
    gap: 10,
  },
  modalFlag: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  modalIcon: {
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#E4E2E2',
    width: 100 + '%',
    padding: 5 + '%',
    gap: 25,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'space-around',
    // maxHeight: 150,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardKey: {
    color: '#525252',
    fontSize: 16,
  },
  cardValue: {
    color: '#525252',
    fontSize: 16,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  modalButton: {
    marginTop: 2 + '%',
  },
  searchTextInputContainer: {
    paddingHorizontal: 3 + '%',
    marginBottom: 10,
  },
  searchTextInput: {
    borderWidth: 1,
    borderColor: '#E2F3F5',
    marginTop: 10,
    borderRadius: 5,
    height: 35,
    fontFamily: 'OpenSans-400',
    paddingLeft: 10,
  },
});

const CurrenciesModal = ({ setOpenToModal, setFormData }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currencies, setCurrencies] = useState(
    Object.values(CurrencyFullDetails),
  );
  const allCurrencies = Object.values(CurrencyFullDetails);

  const handleCurrencySelect = currencySelect => {
    setFormData(prev => {
      return {
        ...prev,
        sendTo: currencySelect,
      };
    });
    setOpenToModal(false);
  };

  const handleSearch = text => {
    const matchedCurrencies = allCurrencies.filter(data =>
      Object.values(data).toString().toLowerCase().includes(text.toLowerCase()),
    );
    setCurrencies(matchedCurrencies);
  };

  return (
    <Modal
      onRequestClose={() => setOpenToModal(false)}
      style={styles.currencyModal}>
      <Back onPress={() => setOpenToModal(false)} />
      <View style={styles.searchTextInputContainer}>
        <TextInput
          style={{
            ...styles.searchTextInput,
          }}
          placeholder={isSearchFocused ? '' : 'Search'}
          placeholderTextColor={'#ccc'}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onChangeText={text => handleSearch(text)}
        />
      </View>
      <ScrollView contentContainerStyle={styles.currencies}>
        {currencies.map(currency => (
          <Pressable
            key={currency.code}
            style={styles.currency}
            onPress={() => handleCurrencySelect(currency)}>
            <View style={styles.icon}>
              <Image
                source={{
                  uri: `https://flagcdn.com/w160/${currency.code.slice(0, 2).toLowerCase()}.png`,
                }}
                width={40}
                height={40}
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#dcdcdc',
                }}
                resizeMode="stretch"
              />
            </View>
            <View>
              <BoldText>{currency.code}</BoldText>
              <RegularText>{currency.name}</RegularText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Modal>
  );
};
