/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Search from '../../assets/images/search.svg';
import { allCurrencies } from '../database/data';
import { AppContext } from './AppContext';
import RegularText from './fonts/RegularText';
import BoldText from './fonts/BoldText';
import FlagSelect from './FlagSelect';
import { addingDecimal } from '../../utils/AddingZero';
import { setDefaultCurrency, setShowBalance } from '../../utils/storage';
import { useWalletContext } from '../context/WalletContext';
import Button from './Button';
import Plus from '../../assets/images/plus.svg';

const SelectCurrencyModal = ({ modalOpen, setModalOpen }) => {
  const { selectedCurrency } = useContext(AppContext);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const handleModal = () => {
    setModalOpen(false);
    setShowSearchBox(false);
  };

  return (
    <Modal
      visible={modalOpen}
      animationType="slide"
      transparent
      onRequestClose={handleModal}>
      <Pressable style={styles.overlay} onPress={handleModal} />
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Image
            style={styles.bg}
            source={require('../../assets/images/pageBg.png')}
          />
          <View style={styles.modalBorder} />
          <View style={styles.modalHeader}>
            <RegularText style={styles.textHeader}>Accounts</RegularText>
            <Pressable onPress={() => setShowSearchBox(true)}>
              <Search />
            </Pressable>
          </View>
          {showSearchBox && (
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="Search Currency"
                style={styles.textInput}
              />
            </View>
          )}
          <ScrollView style={{ width: 100 + '%' }}>
            <View style={styles.currencies}>
              {allCurrencies
                .filter(
                  currency =>
                    currency.currency === selectedCurrency.currency &&
                    currency.status === 'active',
                )
                .map(selected => (
                  <Currency
                    key={selected.currency}
                    selected={selected}
                    setModalOpen={setModalOpen}
                    setShowSearchBox={setShowSearchBox}
                  />
                ))}
              {allCurrencies
                .filter(
                  currency =>
                    currency.currency !== selectedCurrency.currency &&
                    currency.status === 'active',
                )
                .map(selected => (
                  <Currency
                    key={selected.currency}
                    selected={selected}
                    setModalOpen={setModalOpen}
                    setShowSearchBox={setShowSearchBox}
                  />
                ))}
            </View>
          </ScrollView>
          <Button text={'Add Account'} Icon={<Plus />} />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
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
    maxHeight: 700,
    width: 100 + '%',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingTop: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    alignItems: 'center',
    gap: 30,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  modalHeader: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5 + '%',
  },
  textHeader: {
    fontSize: 24,
  },
  bg: {
    position: 'absolute',
    width: 100 + '%',
    height: 100 + '%',
  },
  textInputContainer: {
    width: 100 + '%',
    paddingHorizontal: 5 + '%',
  },
  textInput: {
    borderColor: 'rgba(0,0,0,0.7)',
    borderWidth: 2,
    paddingHorizontal: 14,
    borderRadius: 15,
    height: 50,
    fontFamily: 'OpenSans-600',
  },
  currencies: {
    flex: 1,
  },
  currency: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  currencyIcon: {
    gap: 20,
    flexDirection: 'row',
    flex: 1,
  },
  currencyName: {
    textTransform: 'capitalize',
  },
  currencyAmount: {
    fontSize: 22,
    paddingRight: 10,
  },
});
export default SelectCurrencyModal;

const Currency = ({ selected, setModalOpen, setShowSearchBox }) => {
  const { wallet } = useWalletContext();
  const { selectedCurrency, setSelectedCurrency, showAmount, setShowAmount } =
    useContext(AppContext);

  const handleCurrencyChange = async newSelect => {
    setShowSearchBox(false);
    setModalOpen(false);
    setSelectedCurrency(newSelect);
    await setDefaultCurrency(`${newSelect.currency}`);
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  return (
    <Pressable
      key={selected.currency}
      style={{
        ...styles.currency,
        backgroundColor:
          selectedCurrency.currency === selected.currency
            ? '#e4e2e2'
            : 'transparent',
      }}
      onPress={() => handleCurrencyChange(selected)}>
      <View style={styles.currencyIcon}>
        <FlagSelect country={selected.currency} />
        <View>
          <BoldText>{selected.acronym}</BoldText>
          <RegularText style={styles.currencyName}>
            {selected.currency}
          </RegularText>
        </View>
      </View>
      {wallet && (
        <Pressable onPress={handleShow}>
          <RegularText style={styles.currencyAmount}>
            {showAmount
              ? addingDecimal(
                  wallet[`${selected.currency}Balance`]?.toLocaleString(),
                )
              : '***'}
          </RegularText>
        </Pressable>
      )}
    </Pressable>
  );
};
