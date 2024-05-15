/* eslint-disable react-native/no-inline-styles */
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  Platform,
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
import useFetchData from '../../../utils/fetchAPI';
import { randomUUID } from 'expo-crypto';
import ToastMessage from '../../components/ToastMessage';
import { Audio } from 'expo-av';
import IonIcon from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { setShowBalance } from '../../../utils/storage';
import LoadingModal from '../../components/LoadingModal';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const SwapFunds = ({ navigation }) => {
  const { getFetchData, postFetchData } = useFetchData();
  const {
    selectedCurrency,
    setIsLoading,
    setWalletRefresh,
    vh,
    showAmount,
    setShowAmount,
  } = useContext(AppContext);
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
    balance: wallet.balance || 0,
  });
  const [swapTo, setSwapTo] = useState(swapToObject);
  const [swapToCurrency] = useState(
    swapFrom.isLocal
      ? 'dollar'
      : allCurrencies.find(currency => currency.isLocal).currency,
  );
  const [showSwapFromCurrencies, setShowSwapFromCurrencies] = useState(false);
  const [showSwapToCurrencies, setShowSwapToCurrencies] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [currencyRateAPI, setCurrencyRateAPI] = useState({});
  const [rateRefetch, setRateRefetch] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getRates = async () => {
        const response = await getFetchData(`user/rate/${swapFrom.acronym}`);
        response.status === 200 && setCurrencyRateAPI(response.data);
      };
      getRates()
        .catch(() => {
          setIsLocalLoading(false);
          setErrorMessage("Can't connect to server");
        })
        .finally(() => {
          setFee(0);
          setIsLocalLoading(false);
        });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rateRefetch, setIsLoading, swapFrom.acronym]),
  );
  useEffect(() => {
    const selectedCurrencyFunc = index =>
      allCurrencies.find(currency => currency.currency === index);
    setSwapTo({
      ...selectedCurrencyFunc(swapToCurrency),
      balance:
        wallet[
          `${
            ['dollar', 'euro', 'pound'].includes(swapToCurrency)
              ? swapToCurrency
              : 'local'
          }Balance`
        ] || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { minimumAmountToAdd } = swapFrom;

  const handleSwitch = () => {
    setSwapFrom(swapTo);
    setSwapTo(swapFrom);
    setErrorKey('');
    setErrorMessage('');
    setValue('');
    setToReceive('');
    setCurrencyRateAPI({});
  };

  const handleSwapFromSelect = currency => {
    setRateRefetch(prev => !prev);
    setSwapFrom({
      ...currency,
      balance:
        wallet[
          `${
            ['dollar', 'euro', 'pound'].includes(currency.currency)
              ? currency.currency
              : 'local'
          }Balance`
        ],
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
        balance:
          wallet[
            `${
              ['dollar', 'euro', 'pound'].includes(currency.currency)
                ? currency.currency
                : 'local'
            }Balance`
          ],
      };
    });
    setShowSwapToCurrencies(false);
    setErrorKey('');
    setErrorMessage('');
    setValue('');
    setToReceive('');
  };

  const currencyRate = () => {
    currencyRateAPI[[swapTo.acronym]] && setIsLoading(false);
    return currencyRateAPI[swapTo.acronym];
  };

  const currencyFee = () => {
    const rate = currencyRateAPI[swapTo.acronym];
    return rate > 1 ? rate : 1 / rate;
  };

  const handlePriceInput = text => {
    setValue(text);
    const textInputValue = Number(text);
    text = Number(text);
    const transactionFee = text / 100;
    setFee(transactionFee);
    const toReceiveCalculate = Number(
      ((text - transactionFee) * currencyRate()).toFixed(2),
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
        swapRate: currencyRate(),
      };
    });
    toReceiveCalculate &&
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
    } else if (!toReceive) {
      return setErrorMessage('Network error');
    }
    setErrorKey('');
    setErrorMessage('');
    setModalOpen(true);
  };

  const transactionDetails = [
    {
      title: 'Transaction Fee',
      value: currencyFee()
        ? swapFrom.symbol + addingDecimal(fee.toLocaleString())
        : swapFrom.symbol + '0.00',
    },
    {
      title: 'Pay From',
      value: 'Loopay Balance',
    },
    {
      title: 'Rate',
      value:
        currencyRate() < 1 ? (
          <>
            {swapTo.symbol}1 = {swapFrom.symbol}
            {addingDecimal(Number(1 / currencyRate()).toLocaleString())}
          </>
        ) : (
          <>
            {swapFrom.symbol}1 = {swapTo.symbol}
            {addingDecimal(Number(currencyRate()).toLocaleString())}
          </>
        ),
    },
  ];

  const handleSwap = async () => {
    try {
      setIsLocalLoading(true);
      const response = await postFetchData('user/swap', swapData);
      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        setTransaction(response.data.data);
        setIsSuccessful(true);
        const playSound = async () => {
          const { sound } = await Audio.Sound.createAsync(
            require('../../../assets/success.mp3'),
          );
          await sound.playAsync();
        };
        return playSound();
      }
      throw new Error(response.data);
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.popToTop();
    navigation.navigate('Home');
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  const handleShare = async () => {
    try {
      const { reference, transactionType } = transaction;
      setIsLocalLoading(true);

      const response = await postFetchData('user/receipt', {
        id: reference,
        type: transactionType,
        allCurrencies,
      });

      if (response.status === 200) {
        const { uri } = await printToFileAsync({
          html: response.data.html,
          height: 892,
        });

        const sharePDF = async () => {
          try {
            setIsLocalLoading(true);
            const directory = FileSystem.documentDirectory;

            const newUri = `${directory}Loopay_Receipt_${reference}.pdf`;

            await FileSystem.moveAsync({
              from: uri,
              to: newUri,
            });
            await shareAsync(newUri, {
              UTI: '.pdf',
              mimeType: 'application/pdf',
              dialogTitle: 'Share Receipt',
            });
          } catch (error) {
            ToastMessage(error.message);
          } finally {
            setIsLocalLoading(false);
          }
        };

        await sharePDF();
      } else {
        throw new Error(response.data.error || 'Server Error');
      }
    } catch (error) {
      ToastMessage("Can't generate receipt");
      setIsLoading(false);
    }
  };
  return (
    <>
      <Back onPress={() => navigation.goBack()} />
      <PageContainer paddingTop={10} scroll>
        <View
          style={{
            ...styles.body,
            minHeight: vh * 0.7,
          }}>
          <BoldText style={styles.headerText}>Swap Funds</BoldText>
          <View style={styles.swapContainer}>
            <View style={styles.swap}>
              <View style={styles.icon}>
                <RegularText style={styles.swapTitle}>
                  Account to swap from
                </RegularText>
                <Pressable style={styles.arrow} onPress={handleSwitch}>
                  <IonIcon
                    name="swap-horizontal-sharp"
                    size={32}
                    color={'#8d8d8d'}
                  />
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
                  <Pressable onPress={handleShow}>
                    <RegularText style={styles.swapBalance}>
                      {showAmount
                        ? `${swapFrom.symbol} ${addingDecimal(
                            Number(
                              swapFrom.balance.toFixed(2),
                            ).toLocaleString(),
                          )}`
                        : '***'}
                    </RegularText>
                  </Pressable>
                </View>
                <ChevronDown />
              </Pressable>
              <Modal visible={showSwapFromCurrencies} transparent>
                <Pressable
                  style={styles.swapOverlay}
                  onPress={() => setShowSwapFromCurrencies(false)}
                />
                <View style={styles.swapCurrencies}>
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
                  <Pressable onPress={handleShow}>
                    <RegularText style={styles.swapBalance}>
                      {showAmount
                        ? `${swapTo.symbol} ${addingDecimal(
                            Number(swapTo.balance.toFixed(2)).toLocaleString(),
                          )}`
                        : '***'}
                    </RegularText>
                  </Pressable>
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
            {currencyRate() ? (
              <RegularText>
                {currencyRate() < 1 ? (
                  <>
                    {swapTo.symbol}1 = {swapFrom.symbol}
                    {addingDecimal(
                      Number(1 / currencyRate() || 0).toLocaleString(),
                    )}
                  </>
                ) : (
                  <>
                    {swapFrom.symbol}1 = {swapTo.symbol}
                    {addingDecimal(
                      Number(currencyRate() || 0).toLocaleString(),
                    )}
                  </>
                )}
              </RegularText>
            ) : (
              <RegularText>***</RegularText>
            )}
          </View>
          <View style={styles.swapInputContainer}>
            <View>
              <RegularText style={styles.label}>Amount to swap</RegularText>
              <View
                style={{ ...styles.textInputContainer, ...styles.toReceive }}>
                <View style={styles.symbolContainer}>
                  <BoldText style={styles.symbol}>{swapFrom.symbol}</BoldText>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: errorKey ? 'red' : '#ccc',
                    }}
                    inputMode="decimal"
                    onChangeText={text => handlePriceInput(text)}
                    onBlur={handleAutoFill}
                    value={value}
                    placeholder="Amount to swap"
                    placeholderTextColor={'#525252'}
                  />
                </View>
                <View style={styles.fee}>
                  <RegularText style={styles.feeText}>
                    Service Charge
                  </RegularText>
                  <RegularText style={styles.feeText}>
                    {swapFrom.symbol}
                    {addingDecimal(fee.toLocaleString())}
                  </RegularText>
                </View>
              </View>
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
            <View>
              <RegularText style={styles.label}>
                Amount you will receive
              </RegularText>
              <View style={styles.textInputContainer}>
                <View style={styles.symbolContainer}>
                  <BoldText style={styles.symbol}>{swapTo.symbol}</BoldText>
                  <View
                    style={{
                      ...styles.textInput,
                    }}>
                    <RegularText>
                      {toReceive || 'Amount to receive'}
                    </RegularText>
                  </View>
                </View>
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
        {!isSuccessful ? (
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
          </View>
        ) : (
          <View style={styles.modalContainerSuccess}>
            <View style={styles.modalSuccess}>
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

              <View style={styles.buttons}>
                {transaction && (
                  <Button
                    text={'Share Receipt'}
                    onPress={handleShare}
                    style={styles.modalButtonSuccess}
                  />
                )}
                <Button
                  text="Back Home"
                  style={styles.modalButtonSuccess}
                  onPress={handleGoBack}
                />
              </View>
            </View>
          </View>
        )}
        <LoadingModal isLoading={isLocalLoading} />
      </Modal>
      <LoadingModal isLoading={isLocalLoading} />
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
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -38,
    right: 0,
    zIndex: 1,
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
    top: Platform.OS === 'android' ? 240 : 285,
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
    borderRadius: 15,
    alignSelf: 'flex-start',
    height: 35,
    justifyContent: 'center',
  },
  swapAllText: {
    padding: 10,
    color: '#fff',
    textAlign: 'center',
  },
  swapInputContainer: {
    paddingHorizontal: 5 + '%',
    gap: 30,
  },
  textInputContainer: {
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: '#eee',
    fontFamily: 'OpenSans-600',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexDirection: 'row',
  textInput: {
    flex: 1,
    height: 55,
    fontFamily: 'OpenSans-600',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  errorMessage: {
    marginTop: 20,
  },
  toReceive: {
    borderBottomWidth: 0,
  },
  symbol: {
    paddingLeft: 15,
    fontSize: 18,
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
    maxHeight: 150,
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
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 30,
  },
  modalButton: {
    marginTop: 2 + '%',
  },
  modalButtonSuccess: {
    marginTop: 10 + '%',
    flex: 1,
  },
});

export default SwapFunds;
