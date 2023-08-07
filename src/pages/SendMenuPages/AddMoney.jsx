import {
  Clipboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../components/AppContext';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import { allCurrencies } from '../../database/data';
import SendMenuHeader from './Header';
import Button from '../../components/Button';
import FlagSelect from '../../components/FlagSelect';
import { useWalletContext } from '../../../context/WalletContext';
import Paste from '../../../assets/images/paste.svg';

const AddMoney = ({ navigation, route }) => {
  const { selectedCurrency, setSelectedCurrency } = useContext(AppContext);
  const wallet = useWalletContext();
  const [accNo] = useState(wallet.accNo);
  const [bankName] = useState(wallet.bank);
  const [modalOpen, setModalOpen] = useState(false);
  const [addBalanceData, setAddBalanceData] = useState({
    toBeCredited: 0,
    toReceive: 0,
    paymentMethod: 'Bank Transfer',
  });
  const [fee, setFee] = useState(
    addBalanceData.toReceive * (selectedCurrency.fee / 100),
  );
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [isOkay, setIsOkay] = useState(false);
  const { toBeCredited, toReceive } = addBalanceData;

  const handlecurrencyChange = newSelect => {
    setSelectedCurrency(newSelect);
    setValue('');
    setErrorMessage(false);
    setIsOkay(false);
    setAddBalanceData(prev => {
      return {
        ...prev,
        toBeCredited: 0,
        toReceive: 0,
      };
    });
  };

  useEffect(() => {
    const percentage = selectedCurrency.fee / 100;
    setFee((toBeCredited * percentage).toFixed(2));
  }, [toBeCredited, selectedCurrency.fee]);

  const handleModal = () => {
    setModalOpen(prev => !prev);
  };

  const handlePaymentMethod = paymentMethod => {
    setAddBalanceData(prev => {
      return {
        ...prev,
        paymentMethod,
      };
    });
  };

  const handlePriceInput = text => {
    setErrorMessage(false);
    setValue(text);
    const percentage = selectedCurrency.fee / 100;
    setAddBalanceData(prev => {
      return {
        ...prev,
        toBeCredited: Number(text),
        toReceive: Number(text - (Number(text) * percentage).toFixed(2)),
        fee: (toBeCredited * percentage).toFixed(2),
      };
    });
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

  const handleIsOkay = () => {
    if (toReceive < selectedCurrency.minimumAmountToAdd) {
      setErrorMessage(true);
      setIsOkay(false);
    } else {
      setIsOkay(true);
    }
  };

  const handleContinue = params => {
    navigation.navigate('AddMoneyConfirm', { ...params, ...addBalanceData });
  };
  const handleCopy = () => {
    Clipboard.setString(accNo);
  };
  return (
    <PageContainer paddingTop={10} padding={true}>
      <View style={styles.body}>
        <BoldText style={styles.headerText}>Add Balance</BoldText>
        <View>
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
            <View style={styles.modal}>
              <SendMenuHeader
                route={route}
                onPress={() => setModalOpen(false)}
              />
              <BoldText style={styles.modalHeader}>
                Select account to top up
              </BoldText>
              {allCurrencies
                .filter(i => i.currency !== selectedCurrency.currency)
                .map(currency => (
                  <Pressable
                    key={currency.currency}
                    style={{
                      ...styles.currency,
                    }}
                    onPress={() => {
                      handlecurrencyChange(currency);
                      setModalOpen(false);
                    }}>
                    <View style={styles.currencyIcon}>
                      <FlagSelect country={currency.currency} />
                      <View>
                        <BoldText>{currency.acronym}</BoldText>
                        <RegularText style={styles.currencyName}>
                          {currency.currency}
                        </RegularText>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </View>
          </Modal>
          <Text style={styles.topUp}>Payment Method</Text>
          <Pressable
            onPress={() => handlePaymentMethod('Bank Transfer')}
            style={styles.textInputContainer}>
            <View style={styles.textInput}>
              <RegularText>Pay via Bank Transfer</RegularText>
              <ChevronDown />
            </View>
          </Pressable>
          <RegularText>Bank Name</RegularText>
          <BoldText style={styles.bankName}>{bankName}</BoldText>
          <RegularText>Bank Account Number</RegularText>
          <View style={styles.accNoContainer}>
            <BoldText style={styles.accNo}>{accNo}</BoldText>
            <Pressable onPress={handleCopy} style={styles.paste}>
              <RegularText style={styles.pasteText}>Copy</RegularText>
              <Paste />
            </Pressable>
          </View>
          {/* <Text style={styles.topUp}>Amount to be credited</Text>
          <View style={styles.textInputContainer}>
            <BoldText style={styles.symbol}>{selectedCurrency.symbol}</BoldText>
            <TextInput
              style={{ ...styles.textInput, ...styles.textInputStyles }}
              inputMode="numeric"
              onChangeText={text => handlePriceInput(text)}
              onBlur={handleAutoFill}
              value={value}
            />
          </View>
          {errorMessage && (
            <RegularText style={styles.errorMessage}>
              The minimum amount required is {selectedCurrency.symbol}
              {selectedCurrency.minimumAmountToAdd}
            </RegularText>
          )}
        </View>
        <Text style={styles.topUp}>Amount you’ll recieve</Text>
        <View style={styles.textInputContainer}>
          <BoldText style={styles.symbol}>{selectedCurrency.symbol}</BoldText>
          <View style={{ ...styles.textInput, ...styles.textInputStyles }}>
            <RegularText style={{ fontSize: styles.textInputStyles.fontSize }}>
              {toReceive > 0
                ? value && !toReceive.toString().includes('.')
                  ? `${toReceive}.00`
                  : toReceive.toFixed(2)
                : ''}
            </RegularText>
          </View>
          <View style={styles.fee}>
            <RegularText style={styles.feeText}>
              Fee: {selectedCurrency.symbol}
              {fee < 0 ? '0.00' : fee}
            </RegularText>
          </View> */}
        </View>
        <View style={styles.button}>
          {!isOkay ? (
            <Button text="Continue" onPress={handleIsOkay} />
          ) : (
            <Button
              text="Continue"
              onPress={() => handleContinue(selectedCurrency)}
            />
          )}
        </View>
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 2 + '%',
    flex: 1,
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
    marginBottom: 40,
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
  currencyName: {
    textTransform: 'capitalize',
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingTop: 20,
    gap: 10,
    padding: 3 + '%',
  },
  modalHeader: { textAlign: 'center', marginTop: 15, fontSize: 16 },
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
  symbol: {
    position: 'absolute',
    fontSize: 28,
    zIndex: 9,
    top: 5,
    left: 15,
  },
  errorMessage: {
    color: 'red',
    transform: [{ translateY: -35 }],
    textAlign: 'center',
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
});
export default AddMoney;
