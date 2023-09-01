/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Modal,
} from 'react-native';
import { AppContext } from '../../components/AppContext';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import Button from '../../components/Button';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import { addingDecimal } from '../../../utils/AddingZero';
import FlagSelect from '../../components/FlagSelect';
import { allCurrencies, swapToObject } from '../../database/data';
import { useWalletContext } from '../../context/WalletContext';
import ErrorMessage from '../../components/ErrorMessage';
import Arrow from '../../../assets/images/swapArrow.svg';
import Back from '../../components/Back';
import ToastMessage from '../../components/ToastMessage';

const SwapFunds = ({ navigation }) => {
  const { selectedCurrency, isLoading, setIsLoading } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const { balance } = wallet;
  const [errokey, setErrokey] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [swapData, setSwapData] = useState({});
  const [toReceive, setToReceive] = useState('');
  // const [fee, setFee] = useState(0);
  const [swapFrom, setSwapFrom] = useState({
    ...selectedCurrency,
    balance: wallet.balance,
  });
  const [swapTo, setSwapTo] = useState(swapToObject);
  const [swapToCurrency, setSwapToCurrency] = useState(
    swapFrom.currency === 'Naira' ? 'Dollar' : 'Naira',
  );
  const [canSwap, setCanSwap] = useState(10);
  const [showSwapFromCurrencies, setShowSwapFromCurrencies] = useState(false);
  const [showSwapToCurrencies, setShowSwapToCurrencies] = useState(false);
  const currencyRateAPI = [
    {
      name: 'DollarToNaira',
      rate: 763.86,
      fee: 1 / 100,
    },
    {
      name: 'NairaToDollar',
      rate: 1 / 763.86,
      fee: 1 / 100,
    },
  ];

  useEffect(() => {
    const selectedCurrencyFunc = index =>
      allCurrencies.find(currency => currency.currency === index);
    setSwapTo({ ...selectedCurrencyFunc(swapToCurrency), balance: 0 });
  }, [selectedCurrency, setIsLoading, swapToCurrency, wallet.balance]);

  const { minimumAmountToAdd } = swapFrom;
  const currencyToCurrencyDetector = `${swapFrom.currency}To${swapTo.currency}`;

  const handleSwapFromSelect = currency => {
    setSwapFrom({
      ...currency,
      balance: currency.currency === 'Naira' ? balance : 0,
    });
    setShowSwapFromCurrencies(false);
    const swapToSelect =
      currency.currency === selectedCurrency.currency
        ? allCurrencies.filter(i => i.currency !== currency.currency)[0]
        : selectedCurrency;
    currency.currency === swapTo.currency &&
      setSwapTo({
        ...swapToSelect,
        balance: swapToSelect.currency === 'Naira' ? balance : 0,
      });
    setSwapToCurrency(swapToSelect.currency);
    setErrokey('');
    setErrorMessage('');
    setValue('');
    setToReceive('');
  };

  const handleSwapToSelect = currency => {
    setSwapTo(prev => {
      return { ...prev, ...currency };
    });
    setShowSwapToCurrencies(false);
    setErrokey('');
    setErrorMessage('');
    setValue('');
    setToReceive('');
  };

  const currencyRate = () => {
    return currencyRateAPI
      .find(currency => currency.name === currencyToCurrencyDetector)
      ?.rate.toFixed(4);
  };

  const currencyFee = () => {
    return currencyRateAPI.find(
      currency => currency.name === currencyToCurrencyDetector,
    )?.fee;
  };

  const handlePriceInput = text => {
    setValue(text);
    const textInputValue = Number(text);
    text = Number(text);
    const transactionFee = text * currencyFee();
    const swapFromAmountAfterFee = text - transactionFee;
    const toDeduct = text + transactionFee;
    const toReceiveCalculate = (swapFromAmountAfterFee * currencyRate())
      // swapFromAmountAfterFee < 1
      //   ? swapFromAmountAfterFee / currencyRate()
      //   : swapFromAmountAfterFee * currencyRate()
      .toFixed(2);

    setSwapData(prev => {
      return {
        ...prev,
        toSwap: textInputValue,
        toReceive: toReceiveCalculate,
        // fee: transcationFee,
      };
    });
    setToReceive(
      toReceiveCalculate > 0
        ? addingDecimal(Number(toReceiveCalculate).toLocaleString())
        : 'Amount to receive',
    );
    if (text > balance) {
      setErrokey(true);
      return setErrorMessage('Insufficient funds');
    }
    setErrokey(false);
    setErrorMessage(false);
  };

  const handleAutoFill = () => {
    if (value < minimumAmountToAdd) {
      setErrokey(true);
      setErrorMessage(
        `Minimum amount to swap is ${swapFrom.symbol}${minimumAmountToAdd}`,
      );
    }
    value && setValue(addingDecimal(value));
  };

  const handleModal = () => {
    setModalOpen(false);
    setCanSwap(10);
  };

  const handleContinue = () => {
    if (!value) {
      setErrokey(true);
      return setErrorMessage('Input your amount to swap');
    } else if (value < minimumAmountToAdd) {
      setErrokey(true);
      return setErrorMessage(
        `Minimum amount to swap is ${swapFrom.symbol}${minimumAmountToAdd}`,
      );
    } else if (value > balance) {
      setErrokey(true);
      return setErrorMessage('Insufficient funds');
    }
    setErrokey('');
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleSwap = () => {
    ToastMessage('Swapping not currently supported');
    setModalOpen(false);
  };
  const transactionDetails = [
    {
      title: 'Transaction Fees',
      value: 'No Fees',
    },
    {
      title: 'Pay From',
      value: 'Loopay Balnace',
    },
    {
      title: 'Rate',
      value: `1 ${swapFrom.acronym} = ${currencyRate()} ${swapTo.acronym}`,
    },
  ];

  useEffect(() => {
    modalOpen &&
      setTimeout(() => {
        canSwap > 1 ? setCanSwap(prev => prev - 1) : setCanSwap(true);
      }, 1000);
  }, [canSwap, modalOpen]);

  return (
    <>
      <Back onPress={() => navigation.goBack()} />
      <PageContainer paddingTop={10}>
        <ScrollView>
          {!isLoading && (
            <View style={{ ...styles.body }}>
              <BoldText style={styles.headerText}>Swap Funds</BoldText>
              <View style={styles.swapContainer}>
                <View style={styles.swap}>
                  <RegularText style={styles.swapTitle}>
                    Account to swap from
                  </RegularText>
                  <Pressable
                    style={{ ...styles.swapBox, ...styles.from }}
                    onPress={() => {
                      setShowSwapFromCurrencies(true);
                    }}>
                    <FlagSelect
                      country={swapFrom.currency}
                      style={styles.flagIcon}
                    />
                    <View style={styles.swapText}>
                      <BoldText>{swapFrom.acronym} Balance</BoldText>
                      <RegularText style={styles.swapBalance}>
                        {swapFrom.symbol}{' '}
                        {Number(swapFrom.balance.toFixed(2)).toLocaleString()}
                      </RegularText>
                    </View>
                    <ChevronDown />
                  </Pressable>
                  <Modal visible={showSwapFromCurrencies} transparent>
                    <Pressable
                      style={styles.swapOverlay}
                      onPress={() => setShowSwapFromCurrencies(false)}
                    />
                    <View
                      style={{
                        ...styles.swapCurrencies,
                      }}>
                      {allCurrencies
                        .filter(i => i.currency !== swapFrom.currency)
                        .map(currency => (
                          <Pressable
                            key={currency.currency}
                            style={styles.swapCurrency}
                            onPress={() => handleSwapFromSelect(currency)}>
                            <View style={styles.currencyIcon}>
                              <FlagSelect country={currency.currency} />
                            </View>
                            <View>
                              <BoldText>{currency.acronym}</BoldText>
                              <RegularText style={styles.currencyName}>
                                {currency.currency}
                              </RegularText>
                            </View>
                          </Pressable>
                        ))}
                    </View>
                  </Modal>
                </View>
                <View style={styles.swap}>
                  <RegularText style={styles.swapTitle}>
                    Account to swap to
                  </RegularText>
                  <Pressable
                    style={{ ...styles.swapBox, ...styles.to }}
                    onPress={() => {
                      setShowSwapToCurrencies(true);
                    }}>
                    <FlagSelect
                      country={swapTo.currency}
                      style={styles.flagIcon}
                    />
                    <View style={styles.swapText}>
                      <BoldText>{swapTo.acronym} Balance</BoldText>
                      <RegularText style={styles.swapBalance}>
                        {swapTo.symbol}{' '}
                        {Number(swapTo.balance.toFixed(2)).toLocaleString()}
                      </RegularText>
                    </View>
                    <ChevronDown />
                  </Pressable>
                  <Modal visible={showSwapToCurrencies} transparent>
                    <Pressable
                      style={styles.swapOverlay}
                      onPress={() => setShowSwapToCurrencies(false)}
                    />
                    <View
                      style={{
                        ...styles.swapCurrencies,
                        ...styles.swapToCurrencies,
                      }}>
                      {allCurrencies
                        .filter(
                          i =>
                            i.currency !== swapFrom.currency &&
                            i.currency !== swapTo.currency,
                        )
                        .map(currency => (
                          <Pressable
                            key={currency.currency}
                            style={styles.swapCurrency}
                            onPress={() => handleSwapToSelect(currency)}>
                            <View style={styles.currencyIcon}>
                              <FlagSelect country={currency.currency} />
                            </View>
                            <View>
                              <BoldText>{currency.acronym}</BoldText>
                              <RegularText style={styles.currencyName}>
                                {currency.currency}
                              </RegularText>
                            </View>
                          </Pressable>
                        ))}
                    </View>
                  </Modal>
                </View>
              </View>
              <View style={styles.rate}>
                <BoldText>Current Rate:</BoldText>
                <RegularText>
                  1{swapFrom.symbol} = {swapTo.symbol}
                  {currencyRate()?.startsWith('0')
                    ? Number(currencyRate()).toFixed(4)
                    : Number(currencyRate()).toFixed(2)}
                </RegularText>
              </View>
              <View style={styles.swapInputContainer}>
                <View>
                  <RegularText style={styles.label}>
                    Amount to top up
                  </RegularText>
                  <View style={styles.textInputContainer}>
                    <BoldText style={styles.symbol}>{swapFrom.symbol}</BoldText>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderColor: errokey ? 'red' : '#ccc',
                      }}
                      inputMode="numeric"
                      onChangeText={text => handlePriceInput(text)}
                      onBlur={handleAutoFill}
                      value={value}
                      placeholder="Amount to swap"
                      placeholderTextColor={'#525252'}
                    />
                    {errorMessage && (
                      <ErrorMessage
                        errorMessage={errorMessage}
                        style={styles.errorMessage}
                      />
                    )}
                  </View>
                </View>
                <RegularText style={styles.label}>
                  Amount you will recieve
                </RegularText>
                <View style={styles.textInputContainer}>
                  <BoldText style={styles.symbol}>{swapTo.symbol}</BoldText>
                  <View style={{ ...styles.textInput, ...styles.toReceiv }}>
                    <RegularText>
                      {toReceive || 'Amount to receive'}
                    </RegularText>
                  </View>
                  {/* <View style={styles.fee}>
                  <RegularText style={styles.feeText}>
                    Service Charged
                  </RegularText>
                  <RegularText style={styles.feeText}>
                    {swapTo.symbol}
                    {fee}
                  </RegularText>
                </View> */}
                </View>
              </View>
              <View style={styles.button}>
                <Button text="Continue" onPress={handleContinue} />
              </View>
            </View>
          )}
        </ScrollView>
      </PageContainer>
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={handleModal}>
        <Pressable style={styles.overlay} onPress={handleModal} />
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalBorder} />
            <BoldText style={styles.modalTextHeader}>
              Confirm Conversion
            </BoldText>
            <View style={styles.modalContent}>
              <View style={styles.swapModal}>
                <FlagSelect
                  country={swapFrom.currency}
                  style={styles.modalFlag}
                />
                <RegularText>From</RegularText>
                <BoldText>
                  {`${swapData.toSwap?.toLocaleString()} ${swapFrom.acronym}`}
                </BoldText>
              </View>
              <View style={styles.modalIcon}>
                <Arrow />
              </View>
              <View style={styles.swapModal}>
                <FlagSelect
                  country={swapTo.currency}
                  style={styles.modalFlag}
                />
                <RegularText>Receive</RegularText>
                <BoldText>
                  {`${swapData.toReceive?.toLocaleString()} ${swapTo.acronym}`}
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
            {typeof canSwap === 'boolean' ? (
              <Button text="Swap" onPress={handleSwap} />
            ) : (
              <Button text={`Swap (${canSwap}s)`} disabled={true} />
            )}
            <Pressable onPress={handleModal}>
              <BoldText>Back</BoldText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  body: {},
  headerText: {
    fontSize: 20,
    marginBottom: 50,
    paddingHorizontal: 5 + '%',
  },
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swap: {
    flex: 1,
    position: 'relative',
  },
  swapBox: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#eee',
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 5,
    height: 80,
  },
  from: {
    borderRightWidth: 1,
  },
  to: {
    borderLeftWidth: 1,
  },
  swapTitle: {
    textAlign: 'center',
  },
  flagIcon: {
    width: 25,
    height: 25,
  },
  swapText: {
    flex: 1,
    gap: 3,
  },
  swapCurrencies: {
    position: 'absolute',
    top: 245,
    width: 50.5 + '%',
    paddingVertical: 10 + '%',
    paddingHorizontal: 10 + '%',
    backgroundColor: '#fff',
    gap: 20,
    elevation: 20,
  },
  swapToCurrencies: {
    right: 0,
  },
  swapCurrency: {
    flexDirection: 'row',
    gap: 25,
  },
  swapOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  swapBalance: {},
  rate: {
    flexDirection: 'row',
    gap: 10,
    padding: 5 + '%',
    zIndex: 1,
  },
  swapInputContainer: {
    paddingHorizontal: 5 + '%',
    marginTop: 30,
  },
  textInputContainer: {
    position: 'relative',
    marginBottom: 40,
    marginTop: 10,
  },
  textInput: {
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
  errorMessage: {
    marginTop: 20,
  },
  toReceive: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  symbol: {
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
    backgroundColor: '#525252',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  feeText: {
    color: '#f9f9f9',
    fontSize: 13,
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
  },
  swapModal: {
    alignItems: 'center',
    gap: 10,
  },
  modalFlag: {
    width: 50,
    height: 50,
  },
  modalIcon: {
    marginBottom: 60,
  },
  card: {
    backgroundColor: '#E4E2E2',
    width: 100 + '%',
    padding: 5 + '%',
    gap: 10,
    borderRadius: 5,
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
});

export default SwapFunds;
