/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import Back from '../../../components/Back';

export const AddBankFields = ({
  field,
  errorKey,
  setErrorKey,
  setErrorMessage,
  setFormData,
}) => {
  const [inputFocus, setInputFocus] = useState(false);

  const handleChange = text => {
    setErrorKey('');
    setErrorMessage('');
    setFormData(prev => {
      return { ...prev, [field.id]: text };
    });
  };

  return (
    <View>
      <BoldText>{field.label}</BoldText>
      <View style={styles.textInputContainer}>
        <TextInput
          style={{
            ...styles.textInput,
            borderColor:
              errorKey === field.id ? 'red' : inputFocus ? '#000' : '#B1B1B1',
          }}
          onChangeText={text => handleChange(text)}
          name={field.question}
          inputMode={field.keyboard}
          autoCapitalize="none"
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          maxLength={10}
        />
      </View>
    </View>
  );
};

export const BanksModal = ({
  modalOpen,
  setModalOpen,
  banks,
  setSelectedBank,
  setFormData,
  setErrorKey,
  setErrorMessage,
  noBanks,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchBanks, setSearchBanks] = useState([]);
  const handleModal = () => {
    setModalOpen(false);
    setIsSearching(false);
  };

  const handlePress = bank => {
    setSelectedBank(bank);
    setFormData(prev => {
      return { ...prev, bank };
    });
    setModalOpen(false);
    setIsSearching(false);
    setErrorKey('');
    setErrorMessage('');
  };
  const handleSearch = text => {
    text ? setIsSearching(true) : setIsSearching(false);
    const foundBanks = banks.map(
      bank => bank.name.toLowerCase().includes(text.toLowerCase()) && bank,
    );
    setSearchBanks(foundBanks);
  };

  return (
    <Modal
      visible={modalOpen}
      animationType="slide"
      transparent
      onRequestClose={handleModal}>
      <Back onPress={handleModal} />
      <View style={styles.modalContainer}>
        <BoldText style={styles.bankTitle}>Select Bank</BoldText>
        <TextInput
          style={styles.searchInput}
          inputMode="search"
          onChangeText={text => handleSearch(text)}
        />
        <ScrollView>
          <View style={styles.modal}>
            {noBanks ? (
              <View>
                <RegularText>{`${noBanks}`}</RegularText>
              </View>
            ) : isSearching ? (
              searchBanks.map(
                (bank, index) =>
                  bank && (
                    <Pressable
                      style={styles.bank}
                      key={bank.code + index}
                      onPress={() => handlePress(bank)}>
                      <RegularText>{bank.name}</RegularText>
                    </Pressable>
                  ),
              )
            ) : banks.length ? (
              banks.map((bank, index) => (
                <Pressable
                  style={styles.bank}
                  key={bank.code + index}
                  onPress={() => handlePress(bank)}>
                  <RegularText>{bank.name}</RegularText>
                </Pressable>
              ))
            ) : (
              <RegularText>Loading..</RegularText>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
  },
  password: {
    flex: 1,
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    paddingVertical: 30,
    minHeight: 150,
    paddingHorizontal: 2 + '%',
  },
  textInputContainer: {
    marginTop: 5,
    marginBottom: 30,
  },
  textInput: {
    color: '#000000',
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 10,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
  },

  modalContainer: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingHorizontal: 5 + '%',
    flex: 1,
  },
  modal: {
    paddingBottom: 30,
    gap: 30,
  },
  bankTitle: {
    paddingBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    width: 100 + '%',
    height: 35,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
    borderRadius: 4,
    fontFamily: 'OpenSans-600',
    marginBottom: 25,
    borderColor: '#b1b1b1',
  },
  bank: {
    borderBottomWidth: 1,
    borderColor: '#DCDCDC',
    paddingBottom: 20,
  },
});
