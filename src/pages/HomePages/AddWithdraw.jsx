/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
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
import SendMenuHeader from '../SendMenuPages/Header';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';

const AddWithdraw = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    accNo: '',
  });
  const [errorKey, setErrorKey] = useState();
  const [needPin, setNeedPin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passowrdIsValid, setPassowrdIsValid] = useState(false);
  const [remembersPassword, setRemembersPassword] = useState(true);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);

  useEffect(() => {
    getFetchData('user/banks').then(response => {
      if (response.status === 200) {
        return setBanks(response.data);
      }
    });
  }, [selectedBank]);
  const formFields = [
    {
      label: 'Full Name',
      id: 'fullName',
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
    if (Object.values(formData).includes('')) {
      setErrorMessage('Please fill all required fields');
      return setErrorKey(true);
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
          setSuccessMessage(response.data.name);
          return setTimeout(() => {
            navigation.goBack();
          }, 2500);
        } else {
          throw new Error(response.data);
        }
      } catch (err) {
        setErrorMessage(err.message);
        // ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    };
    saveBank();
  };

  return (
    <PageContainer padding={true}>
      {!needPin ? (
        <View>
          <BoldText style={styles.header}>Add New Payment Account</BoldText>
          <View style={styles.form}>
            {formFields.map(field => (
              <AddBankFields
                field={field}
                key={field.id}
                errorKey={errorKey}
                setErrorKey={setErrorKey}
                setErrorMessage={setErrorMessage}
                formData={formData}
                setFormData={setFormData}
                showRedBorder={errorKey}
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
            <SuccessMessage successMessage={successMessage} />
            <ErrorMessage errorMessage={errorMessage} />
          </View>
          <Button text="Confirm" onPress={handleConfirm} />
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
    flex: 0.5,
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
    alignItems: 'flex-start',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
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
    // paddingTop: 40,
    paddingBottom: 20,
    textAlign: 'center',
  },
  bank: {
    // borderBottomWidth: 0.5,
  },
});
export default AddWithdraw;

const AddBankFields = ({
  field,
  errorKey,
  setErrorKey,
  setErrorMessage,
  formData,
  setFormData,
  showRedBorder,
}) => {
  const [inputFocus, setInputFocus] = useState(false);
  return (
    <View>
      <BoldText>{field.label}</BoldText>
      <View style={styles.textInputContainer}>
        <TextInput
          style={{
            ...styles.textInput,
            borderColor:
              errorKey === field.id ||
              (showRedBorder && formData[field.id] === '')
                ? 'red'
                : inputFocus
                ? '#000'
                : '#B1B1B1',
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
  const handleModal = () => {
    setModalOpen(false);
  };

  const handlePress = bank => {
    setSelectedBank(bank);
    setFormData(prev => {
      return { ...prev, bank };
    });
    setModalOpen(false);
    setErrorKey('');
    setErrorMessage('');
  };
  return (
    <Modal
      visible={modalOpen}
      animationType="slide"
      transparent
      onRequestClose={handleModal}>
      <SendMenuHeader onPress={handleModal} />
      <View style={styles.modalContainer}>
        <BoldText style={styles.bankTitle}>Select Bank</BoldText>
        <ScrollView>
          <View style={styles.modal}>
            {banks.length ? (
              banks.map(bank => (
                <Pressable
                  style={styles.bank}
                  key={bank.code}
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
