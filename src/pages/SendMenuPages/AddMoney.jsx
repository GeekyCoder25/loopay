/* eslint-disable react-native/no-inline-styles */
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../components/AppContext';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import { allCurrencies } from '../../database/data';
import Back from '../../components/Back';
import FlagSelect from '../../components/FlagSelect';
import { useWalletContext } from '../../context/WalletContext';
import ToastMessage from '../../components/ToastMessage';
import { addingDecimal } from '../../../utils/AddingZero';
import BankIcon from '../../../assets/images/bank.svg';
import CardIcon from '../../../assets/images/card.svg';
import Button from '../../components/Button';
import EmptyCheckbox from '../../../assets/images/emptyCheckbox.svg';
import FilledCheckbox from '../../../assets/images/filledCheckbox.svg';
import ErrorMessage from '../../components/ErrorMessage';
import { setShowBalance } from '../../../utils/storage';
import * as Haptics from 'expo-haptics';
import useFetchData from '../../../utils/fetchAPI';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';

const AddMoney = ({ navigation }) => {
  const { getFetchData, postFetchData } = useFetchData();
  const {
    selectedCurrency,
    setSelectedCurrency,
    walletRefresh,
    showAmount,
    setShowAmount,
    setIsLoading,
  } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [errorKey, setErrorKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bankTransfer');
  const [toReceive, setToReceive] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [fee, setFee] = useState(0);
  const [savedCards, setSavedCards] = useState([]);
  const [addBalanceData, setAddBalanceData] = useState({
    toCharge: 0,
    paymentMethod,
    symbol: selectedCurrency.symbol,
  });
  const { minimumAmountToAdd } = selectedCurrency;

  useEffect(() => {
    const getCard = async () => {
      const response = await getFetchData(
        `user/debit-card/${selectedCurrency.currency}`,
      );
      if (response.status === 200) {
        setSavedCards(response.data);
      }
    };
    getCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency.currency, walletRefresh]);

  const paymentMethods = [
    {
      label: 'Pay with Bank',
      icon: 'bank',
      method: 'bankTransfer',
      fullTitle: 'Bank Transfer',
    },
    {
      label: 'Pay with Card',
      icon: 'card',
      method: 'card',
      fullTitle: 'Debit Card',
    },
    {
      label: 'Pay with USSD',
      icon: 'ussd',
      method: 'ussd',
      fullTitle: 'USSD',
    },
  ];

  if (Platform.OS === 'ios') {
    paymentMethods.push({
      label: 'Pay with Apple Pay',
      icon: 'apple',
      method: 'apple',
      fullTitle: 'Apple Pay',
    });
  }
  const handleCurrencyChange = newSelect => {
    setErrorKey('');
    setErrorMessage('');
    setSelectedCurrency(newSelect);
  };

  const handleModal = () => {
    setModalOpen(prev => !prev);
  };

  const handlePaymentMethod = method => {
    setPaymentMethod(method.method);
    setPaymentModal(false);
    setAddBalanceData(prev => {
      return {
        ...prev,
        paymentMethod: method.method,
        fullTitle: method.fullTitle,
      };
    });
  };

  const handleCopy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Clipboard.setStringAsync(wallet.accNo);
    ToastMessage('Account number copied');
  };

  const checkPaymentMethod = () => {
    switch (paymentMethod) {
      case 'bankTransfer':
        return 'Pay via Bank Transfer';
      case 'card':
        return 'Pay via Debit Card';
      case 'ussd':
        return 'Pay via USSD';
      case 'apple':
        return 'Pay via Apple Pay';

      default:
        break;
    }
  };
  const selectIcon = iconName => {
    switch (iconName) {
      case 'bank':
        return <BankIcon />;
      case 'card':
        return <CardIcon />;
      case 'ussd':
        return <FontAwesome name="hashtag" color={'#525252'} size={40} />;
      case 'apple':
        return <FontAwesome name="apple" color={'#525252'} size={40} />;
    }
  };

  const handlePriceInput = text => {
    const feeRate = 1 / 100;
    setValue(text);
    text = Number(text);
    const transactionFee = text * feeRate;
    setFee(transactionFee.toFixed(2));
    const swapFromAmountAfterFee = text + transactionFee;
    const toReceiveCalculate = Number(swapFromAmountAfterFee.toFixed(2));

    setAddBalanceData(prev => {
      return {
        ...prev,
        amount: text,
        toCharge: toReceiveCalculate,
        fee: transactionFee,
      };
    });
    setToReceive(
      toReceiveCalculate > 0
        ? addingDecimal(toReceiveCalculate.toLocaleString())
        : '',
    );
    setErrorKey(false);
    setErrorMessage(false);
  };

  const handleAutoFill = () => {
    if (value && value < minimumAmountToAdd) {
      setErrorKey('amount');
      setErrorMessage(
        `Minimum amount to add is ${selectedCurrency.symbol}${minimumAmountToAdd}`,
      );
    }
    value && setValue(addingDecimal(value));
  };

  const addSpaceEvery4Characters = inputString => {
    let result = '';
    for (let i = 0; i < inputString?.length; i++) {
      if (i > 0 && i % 4 === 0) {
        result += ' ';
      }
      result += inputString[i];
    }
    return result;
  };

  const handleContinue = () => {
    if (!value) {
      setErrorKey('amount');
      return setErrorMessage('Please provide amount');
    } else if (value && value < minimumAmountToAdd) {
      setErrorKey('amount');
      return setErrorMessage(
        `Minimum amount to add is ${selectedCurrency.symbol}${minimumAmountToAdd}`,
      );
    }
    navigation.navigate('AddMoneyDetails', addBalanceData);
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  const handleAdd = async () => {
    try {
      if (!addBalanceData.toCharge) {
        setErrorMessage('Please input amount');
        return setErrorKey('amount');
      }
      setIsLoading(true);
      const response = await postFetchData(
        `user/add-money/card?currency=${selectedCurrency.acronym}`,
        {
          amount: addBalanceData.toCharge,
          fee: addBalanceData.fee,
        },
      );
      if (response.status === 200) {
        return navigation.navigate('AddMoneyPaystack', response.data?.data);
      }
      throw new Error(response.data?.data || response.data);
    } catch (error) {
      console.log('error', error.message);
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAppleContinue = async () => {
    try {
      if (!addBalanceData.toCharge) {
        setErrorMessage('Please input amount');
        return setErrorKey('amount');
      }
      setIsLoading(true);
      const response = await postFetchData(
        `user/add-money/card?currency=${selectedCurrency.acronym}&apple=true`,
        {
          amount: addBalanceData.toCharge,
          fee: addBalanceData.fee,
        },
      );
      if (response.status === 200) {
        return navigation.navigate('AddMoneyPaystack', response.data?.data);
      }
      throw new Error(response.data?.data || response.data);
    } catch (error) {
      console.log('error', error.message);
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUssdContinue = async () => {
    try {
      if (!addBalanceData.toCharge) {
        setErrorMessage('Please input amount');
        return setErrorKey('amount');
      }
      setIsLoading(true);
      const response = await postFetchData(
        `user/add-money/card?currency=${selectedCurrency.acronym}&ussd=true`,
        {
          amount: addBalanceData.toCharge,
          fee: addBalanceData.fee,
        },
      );
      if (response.status === 200) {
        return navigation.navigate('AddMoneyPaystack', response.data?.data);
      }
      throw new Error(response.data?.data || response.data);
    } catch (error) {
      console.log('error', error.message);
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageContainer paddingTop={10} padding scroll>
        <View style={styles.body}>
          <BoldText style={styles.headerText}>Add Balance</BoldText>
          <>
            <Text style={styles.topUp}>Account to top up</Text>
            <Pressable
              onPress={() => setModalOpen(true)}
              style={styles.textInputContainer}>
              <View style={styles.textInput}>
                <View style={styles.flagContainer}>
                  <FlagSelect country={selectedCurrency.currency} />
                  <RegularText style={styles.currencyName}>
                    {selectedCurrency.currency} Balance
                  </RegularText>
                </View>
                <ChevronDown />
              </View>
            </Pressable>
            <Modal
              visible={modalOpen}
              animationType="slide"
              transparent
              onRequestClose={handleModal}>
              <Back onPress={() => setModalOpen(false)} />
              <View style={styles.modal}>
                <BoldText style={styles.modalHeader}>
                  Select account to top up
                </BoldText>
                {allCurrencies
                  .filter(i => i.currency !== selectedCurrency.currency)
                  .map(select => (
                    <Pressable
                      key={select.currency}
                      style={styles.currency}
                      onPress={() => {
                        handleCurrencyChange(select);
                        setModalOpen(false);
                      }}>
                      <View style={styles.currencyIcon}>
                        <FlagSelect country={select.currency} />
                        <View>
                          <BoldText>{select.acronym}</BoldText>
                          <RegularText style={styles.currencyName}>
                            {select.currency}
                          </RegularText>
                        </View>
                      </View>

                      <Pressable onPress={handleShow}>
                        <BoldText style={styles.amount}>
                          {showAmount
                            ? select.symbol +
                              addingDecimal(
                                wallet[
                                  `${select.currency}Balance`
                                ]?.toLocaleString(),
                              )
                            : '***'}
                        </BoldText>
                      </Pressable>
                    </Pressable>
                  ))}
              </View>
            </Modal>

            <Text style={styles.topUp}>Payment method</Text>
            <Pressable
              onPress={() => setPaymentModal(true)}
              style={styles.textInputContainer}>
              <View style={styles.textInput}>
                <RegularText>{checkPaymentMethod()}</RegularText>
                <ChevronDown />
              </View>
            </Pressable>

            {paymentMethod === 'bankTransfer' && (
              <>
                <View style={styles.copyContainer}>
                  <View>
                    <RegularText style={styles.label}>Bank Name</RegularText>
                    <BoldText style={styles.bankName}>{wallet.bank}</BoldText>
                  </View>
                </View>
                {wallet.accName && (
                  <View style={styles.copyContainer}>
                    <View>
                      <RegularText style={styles.label}>
                        Account Name
                      </RegularText>
                      <BoldText style={styles.accName}>
                        {wallet.accName}
                      </BoldText>
                    </View>
                  </View>
                )}
                <View style={styles.copyContainer}>
                  <View>
                    <RegularText style={styles.label}>
                      Bank Account Number
                    </RegularText>
                    <BoldText style={styles.accNo}>{wallet.accNo}</BoldText>
                  </View>
                  <Pressable style={styles.copy} onPress={handleCopy}>
                    <BoldText style={styles.copyText}>Copy</BoldText>
                  </Pressable>
                </View>
                {selectedCurrency.currency !== 'naira' && (
                  <View>
                    <View style={styles.info}>
                      <FaIcon name="info-circle" color={'#868585'} size={14} />
                      <RegularText style={styles.infoText}>
                        Click on the button below after depositing to the
                        account to upload transaction receipt or teller
                      </RegularText>
                    </View>
                    <Button
                      text="I have sent the money"
                      onPress={() => navigation.navigate('AddMoneyConfirm')}
                    />
                  </View>
                )}
              </>
            )}
            {(paymentMethod === 'card' ||
              paymentMethod === 'ussd' ||
              paymentMethod === 'apple') && (
              <>
                <Text style={styles.topUp}>Amount to be credited</Text>
                <View style={styles.textInputContainer}>
                  <BoldText style={styles.symbol}>
                    {selectedCurrency.symbol}
                  </BoldText>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      ...styles.textInputStyles,
                      borderColor: errorKey === 'amount' ? 'red' : '#ccc',
                    }}
                    inputMode="decimal"
                    onChangeText={text => handlePriceInput(text)}
                    onBlur={handleAutoFill}
                    value={value}
                  />
                  <View style={styles.fee}>
                    <RegularText style={styles.feeText}>
                      Fee: {selectedCurrency.symbol}
                      {fee < 0 ? '0.00' : fee}
                    </RegularText>
                  </View>
                </View>
                {errorMessage && (
                  <ErrorMessage
                    errorMessage={errorMessage}
                    style={styles.errorMessage}
                  />
                )}

                <RegularText style={styles.label}>
                  Amount you’ll be charged
                </RegularText>
                <View style={styles.textInputContainer}>
                  <BoldText style={styles.symbol}>
                    {selectedCurrency.symbol}
                  </BoldText>
                  <View
                    style={{
                      ...styles.textInput,
                      ...styles.textInputStyles,
                    }}>
                    <RegularText
                      style={{ fontSize: styles.textInputStyles.fontSize }}>
                      {toReceive}
                    </RegularText>
                  </View>
                </View>
                {paymentMethod === 'card' && (
                  <>
                    {savedCards.length > 0 && (
                      <View style={styles.savedCards}>
                        <BoldText>
                          Saved card{savedCards.length > 1 && 's'}
                        </BoldText>
                        {savedCards.map(card => (
                          <Pressable
                            key={card.id}
                            style={styles.savedCard}
                            onPress={() =>
                              selectedCard && selectedCard.id === card.id
                                ? setSelectedCard(null)
                                : setSelectedCard(card)
                            }>
                            <View style={styles.savedCardCheck}>
                              {selectedCard?.id === card.id ? (
                                <FilledCheckbox width={30} height={30} />
                              ) : (
                                <EmptyCheckbox width={30} height={30} />
                              )}
                              <View>
                                <BoldText style={styles.boldText}>
                                  {addSpaceEvery4Characters(card.cardNo)}
                                </BoldText>
                                <RegularText style={styles.subText}>
                                  {card.type}
                                </RegularText>
                              </View>
                            </View>
                            <View style={styles.expiry}>
                              <BoldText style={styles.boldText}>
                                {card.expiryMonth + '/' + card.expiryYear}
                              </BoldText>
                              <RegularText style={styles.subText}>
                                ***
                              </RegularText>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    )}
                    {selectedCard ? (
                      <View style={styles.button}>
                        <Button text="Continue" onPress={handleContinue} />
                      </View>
                    ) : (
                      <Button
                        text={'Pay with card'}
                        onPress={handleAdd}
                        // onPress={() => navigation.navigate('AddNewCard')}
                      />
                    )}
                  </>
                )}

                {paymentMethod === 'apple' && (
                  <View style={styles.button}>
                    <Button
                      text="Continue"
                      onPress={handleAppleContinue}
                      leftIcon={
                        <FontAwesome name="apple" color={'#fff'} size={30} />
                      }
                    />
                  </View>
                )}
                {paymentMethod === 'ussd' && (
                  <View style={styles.button}>
                    <Button text="Continue" onPress={handleUssdContinue} />
                  </View>
                )}
              </>
            )}
          </>
        </View>
      </PageContainer>
      <Modal
        visible={paymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setPaymentModal(prev => !prev)}>
        <Pressable style={styles.overlay} />
        <Pressable
          style={styles.paymentModalContainer}
          onPress={() => setPaymentModal(false)}>
          <View style={styles.paymentModal}>
            <View style={styles.paymentModal}>
              <View style={styles.paymentModal}>
                {paymentMethods.map(payment => (
                  <Pressable
                    key={payment.method}
                    style={styles.method}
                    onPress={() => handlePaymentMethod(payment)}>
                    <View>{selectIcon(payment.icon)}</View>
                    <RegularText>{payment.label}</RegularText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 2 + '%',
    flex: 1,
    paddingBottom: 50,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 50,
  },
  copyContainer: {
    backgroundColor: '#EEEEEE',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copy: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  copyText: {
    color: '#fff',
  },
  info: {
    flexDirection: 'row',
    columnGap: 6,
    marginVertical: 20,
  },
  infoText: {
    textAlign: 'center',
    color: '#868585',
    marginTop: -3,
  },
  label: {
    color: '#868585',
    marginBottom: 5,
  },
  tagName: {
    fontSize: 16,
  },
  topUp: {
    fontFamily: 'OpenSans-400',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 25,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
  },
  textInputStyles: {
    paddingLeft: 50,
    fontSize: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencyName: { textTransform: 'capitalize' },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 100 + '%',
    width: 100 + '%',
  },
  paymentModalContainer: {
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentModal: {
    width: 100 + '%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    zIndex: 9,
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingTop: 20,
    gap: 10,
    padding: 3 + '%',
  },
  modalHeader: { textAlign: 'center', fontSize: 16 },
  method: {
    width: 95 + '%',
    padding: 20,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  currencies: {
    flex: 1,
  },
  currency: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  currencyIcon: {
    gap: 20,
    flexDirection: 'row',
    flex: 1,
  },
  amount: {
    fontSize: 18,
  },
  symbol: {
    position: 'absolute',
    fontSize: 28,
    zIndex: 9,
    top: Platform.OS === 'android' ? 8 : 12,
    left: 15,
  },
  errorMessage: {
    color: 'red',
    transform: [{ translateY: -15 }],
  },
  fee: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
  },
  feeText: {
    color: '#fff',
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  accNoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  bankName: {
    fontSize: 22,
    marginVertical: 5,
  },
  accNo: {
    fontSize: 28,
    marginBottom: 10,
  },
  accName: {
    fontSize: 20,
    marginBottom: 10,
  },
  paste: {
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
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  savedCards: {
    marginVertical: 20,
  },
  savedCard: {
    borderBottomWidth: 1,
    paddingVertical: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  savedCardCheck: {
    flexDirection: 'row',
    gap: 10,
  },
  expiry: {
    alignItems: 'flex-end',
  },
  boldText: {
    fontSize: 17,
  },
  subText: {
    color: '#868585',
  },
});
export default AddMoney;
