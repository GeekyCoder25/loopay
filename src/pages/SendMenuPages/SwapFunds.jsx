import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../components/AppContext';
import RegularText from '../../components/fonts/RegularText';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import { addingDecimal } from '../../../utils/AddingZero';
import FlagSelect from '../../components/FlagSelect';
import {
  allCurrencies,
  swapFromObject,
  swapToObject,
} from '../../database/data';

const SwapFunds = ({ navigation }) => {
  const { vh, selectedCurrency, isLoading, setIsLoading } =
    useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState(false);
  const [value, setValue] = useState('');
  const [swapData, setSwapData] = useState({});
  const [toReceive, setToReceive] = useState('Amount to receive');
  const [fee, setFee] = useState(0);
  const [swapFrom, setSwapFrom] = useState(swapFromObject);
  const [swapTo, setSwapTo] = useState(swapToObject);
  const [swapToCurrency, setSwapToCurrncy] = useState(
    selectedCurrency.currency === 'Naira' ? 'Dollar' : 'Naira',
  );
  const currencyRateAPI = [
    {
      name: 'DollarToNaira',
      rate: 730,
      percentageFee: 2,
    },
    {
      name: 'NairaToDollar',
      rate: 1 / 780,
      percentageFee: 2,
    },
  ];

  useEffect(() => {
    const selectedCurrencyFunc = index =>
      allCurrencies.find(currency => currency.currency === index);
    setSwapFrom({ ...selectedCurrency, balance: 1320 });
    setSwapTo({ ...selectedCurrencyFunc(swapToCurrency), balance: 50 });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [selectedCurrency, setIsLoading, swapToCurrency]);

  const currencyToCurrencyDetector = `${swapFrom.currency}To${swapTo.currency}`;

  const currencyRate = () => {
    return currencyRateAPI
      .find(rate => rate.name === currencyToCurrencyDetector)
      ?.rate.toFixed(2);
  };
  const currencyFee = () => {
    return currencyRateAPI.find(
      percentageFee => percentageFee.name === currencyToCurrencyDetector,
    ).percentageFee;
  };

  const handlePriceInput = text => {
    const textInputValue = Number(text);
    const percentage = currencyFee() / 100;
    const toReceiveCalculate = Number(
      (
        textInputValue * currencyRate() -
        textInputValue * currencyRate() * percentage
      ).toFixed(2),
    );
    const transcationFee = Number(
      (textInputValue * currencyRate() * percentage).toFixed(2),
    );

    setErrorMessage(false);
    setValue(text);
    setSwapData(prev => {
      return {
        ...prev,
        toSwap: textInputValue,
        toReceive: toReceiveCalculate,
        fee: transcationFee,
      };
    });
    setToReceive(
      toReceiveCalculate > 0
        ? addingDecimal(toReceiveCalculate.toLocaleString())
        : 'Amount to receive',
    );
    setFee(addingDecimal(transcationFee.toLocaleString()));
  };

  const handleIsOkay = () => {
    // if (toReceive < selectedCurrency.minimumAmountToAdd) {
    //   setErrorMessage(true);
    //   setIsOkay(false);
    // } else {
    //   setIsOkay(true);
    // }
  };

  const handleAutoFill = () => {
    handleIsOkay();
    if (value) {
      if (!value.includes('.')) {
        setValue(value + '.00');
      } else if (value.split('.')[1].length === 0) {
        setValue(value + '00');
      } else if (value.split('.')[1].length === 1) {
        setValue(value + '0');
      }
    }
  };

  const handleContine = () => {
    // navigation.navigate('AddMoneyConfirm', swapData);
  };

  return (
    <PageContainer paddingTop={10}>
      <ScrollView>
        {!isLoading && (
          <View style={{ ...styles.body, minHeight: vh * 0.88 }}>
            <BoldText style={styles.headerText}>Swap Funds</BoldText>
            <View style={styles.swapContainer}>
              <View style={styles.swap}>
                <RegularText style={styles.swapTitle}>
                  Account to swap from
                </RegularText>
                <Pressable
                  style={{ ...styles.swapBox, ...styles.from }}
                  onPress={() => {}}>
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
              </View>
              <View style={styles.swap}>
                <RegularText style={styles.swapTitle}>
                  Account to swap to
                </RegularText>
                <Pressable
                  style={{ ...styles.swapBox, ...styles.to }}
                  onPress={() => {}}>
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
              </View>
            </View>
            <View style={styles.rate}>
              <BoldText>Current Rate:</BoldText>
              <RegularText>
                1{swapFrom.symbol} = {swapTo.symbol}
                {currencyRate()}
              </RegularText>
            </View>
            <View style={styles.swapInputContainer}>
              <View>
                <RegularText style={styles.topUp}>Amount to top up</RegularText>
                <View style={styles.textInputContainer}>
                  <BoldText style={styles.symbol}>{swapFrom.symbol}</BoldText>
                  <TextInput
                    style={styles.textInput}
                    inputMode="numeric"
                    onChangeText={text => handlePriceInput(text)}
                    onBlur={handleAutoFill}
                    value={value}
                    placeholder="Amount to swap"
                    placeholderTextColor={'#525252'}
                  />
                </View>
                {errorMessage && (
                  <RegularText style={styles.errorMessage}>
                    The minimum amount required is {swapFrom.symbol}
                    {swapFrom.minimumAmountToAdd}
                  </RegularText>
                )}
              </View>
              <RegularText style={styles.topUp}>
                Amount you will recieve
              </RegularText>
              <View style={styles.textInputContainer}>
                <BoldText style={styles.symbol}>{swapTo.symbol}</BoldText>
                <View style={{ ...styles.textInput, ...styles.toReceive }}>
                  <RegularText>{toReceive}</RegularText>
                </View>
                <View style={styles.fee}>
                  <RegularText style={styles.feeText}>
                    Service Charged
                  </RegularText>
                  <RegularText style={styles.feeText}>
                    {swapTo.symbol}
                    {fee}
                  </RegularText>
                </View>
              </View>
            </View>
            <View style={styles.button}>
              <Button text="Continue" onPress={handleContine} />
            </View>
          </View>
        )}
      </ScrollView>
    </PageContainer>
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
  swapBalance: {},
  rate: {
    flexDirection: 'row',
    gap: 10,
    padding: 5 + '%',
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
});

export default SwapFunds;
