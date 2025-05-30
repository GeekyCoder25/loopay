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
import { useContext, useState } from 'react';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import { AppContext } from '../../../components/AppContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import { useWalletContext } from '../../../context/WalletContext';
import { randomUUID } from 'expo-crypto';
import { setShowBalance } from '../../../../utils/storage';
import ToastMessage from '../../../components/ToastMessage';

export default function SelectInputField({
  selectInput,
  fields,
  stateFields,
  setStateFields,
  showBalance,
  errorKey,
  setErrorMessage,
  setErrorKey,
  selectedCurrency,
  modalData,
  onChange,
  onRefetch,
  setGlobalApiBody,
  showModalPrice,
}) {
  const { showAmount, setShowAmount } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [selected, setSelected] = useState(false);
  const { title, type, placeholder, id, inputMode } = selectInput;
  const [modalOpen, setModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleBlur = () => {
    if (id === 'amount') {
      setInputText(prev => addingDecimal(prev));
      setStateFields(prev => {
        return {
          ...prev,
          [id]: addingDecimal(inputText),
        };
      });
      if (Number(inputText) > wallet[`${selectedCurrency.currency}Balance`]) {
        setErrorKey('amount');
        setErrorMessage('Insufficient funds');
      }
      onChange({ inputText });
    }
    onChange && onChange({ inputText });
  };
  const handleOpenModal = () => {
    const currentIndex = Object.keys(stateFields).indexOf(id);
    const previousIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
    const previousValue = Object.values(stateFields)[previousIndex];
    const previousTitle = fields[previousIndex].title;
    const previousID = fields[previousIndex].id;
    if (!previousValue && currentIndex !== 0) {
      return ToastMessage(
        `Please select ${previousTitle.toLowerCase()} field first`,
      );
    }

    !modalData.length &&
      onRefetch &&
      onRefetch({ inputText: stateFields[previousID] });
    setModalOpen(true);
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  const handleChangeText = text => {
    const currentIndex = Object.keys(stateFields).indexOf(id);
    const previousIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
    const previousValue = Object.values(stateFields)[previousIndex];
    const previousTitle = fields[previousIndex].title;
    const previousType = fields[previousIndex].type;
    const previousID = fields[previousIndex].id;

    if (!previousValue && currentIndex !== 0) {
      return ToastMessage(
        previousType === 'select'
          ? `Please select ${previousTitle.toLowerCase()} field first`
          : `Please input ${previousTitle.toLowerCase()} field first`,
      );
    }
    !modalData.length &&
      text.length === 1 &&
      onRefetch &&
      onRefetch({ inputText: stateFields[previousID] });

    setInputText(text);
    setErrorMessage(null);
    setErrorKey(null);
    setStateFields(prev => {
      return {
        ...prev,
        [id]: text,
      };
    });
  };

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{title}</Text>
        <Pressable onPress={handleShow}>
          {showBalance && (
            <Text style={styles.label}>
              Balance:{' '}
              {showAmount
                ? selectedCurrency?.symbol +
                  addingDecimal(
                    `${wallet[
                      `${selectedCurrency.currency}Balance`
                    ]?.toLocaleString()}`,
                  )
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
            inputMode={inputMode || 'tel'}
            onChangeText={text => handleChangeText(text)}
            placeholder={placeholder}
            onBlur={handleBlur}
            value={inputText || ''}
          />
        </View>
      ) : (
        <>
          <View style={styles.textInputContainer}>
            <Pressable
              onPress={handleOpenModal}
              style={styles.textInputContainer}>
              <View style={styles.textInput}>
                {selected ? (
                  <BoldText style={styles.modalTitle}>{selected}</BoldText>
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
            onChange={onChange}
            setGlobalApiBody={setGlobalApiBody}
            showModalPrice={showModalPrice}
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
  onChange,
  setGlobalApiBody,
  showModalPrice,
  id,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleModal = () => {
    setModalOpen(false);
  };

  const handleModalSelect = provider => {
    setSelected(provider.title || provider.name);
    setModalOpen(false);
    setErrorMessage(null);
    setErrorKey(null);
    onChange && onChange(provider);
    setGlobalApiBody(prev => {
      return {
        ...prev,
        ...provider,
      };
    });
    setStateFields(prev => {
      const body = {
        ...prev,
        [id]: provider,
        referenceId: randomUUID(),
      };

      if (showModalPrice) {
        body.amount = provider.price;
      }
      return body;
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
              <>
                <View style={styles.searchInputContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor={'#888'}
                    onChangeText={text => setSearchQuery(text)}
                    value={searchQuery}
                  />
                </View>
                {modalData
                  .filter(provider => {
                    if (searchQuery) {
                      return Object.values(provider)
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
                    }
                    return true;
                  })
                  .map(provider => (
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
                      <View style={styles.modalListRow}>
                        <BoldText>
                          {showModalPrice &&
                            '₦' +
                              Number(provider.price)?.toLocaleString() +
                              ' - '}
                        </BoldText>
                        <BoldText style={styles.modalTitle}>
                          {provider.title || provider.name}
                        </BoldText>
                      </View>
                    </Pressable>
                  ))}
              </>
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
    color: '#000000',
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
  modalTitle: {
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
  searchInputContainer: {
    marginHorizontal: 5 + '%',
    marginBottom: 30,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 15,
    height: 40,
    paddingHorizontal: 10,
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
    paddingVertical: 15,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  modalListRow: {
    flexDirection: 'row',
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
