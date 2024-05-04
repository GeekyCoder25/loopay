/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
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

const SendInternational = ({ navigation }) => {
  const { appData, selectedCurrency, setWalletRefresh, setIsLoading } =
    useContext(AppContext);
  const [currency, setCurrency] = useState(selectedCurrency);
  const [errorKey, setErrorKey] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    sendTo: '',
    toReceive: '',
  });
  const [openCurrencyModal, setOpenCurrencyModal] = useState(false);

  return (
    <>
      <Back onPress={() => navigation.goBack()} />
      <PageContainer padding paddingTop={10}>
        <AccInfoCard />
        <BoldText>Send International</BoldText>
        {openCurrencyModal && (
          <CurrenciesModal
            setOpenCurrencyModal={setOpenCurrencyModal}
            setFormData={setFormData}
          />
        )}
        <View style={styles.form}>
          <View>
            <RegularText style={styles.label}>You send</RegularText>
            <View style={styles.textInputContainer}>
              <View style={styles.textInputSymbolContainer}>
                <FlagSelect country={currency.currency} style={styles.flag} />
                <BoldText style={styles.textInputSymbol}>
                  {currency.acronym}
                </BoldText>
              </View>
              <TextInput
                style={{
                  ...styles.textInput,
                  paddingLeft: 80,
                  borderColor: errorKey === 'amountInput' ? 'red' : '#ccc',
                }}
                inputMode="decimal"
                value={formData.amount}
                onChangeText={text => {
                  setFormData(prev => {
                    return {
                      ...prev,
                      amount: text,
                    };
                  });
                }}
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
          <View style={styles.textInputContainer}>
            <RegularText style={styles.label}>Receiver Gets</RegularText>
            <View style={styles.textInputContainer}>
              {formData.sendTo ? (
                <View style={styles.textInput}>
                  <BoldText>{formData.sendTo.symbol}</BoldText>
                  <Pressable
                    style={styles.textInputRow}
                    onPress={() => setOpenCurrencyModal(true)}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w160/${formData.sendTo.code.slice(0, 2).toLowerCase()}.png`,
                      }}
                      width={20}
                      height={20}
                      style={{ borderRadius: 30, marginRight: -5 }}
                      resizeMode="contain"
                    />
                    <BoldText>{formData.sendTo.code}</BoldText>
                    <ChevronDown />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.textInput}
                  onPress={() => setOpenCurrencyModal(true)}>
                  <RegularText>Select currency to send to</RegularText>
                  <ChevronDown />
                </Pressable>
              )}
            </View>
          </View>
        </View>
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
  currencyModal: {},
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
});

const CurrenciesModal = ({ setOpenCurrencyModal, setFormData }) => {
  const currencies = Object.values(CurrencyFullDetails);

  const handleCurrencySelect = currencySelect => {
    setFormData(prev => {
      return {
        ...prev,
        sendTo: currencySelect,
      };
    });
    setOpenCurrencyModal(false);
  };
  return (
    <Modal
      onRequestClose={() => setOpenCurrencyModal(false)}
      style={styles.currencyModal}>
      <Back onPress={() => setOpenCurrencyModal(false)} />
      <ScrollView contentContainerStyle={styles.currencies}>
        {currencies.map(currency => (
          <Pressable
            key={currency.code}
            style={styles.currency}
            onPress={() => handleCurrencySelect(currency)}>
            <View style={{ ...styles.icon }}>
              <Image
                source={{
                  uri: `https://flagcdn.com/w160/${currency.code.slice(0, 2).toLowerCase()}.png`,
                }}
                width={32}
                height={25}
                style={{ borderRadius: 5 }}
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
