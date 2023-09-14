/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import CheckPassword from '../../components/CheckPassword';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import LoggedInForgetPassword from '../../components/LoggedInForgetPassword';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import RegularText from '../../components/fonts/RegularText';
import Back from '../../components/Back';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import ErrorMessage from '../../components/ErrorMessage';
import ToastMessage from '../../components/ToastMessage';

const AddWithdraw = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    accNo: '',
  });
  const [errorKey, setErrorKey] = useState();
  const [needPin, setNeedPin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [passowrdIsValid, setPassowrdIsValid] = useState(false);
  const [remembersPassword, setRemembersPassword] = useState(true);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (!banks.length) {
      getFetchData('user/banks').then(response => {
        if (response.status === 200) {
          return setBanks(response.data);
        }
      });
    }
  }, [banks.length, showBankModal]);
  const formFields = [
    {
      label: 'Full Name',
      id: 'fullName',
      disabled: true,
    },
    {
      label: 'Bank account Number',
      id: 'accNo',
      keyboard: 'numeric',
    },
    // {
    //   label: 'Account Opening Branch (Optional)',
    //   id: 'branch',
    // },
  ];
  useEffect(() => {
    passowrdIsValid && setNeedPin(false);
  }, [formData, navigation, passowrdIsValid, selectedBank]);

  const handleConfirm = () => {
    if (formData.accNo === '') {
      setErrorMessage('Please provide you bank account number');
      return setErrorKey('accNo');
    }
    if (!selectedBank) {
      setErrorMessage('Please select a bank');
      return setErrorKey('bank');
    }

    const saveBank = async () => {
      try {
        const response = await postFetchData('user/savedbanks', {
          ...formData,
          bank: selectedBank,
        });
        if (response.status === 200) {
          setFullName(response.data.name);
        } else {
          throw new Error(response.data);
        }
      } catch (err) {
        setErrorMessage(err.message);
        setFullName('');
      }
    };
    fullName ? navigation.goBack() : saveBank();
  };

  return (
    <PageContainer padding={true}>
      {!needPin ? (
        <View>
          <BoldText style={styles.header}>Add New Payment Account</BoldText>
          <View style={styles.form}>
            {formFields.map(field => (
              <AddBankFields
                key={field.id}
                field={field}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                setErrorMessage={setErrorMessage}
                setFormData={setFormData}
                fullName={fullName}
              />
            ))}
            <BoldText>Bank Name</BoldText>
            <Pressable
              style={styles.textInputContainer}
              onPress={() => setShowBankModal(true)}>
              <View
                style={{
                  ...styles.bankInput,
                  borderColor: errorKey === 'bank' ? 'red' : '#B1B1B1',
                }}>
                <BoldText>{selectedBank?.name || 'Choose bank'}</BoldText>
                <ChevronDown />
              </View>
            </Pressable>
            <BanksModal
              modalOpen={showBankModal}
              setModalOpen={setShowBankModal}
              banks={banks}
              setSelectedBank={setSelectedBank}
              setFormData={setFormData}
              setErrorKey={setErrorKey}
              setErrorMessage={setErrorMessage}
            />
            <ErrorMessage errorMessage={errorMessage} />
          </View>
          <Button
            text={fullName ? 'Add Bank' : 'Confirm'}
            onPress={handleConfirm}
          />
        </View>
      ) : (
        <View style={styles.password}>
          <View style={styles.logo}>
            <Logo />
          </View>
          {remembersPassword ? (
            <CheckPassword
              setPassowrdIsValid={setPassowrdIsValid}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              errorKey={errorKey}
              setErrorKey={setErrorKey}
              setRemembersPassword={setRemembersPassword}
              header={
                <Header
                  title="Input Password"
                  text="Kindly input your current password below to continue."
                />
              }
            />
          ) : (
            <LoggedInForgetPassword setPassowrdIsValid={setPassowrdIsValid} />
          )}
        </View>
      )}
    </PageContainer>
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
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 10,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
    color: '#000',
  },
  bankInput: {
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
export default AddWithdraw;

const AddBankFields = ({
  field,
  errorKey,
  setErrorKey,
  setErrorMessage,
  setFormData,
  fullName,
}) => {
  const [inputFocus, setInputFocus] = useState(false);
  return (
    <View>
      <BoldText>{field.label}</BoldText>
      {field.disabled ? (
        <Pressable
          style={styles.textInputContainer}
          onPress={() => {
            Keyboard.dismiss();
            field.disabled && ToastMessage('Your name will be generated');
          }}>
          <View style={styles.textInput}>
            <RegularText>{fullName}</RegularText>
          </View>
        </Pressable>
      ) : (
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              borderColor:
                errorKey === field.id ? 'red' : inputFocus ? '#000' : '#B1B1B1',
            }}
            onChangeText={text => {
              setErrorKey('');
              setErrorMessage('');
              setFormData(prev => {
                return { ...prev, [field.id]: text };
              });
            }}
            name={field.question}
            inputMode={field.keyboard}
            autoCapitalize="none"
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
          />
        </View>
      )}
    </View>
  );
};

const BanksModal = ({
  modalOpen,
  setModalOpen,
  banks,
  setSelectedBank,
  setFormData,
  setErrorKey,
  setErrorMessage,
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
            {isSearching ? (
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
