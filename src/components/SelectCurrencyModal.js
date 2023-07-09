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
import Plus from '../../assets/images/plus.svg';
import Button from './Button';
import { allCurrencies } from '../database/data';
import { AppContext } from './AppContext';
import RegularText from './fonts/RegularText';
import BoldText from './fonts/BoldText';
import FlagSelect from './FlagSelect';

const SelectCurrencyModal = ({ modalOpen, setModalOpen }) => {
  const { selectedCurrency, setSelectedCurrency } = useContext(AppContext);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const handleModal = () => {
    setModalOpen(false);
    setShowSearchBox(false);
  };
  const handlecurrencyChange = newSelect => {
    setSelectedCurrency(newSelect);
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
              {allCurrencies.map(currency => (
                <Pressable
                  key={currency.currency}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    ...styles.currency,
                    backgroundColor:
                      selectedCurrency.currency === currency.currency
                        ? '#e4e2e2'
                        : 'transparent',
                  }}
                  onPress={() => handlecurrencyChange(currency)}>
                  <View style={styles.currencyIcon}>
                    <FlagSelect country={currency.currency} />
                    <View>
                      <BoldText>{currency.acronym}</BoldText>
                      <RegularText style={styles.currencyName}>
                        {currency.currency}
                      </RegularText>
                    </View>
                  </View>
                  <RegularText style={styles.currencyAmount}>
                    {currency.amount}.00
                  </RegularText>
                </Pressable>
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
