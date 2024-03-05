/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import RegularText from '../../components/fonts/RegularText';
import Check from '../../../assets/images/small-check.svg';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import FlagSelect from '../../components/FlagSelect';
import { AppContext } from '../../components/AppContext';
import { addingDecimal } from '../../../utils/AddingZero';
import { useWalletContext } from '../../context/WalletContext';
import Button from '../../components/Button';
import { allCurrencies } from '../../database/data';
import Back from '../../components/Back';
import { postFetchData } from '../../../utils/fetchAPI';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import { randomUUID } from 'expo-crypto';

const RequestFund = ({ navigation, route }) => {
  const { appData, selectedCurrency, setIsLoading } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [selected, setSelected] = useState(selectedCurrency);
  const [stateFields, setStateFields] = useState({
    id: randomUUID(),
    currency: selected.currency,
    symbol: selected.symbol,
  });
  const [userFound, setUserFound] = useState(false);
  const [errorKey, setErrorKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [toReceive, setToReceive] = useState('');
  const [fee, setFee] = useState(0);

  const { minimumAmountToAdd } = selected;

  const handlePriceInput = text => {
    // const feeRate = 1 / 100;
    setValue(text);
    text = Number(text);
    const transactionFee = text * 0;
    setFee(transactionFee);
    // const swapFromAmountAfterFee = text - transactionFee;
    const toReceiveCalculate = text;

    setStateFields(prev => {
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
        : '0.00',
    );
    setErrorKey(false);
    setErrorMessage(false);
  };

  const handleAutoFill = () => {
    if (value && value < minimumAmountToAdd) {
      setErrorKey(true);
      setErrorMessage(
        `Minimum amount to request is ${selected.symbol}${minimumAmountToAdd}`,
      );
    }
    value && setValue(addingDecimal(value));
  };

  const handleCurrencyChange = newSelect => {
    setErrorKey('');
    setErrorMessage('');
    setSelected(newSelect);
    setStateFields(prev => {
      return {
        ...prev,
        currency: newSelect.currency,
        symbol: newSelect.symbol,
      };
    });
  };

  const handleModal = () => {
    setModalOpen(prev => !prev);
  };

  const handleTagCheck = async text => {
    setErrorKey('');
    setErrorMessage('');
    setSuccessMessage('');

    setStateFields(prev => {
      return {
        ...prev,
        tagName: text,
      };
    });

    return setUserFound(null);
  };

  const handleCheck = async () => {
    try {
      if (!stateFields.tagName) {
        setErrorKey('tagName');
        return setErrorMessage("Please provide user's tag name");
      }
      const senderTagName = appData.tagName;
      const result = await postFetchData(`user/get-tag/${senderTagName}`, {
        tagName: stateFields.tagName,
        type: 'requestFund',
      });
      if (result.status === 200) {
        setSuccessMessage(result.data.fullName);
        setStateFields(prev => {
          return {
            ...prev,
            ...result.data,
          };
        });
        return setUserFound(result.data);
      }
      setErrorMessage(result.data);
      setErrorKey('tagName');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!stateFields.tagName) {
      setErrorKey('tagName');
      return setErrorMessage("Please provide user's tag name");
    } else if (!userFound) {
      setErrorKey('tagName');
      return setErrorMessage('Invalid tag name');
    } else if (!value) {
      setErrorKey('amount');
      return setErrorMessage('Please provide amount');
    } else if (value && value < minimumAmountToAdd) {
      setErrorKey(true);
      return setErrorMessage(
        `Minimum amount to request is ${selected.symbol}${minimumAmountToAdd}`,
      );
    } else if (!stateFields.description) {
      setErrorKey('desc');
      return setErrorMessage('Please provide your request description');
    } else {
      return navigation.navigate('RequestConfirm', stateFields);
    }
  };

  return (
    <PageContainer style={styles.container} scroll>
      <BoldText style={styles.headerText}>Request Money</BoldText>
      <View style={styles.body}>
        <View style={styles.labelContainer}>
          <RegularText style={styles.label}>
            Enter user Loopay tag or account number
          </RegularText>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              borderColor: errorKey === 'tagName' ? 'red' : '#ccc',
            }}
            onChangeText={text => handleTagCheck(text)}
            placeholder={'#username'}
            onBlur={handleCheck}
          />
          {userFound && (
            <Pressable style={styles.textInputRight}>
              <Check />
            </Pressable>
          )}
        </View>
        {successMessage && (
          <View style={styles.success}>
            <SuccessMessage successMessage={successMessage} />
          </View>
        )}

        <View style={styles.labelContainer}>
          <RegularText style={styles.label}>Select Currency</RegularText>
        </View>
        <Pressable
          onPress={() => setModalOpen(true)}
          style={styles.textInputContainer}>
          <View style={{ ...styles.textInput, ...styles.selectInput }}>
            <View style={styles.selected}>
              <FlagSelect country={selected.currency} />
              <RegularText
                style={
                  styles.selectedText
                }>{`${selected.acronym} (${selected.fullName})`}</RegularText>
            </View>
            <ChevronDown />
          </View>
        </Pressable>

        <RegularText style={styles.label}>Request Amount</RegularText>
        <View style={styles.textInputContainer}>
          <View style={styles.symbolContainer}>
            <BoldText style={styles.symbol}>{selected.symbol}</BoldText>
          </View>
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
        </View>

        <RegularText style={styles.label}>Amount you’ll receive</RegularText>
        <View style={styles.textInputContainer}>
          <View style={styles.symbolContainer}>
            <BoldText style={styles.symbol}>{selected.symbol}</BoldText>
          </View>
          <View style={{ ...styles.textInput, ...styles.textInputStyles }}>
            <RegularText style={{ fontSize: styles.textInputStyles.fontSize }}>
              {toReceive}
            </RegularText>
          </View>
          <View style={styles.fee}>
            <RegularText style={styles.feeText}>
              Fee: {selected.symbol}
              {addingDecimal(fee?.toLocaleString())}
            </RegularText>
          </View>
        </View>

        <RegularText style={styles.label}>Description</RegularText>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              borderColor: errorKey === 'desc' ? 'red' : '#ccc',
            }}
            onChangeText={text => {
              setErrorMessage('');
              setErrorKey('');
              setStateFields(prev => {
                return {
                  ...prev,
                  description: text,
                };
              });
            }}
          />
        </View>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </View>
      <View style={styles.button}>
        <Button
          text="Request Funds"
          onPress={() => handleContinue(selectedCurrency)}
        />
      </View>
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
            .filter(i => i.currency !== selected.currency)
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
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  headerText: {
    fontSize: 20,
  },
  body: {
    marginVertical: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'OpenSans-600',
    color: '#868585',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 30,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'OpenSans-600',
  },
  textInputStyles: {
    paddingVertical: 10,
    paddingLeft: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInputRight: {
    position: 'absolute',
    top: 30 + '%',
    right: 10,
  },
  success: { marginTop: -15 },
  symbolContainer: {
    position: 'absolute',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
  symbol: {
    fontSize: 28,
  },
  selectInput: {
    backgroundColor: '#eee',
  },
  modalSelected: {
    textTransform: 'uppercase',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedText: {
    color: '#525252',
    fontSize: 16,
    fontFamily: 'OpenSans-600',
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
  overlay: {
    backgroundColor: '#000',
    opacity: 0.5,
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
  modalHeader: { textAlign: 'center', fontSize: 16 },
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
  currencyName: { textTransform: 'capitalize' },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
});

export default RequestFund;
