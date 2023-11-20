/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
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
import Check from '../../../assets/images/check.svg';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import { randomUUID } from 'expo-crypto';
import ToastMessage from '../../components/ToastMessage';
import { Audio } from 'expo-av';

const SwapFunds = ({ navigation }) => {
  const { selectedCurrency, setIsLoading, setWalletRefresh, vh } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const [errorKey, setErrorKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [swapData, setSwapData] = useState({});
  const [toReceive, setToReceive] = useState('');
  const [fee, setFee] = useState(0);
  const [swapFrom, setSwapFrom] = useState({
    ...selectedCurrency,
    balance: wallet?.balance,
  });
  const [swapTo, setSwapTo] = useState(swapToObject);
  const [swapToCurrency] = useState(
    swapFrom.currency === 'naira' ? 'dollar' : 'naira',
  );
  const [showSwapFromCurrencies, setShowSwapFromCurrencies] = useState(false);
  const [showSwapToCurrencies, setShowSwapToCurrencies] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [currencyRateAPI, setCurrencyRateAPI] = useState([]);
  const [rateRefetch, setRateRefetch] = useState(false);

  useEffect(() => {
    const getRates = async () => {
      const response = await getFetchData('user/rate');
      response.status === 200 && setCurrencyRateAPI(response.data);
    };
    getRates();
  }, [rateRefetch]);

  // const currencyRateAPI = [
  //   {
  //     name: 'NairaToDollar',
  //     rate: 1 / 763.86,
  //     fee: 1 / 100,
  //   },
  //   {
  //     name: 'NairaToEuro',
  //     rate: 1 / 816.34,
  //     fee: 3 / 100,
  //   },
  //   {
  //     name: 'NairaToPound',
  //     rate: 1 / 956.12,
  //     fee: 3 / 100,
  //   },
  //   {
  //     name: 'DollarToNaira',
  //     rate: 763.86,
  //     fee: 1 / 100,
  //   },
  //   {
  //     name: 'DollarToEuro',
  //     rate: 1 / 1.07,
  //     fee: 3 / 100,
  //   },
  //   {
  //     name: 'DollarToPound',
  //     rate: 1 / 1.26,
  //     fee: 1 / 100,
  //   },
  //   {
  //     name: 'EuroToNaira',
  //     rate: 816.34,
  //     fee: 3 / 100,
  //   },
  //   {
  //     name: 'EuroToDollar',
  //     rate: 1.07,
  //     fee: 3 / 100,
  //   },
  //   {
  //     name: 'EuroToPound',
  //     rate: 1 / 1.17,
  //     fee: 1 / 100,
  //   },
  //   {
  //     name: 'PoundToNaira',
  //     rate: 956.12,
  //     fee: 3 / 100,
  //   },
  //   {
  //     name: 'PoundToDollar',
  //     rate: 1.26,
  //     fee: 1 / 100,
  //   },
  //   {
  //     name: 'PoundToEuro',
  //     rate: 1.17,
  //     fee: 3 / 100,
  //   },
  // ];

  useEffect(() => {
    const selectedCurrencyFunc = index =>
      allCurrencies.find(currency => currency.currency === index);
    setSwapTo({
      ...selectedCurrencyFunc(swapToCurrency),
      balance: wallet[`${swapToCurrency}Balance`],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { minimumAmountToAdd } = swapFrom;
  const firstLetterToCapital = input => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
  const currencyToCurrencyDetector = `${firstLetterToCapital(
    swapFrom.currency,
  )}To${firstLetterToCapital(swapTo.currency)}`;

  const handleSwitch = () => {
    setSwapFrom(swapTo);
    setSwapTo(swapFrom);
  };

  const handleSwapFromSelect = currency => {
    setRateRefetch(prev => !prev);
    setSwapFrom({
      ...currency,
      balance: wallet[`${currency.currency}Balance`],
    });
    setShowSwapFromCurrencies(false);
    const swapToSelect =
      currency.currency === selectedCurrency.currency
        ? allCurrencies.filter(i => i.currency !== currency.currency)[0]
        : selectedCurrency;
    currency.currency === swapTo.currency &&
      setSwapTo({
        ...swapToSelect,
        balance: wallet[`${swapToSelect.currency}Balance`],
      });
    // setSwapToCurrency(swapToSelect.currency);
    setErrorKey('');
    setErrorMessage('');
    setValue('');
    setToReceive('');
  };

  const handleSwapToSelect = currency => {
    setRateRefetch(prev => !prev);
    setSwapTo(() => {
      return {
        ...currency,
        balance: wallet[`${currency.currency}Balance`],
      };
    });
    setShowSwapToCurrencies(false);
    setErrorKey('');
    setErrorMessage('');
    setValue('');
    setToReceive('');
  };

  const currencyRate = () => {
    return currencyRateAPI
      .find(currency => currency.currency === currencyToCurrencyDetector)
      ?.rate.toFixed(4);
  };

  const currencyFee = () => {
    return currencyRateAPI.find(
      currency => currency.currency === currencyToCurrencyDetector,
    )?.fee;
  };

  const handlePriceInput = text => {
    setValue(text);
    const textInputValue = Number(text);
    text = Number(text);
    const transactionFee = text * (currencyFee() / 100);
    setFee(transactionFee);
    const swapFromAmountAfterFee = text - transactionFee;
    const toReceiveCalculate = Number(
      (swapFromAmountAfterFee * currencyRate()).toFixed(2),
    );

    setSwapData(prev => {
      return {
        ...prev,
        toSwap: textInputValue,
        toReceive: toReceiveCalculate,
        fromCurrency: swapFrom.currency,
        toCurrency: swapTo.currency,
        id: randomUUID(),
        fee: transactionFee,
      };
    });
    setToReceive(
      toReceiveCalculate > 0
        ? addingDecimal(toReceiveCalculate.toLocaleString())
        : 'Amount to receive',
    );
    if (text > wallet[`${swapFrom.currency}Balance`]) {
      setErrorKey(true);
      return setErrorMessage('Insufficient funds');
    }
    setErrorKey(false);
    setErrorMessage(false);
  };

  const handleAutoFill = ({ params }) => {
    const amount = params || value;
    if (amount && amount < minimumAmountToAdd) {
      setErrorKey(true);
      setErrorMessage(
        `Minimum amount to swap is ${swapFrom.symbol}${minimumAmountToAdd}`,
      );
    }
    amount && setValue(addingDecimal(amount));
  };

  const handleModal = () => {
    if (isSuccessful) {
      return handleGoBack();
    }
    setModalOpen(false);
  };

  const handleContinue = () => {
    if (!value) {
      setErrorKey(true);
      return setErrorMessage('Input your amount to swap');
    } else if (value < minimumAmountToAdd) {
      setErrorKey(true);
      return setErrorMessage(
        `Minimum amount to swap is ${swapFrom.symbol}${minimumAmountToAdd}`,
      );
    } else if (value > wallet[`${swapFrom.currency}Balance`]) {
      setErrorKey(true);
      return setErrorMessage('Insufficient funds');
    }
    setErrorKey('');
    setErrorMessage('');
    setModalOpen(true);
  };

  const transactionDetails = [
    {
      title: 'Transaction Fees',
      value: currencyFee()
        ? swapFrom.symbol + addingDecimal(fee.toLocaleString())
        : 'Free',
    },
    {
      title: 'Pay From',
      value: 'Loopay Balance',
    },
    {
      title: 'Rate',
      value: `1 ${swapFrom.acronym} = ${addingDecimal(
        Number(currencyRate()).toLocaleString(),
      )} ${swapTo.acronym}`,
    },
  ];

  const handleSwap = async () => {
    try {
      setIsLoading(true);
      const response = await postFetchData('user/swap', swapData);

      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        setIsSuccessful(true);
        const playSound = async () => {
          const { sound } = await Audio.Sound.createAsync(
            require('../../../assets/success.mp3'),
          );
          await sound.playAsync();
        };
        playSound();
      }
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
  };

  return (
    <>
      <Back onPress={() => navigation.goBack()} />
      <PageContainer paddingTop={10} scroll>
        <View
          style={{
            ...styles.body,
            minHeight: vh * 0.8,
          }}>
          <BoldText style={styles.headerText}>Swap Funds</BoldText>
          <View style={styles.swapContainer}>
            <View style={styles.swap}>
              <View style={styles.icon}>
                <RegularText style={styles.swapTitle}>
                  Account to swap from
                </RegularText>
                <Pressable style={styles.arrow} onPress={handleSwitch}>
                  <Arrow />
                </Pressable>
              </View>
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
                <FlagSelect country={swapTo.currency} style={styles.flagIcon} />
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
              {swapFrom.symbol}1 = {swapTo.symbol}
              {currencyRate()?.startsWith('0')
                ? Number(currencyRate()).toLocaleString()
                : addingDecimal(Number(currencyRate()).toLocaleString())}
            </RegularText>
          </View>
          <View style={styles.swapInputContainer}>
            <View>
              <View>
                <RegularText style={styles.label}>Amount to swap</RegularText>
              </View>
              <View style={styles.textInputContainer}>
                <BoldText style={styles.symbol}>{swapFrom.symbol}</BoldText>
                <TextInput
                  style={{
                    ...styles.textInput,
                    borderColor: errorKey ? 'red' : '#ccc',
                  }}
                  inputMode="numeric"
                  onChangeText={text => handlePriceInput(text)}
                  onBlur={handleAutoFill}
                  value={value}
                  placeholder="Amount to swap"
                  placeholderTextColor={'#525252'}
                />
                <TouchableOpacity
                  style={styles.swapAll}
                  onPress={() => {
                    handlePriceInput(swapFrom.balance.toFixed(2));
                    handleAutoFill({ params: swapFrom.balance.toFixed(2) });
                  }}>
                  <BoldText style={styles.swapAllText}>
                    Swap all {swapFrom.acronym} balance to {swapTo.acronym}
                  </BoldText>
                </TouchableOpacity>
                {errorMessage && (
                  <ErrorMessage
                    errorMessage={errorMessage}
                    style={styles.errorMessage}
                  />
                )}
              </View>
            </View>
            <RegularText style={styles.label}>
              Amount you will receive
            </RegularText>
            <View style={styles.textInputContainer}>
              <BoldText style={styles.symbol}>{swapTo.symbol}</BoldText>
              <View style={{ ...styles.textInput, ...styles.toReceive }}>
                <RegularText>{toReceive || 'Amount to receive'}</RegularText>
              </View>
              <View style={styles.fee}>
                <RegularText style={styles.feeText}>
                  Service Charged
                </RegularText>
                <RegularText style={styles.feeText}>
                  {swapFrom.symbol}
                  {addingDecimal(fee.toLocaleString())}
                </RegularText>
              </View>
            </View>
          </View>
          <View style={styles.button}>
            <Button text="Continue" onPress={handleContinue} />
          </View>
        </View>
      </PageContainer>
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={handleModal}>
        <Pressable style={styles.overlay} onPress={handleModal} />
        <View style={styles.modalContainer}>
          {!isSuccessful ? (
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
                    {`${swapData.toReceive?.toLocaleString()} ${
                      swapTo.acronym
                    }`}
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
                text="Swap"
                onPress={handleSwap}
                style={styles.modalButton}
              />

              <Pressable onPress={handleModal}>
                <BoldText>Back</BoldText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.modal}>
              <View>
                <Check />
              </View>
              <BoldText style={styles.modalTextHeader}>
                Swap Successful
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
                    {`${swapData.toReceive?.toLocaleString()} ${
                      swapTo.acronym
                    }`}
                  </BoldText>
                </View>
              </View>
              <Button
                text="Back Home"
                style={styles.modalButton}
                onPress={handleGoBack}
              />
            </View>
          )}
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
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    marginRight: -10,
  },
  swapTitle: {
    flex: 1,
    textAlign: 'center',
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
  currencyName: {
    textTransform: 'capitalize',
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
  swapAll: {
    backgroundColor: '#1e1e1e',
    marginTop: 20,
    padding: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  swapAllText: {
    color: '#fff',
    textAlign: 'center',
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
    minHeight: 500,
    maxHeight: 600,
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
    gap: 15,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'space-around',
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
  button: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginTop: 2 + '%',
  },
});

export default SwapFunds;
