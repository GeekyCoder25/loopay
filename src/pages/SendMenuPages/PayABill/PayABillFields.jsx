/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import { useContext, useEffect, useState } from 'react';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import { AppContext } from '../../../components/AppContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import { useWalletContext } from '../../../context/WalletContext';
import { getFetchData } from '../../../../utils/fetchAPI';
import { randomUUID } from 'expo-crypto';
import { allCurrencies } from '../../../database/data';
import { setShowBalance } from '../../../../utils/storage';

export default function SelectInputField({
  selectInput,
  setStateFields,
  customFunc,
  showBalance,
  errorKey,
  setErrorMessage,
  setErrorKey,
}) {
  const { showAmount, setShowAmount } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [selected, setSelected] = useState(false);
  const [modalData, setModalData] = useState([]);
  const { title, type, placeholder, id, apiUrl } = selectInput;
  const { localBalance } = wallet;
  const [modalOpen, setModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const setModalDataFunc = async () => {
      try {
        if (apiUrl.startsWith('https')) {
          const response = await fetch(apiUrl);
          const json = await response.json();
          console.log(json.slice(0, 2));
          return setModalData(json.slice(0, 20));
        }
        const response = await getFetchData(apiUrl);
        if (response.status === 200) {
          const data = response.data;
          return setModalData(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (type === 'select' && apiUrl) {
      setModalDataFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlur = () => {
    if (id === 'amount') {
      setInputText(prev => addingDecimal(prev));
      setStateFields(prev => {
        return {
          ...prev,
          [id]: addingDecimal(inputText),
        };
      });
    }
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };
  const localCurrencySymbol = allCurrencies.find(
    currency => currency.isLocal,
  ).symbol;

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{title}</Text>
        <Pressable onPress={handleShow}>
          {showBalance && (
            <Text style={styles.label}>
              Balance:{' '}
              {showAmount
                ? localCurrencySymbol +
                  addingDecimal(`${localBalance?.toLocaleString()}`)
                : '***'}
            </Text>
          )}
        </Pressable>
      </View>
      {type === 'input' ? (
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              ...styles.textInputStyles,
              borderColor: errorKey === id ? 'red' : '#ccc',
            }}
            inputMode="tel"
            onChangeText={text => {
              setInputText(text);
              setErrorMessage(null);
              setErrorKey(null);
              setStateFields(prev => {
                return {
                  ...prev,
                  [id]: text,
                };
              });
            }}
            placeholder={placeholder}
            onBlur={handleBlur}
            value={inputText}
          />
        </View>
      ) : (
        <>
          <View style={styles.textInputContainer}>
            <Pressable
              onPress={() => setModalOpen(true)}
              style={styles.textInputContainer}>
              <View style={styles.textInput}>
                {selected ? (
                  <BoldText style={styles.modalSelected}>{selected}</BoldText>
                ) : (
                  <RegularText style={styles.networkToBuy}>
                    {placeholder}
                  </RegularText>
                )}
                <ChevronDown />
              </View>
            </Pressable>
          </View>
          <LocalModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            selected={selected}
            setSelected={setSelected}
            modalData={modalData}
            setStateFields={setStateFields}
            setErrorMessage={setErrorMessage}
            setErrorKey={setErrorKey}
            id={id}
          />
        </>
      )}
    </View>
  );
}

const LocalModal = ({
  modalData,
  modalOpen,
  setModalOpen,
  selected,
  setSelected,
  setStateFields,
  setErrorMessage,
  setErrorKey,
  id,
}) => {
  const handleModal = () => {
    setModalOpen(false);
  };

  const handleModalSelect = provider => {
    setSelected(provider.title || provider.name);
    setModalOpen(false);
    setErrorMessage(null);
    setErrorKey(null);
    setStateFields(prev => {
      return {
        ...prev,
        [id]: provider,
        referenceId: randomUUID(),
      };
    });
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
          <ScrollView>
            {modalData.length ? (
              modalData.map(provider => (
                <Pressable
                  key={provider.title || provider.name}
                  style={{
                    ...styles.modalList,
                    backgroundColor:
                      selected === (provider.title || provider.name)
                        ? '#e4e2e2'
                        : 'transparent',
                  }}
                  onPress={() => handleModalSelect(provider)}>
                  <BoldText style={styles.modalSelected}>
                    {provider.title || provider.name}
                  </BoldText>
                </Pressable>
              ))
            ) : (
              <ActivityIndicator
                color={'#1e1e1e'}
                style={styles.activity}
                size="large"
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 12,
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
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalSelected: {
    textTransform: 'uppercase',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  networkToBuy: {
    color: '#525252',
    fontFamily: 'OpenSans-600',
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.5,
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
    gap: 10,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  modalLists: {
    flex: 1,
    gap: 20,
  },
  modalList: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5 + '%',
    paddingVertical: 10,
    gap: 20,
  },
  textHeader: {
    fontSize: 24,
  },
  bg: {
    position: 'absolute',
    width: 100 + '%',
    height: 100 + '%',
  },
});
