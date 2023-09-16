/* eslint-disable react-native/no-inline-styles */
import {
  Clipboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
import Paste from '../../../assets/images/paste.svg';
import ToastMessage from '../../components/ToastMessage';
import { addingDecimal } from '../../../utils/AddingZero';
import BankIcon from '../../../assets/images/bank.svg';
import CardIcon from '../../../assets/images/card.svg';
import Button from '../../components/Button';
import EmptyCheckbox from '../../../assets/images/emptyCheckbox.svg';
import FilledCheckbox from '../../../assets/images/filledCheckbox.svg';
import ErrorMessage from '../../components/ErrorMessage';
import { getFetchData } from '../../../utils/fetchAPI';

const AddMoney = ({ navigation, route }) => {
  const { selectedCurrency, setSelectedCurrency, walletRefresh } =
    useContext(AppContext);
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
    toBeCredited: 0,
    toReceive: 0,
    paymentMethod,
    symbol: selectedCurrency.symbol,
  });
  const { minimumAmountToAdd } = selectedCurrency;

  useEffect(() => {
    getFetchData(`user/debit-card/${selectedCurrency.currency}`).then(
      response => response.status === 200 && setSavedCards(response.data),
    );
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
  ];
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
    Clipboard.setString(wallet.accNo);
    ToastMessage('Copied to clipboard');
  };

  const checkPaymentMethod = () => {
    switch (paymentMethod) {
      case 'bankTransfer':
        return 'Pay via Bank Transfer';
      case 'card':
        return 'Pay via Debit Card';

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
    }
  };

  const handlePriceInput = text => {
    const feeRate = 1 / 100;
    setValue(text);
    text = Number(text);
    const transactionFee = text * feeRate;
    setFee(transactionFee);
    const swapFromAmountAfterFee = text - transactionFee;
    const toReceiveCalculate = Number(swapFromAmountAfterFee.toFixed(2));

    setAddBalanceData(prev => {
      return {
        ...prev,
        amount: text,
        toReceive: toReceiveCalculate,
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

  function addSpaceEvery4Characters(inputString) {
    let result = '';
    for (let i = 0; i < inputString.length; i++) {
      if (i > 0 && i % 4 === 0) {
        result += ' ';
      }
      result += inputString[i];
    }
    return result;
  }

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
    navigation.navigate('AddMoneyConfirm', addBalanceData);
  };

  return (
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
            <Back route={route} onPress={() => setModalOpen(false)} />
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
                    <BoldText style={styles.amount}>
                      {select.symbol +
                        addingDecimal(
                          wallet[`${select.currency}Balance`]?.toLocaleString(),
                        )}
                    </BoldText>
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
          <Modal
            visible={paymentModal}
            animationType="slide"
            transparent
            onRequestClose={() => setPaymentModal(prev => !prev)}>
            <Pressable
              style={styles.overlay}
              onPress={() => setPaymentModal(prev => !prev)}>
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

          {paymentMethod === 'bankTransfer' && (
            <>
              <RegularText>Bank Name</RegularText>
              <BoldText style={styles.bankName}>{wallet.bank}</BoldText>
              <RegularText>Bank Account Number</RegularText>
              <View style={styles.accNoContainer}>
                <BoldText style={styles.accNo}>{wallet.accNo}</BoldText>
                <Pressable
                  onPress={wallet.accNo && handleCopy}
                  style={styles.paste}>
                  <RegularText style={styles.pasteText}>Copy</RegularText>
                  <Paste />
                </Pressable>
              </View>
            </>
          )}

          {paymentMethod === 'card' && (
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
                  inputMode="numeric"
                  onChangeText={text => handlePriceInput(text)}
                  onBlur={handleAutoFill}
                  value={value}
                />
              </View>
              {errorMessage && (
                <ErrorMessage
                  errorMessage={errorMessage}
                  style={styles.errorMessage}
                />
              )}

              <RegularText style={styles.label}>
                Amount you’ll receive
              </RegularText>
              <View style={styles.textInputContainer}>
                <BoldText style={styles.symbol}>
                  {selectedCurrency.symbol}
                </BoldText>
                <View
                  style={{ ...styles.textInput, ...styles.textInputStyles }}>
                  <RegularText
                    style={{ fontSize: styles.textInputStyles.fontSize }}>
                    {toReceive}
                  </RegularText>
                </View>
                <View style={styles.fee}>
                  <RegularText style={styles.feeText}>
                    Fee: {selectedCurrency.symbol}
                    {fee < 0 ? '0.00' : fee}
                  </RegularText>
                </View>
              </View>
              {savedCards.length > 0 && (
                <View style={styles.savedCards}>
                  <BoldText>Saved card{savedCards.length > 1 && 's'}</BoldText>
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
                        <RegularText style={styles.subText}>***</RegularText>
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
                  text={'Add new card'}
                  onPress={() => navigation.navigate('AddNewCard')}
                />
              )}
            </>
          )}
        </>
      </View>
    </PageContainer>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentModal: {
    width: 100 + '%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
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
    top: 5,
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
    marginVertical: 10,
  },
  accNo: {
    fontSize: 28,
    marginBottom: 20,
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
