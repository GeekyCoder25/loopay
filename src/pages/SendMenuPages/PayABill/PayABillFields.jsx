/* eslint-disable react-native/no-inline-styles */
import {
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

export default function SelectInputfield({
  selectInput,
  setStateFields,
  customFunc,
  showBalance,
  setErrorMessage,
}) {
  const { selectedCurrency } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [selected, setSelected] = useState(false);
  const [modalData, setModalData] = useState([]);
  const { title, type, placeholder, id, apiUrl } = selectInput;
  const { balance } = wallet;
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const setModalDataFunc = async () => {
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        console.log(json.slice(0, 2));
        setModalData(json.slice(0, 20));
      } catch (error) {
        console.log(error.message);
      }
    };
    if (type === 'select' && apiUrl) {
      setModalDataFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{title}</Text>
        {showBalance && (
          <Text style={styles.label}>
            Balance:{' '}
            {selectedCurrency.symbol +
              addingDecimal(`${balance.toLocaleString()}`)}
          </Text>
        )}
      </View>
      {type === 'input' ? (
        <View style={styles.textInputContainer}>
          <TextInput
            style={{ ...styles.textInput, ...styles.textInputStyles }}
            inputMode="tel"
            onChangeText={text => {
              setErrorMessage(null);
              setStateFields(prev => {
                return {
                  ...prev,
                  [id]: text,
                };
              });
            }}
            placeholder={placeholder}
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
  id,
}) => {
  const handleModal = () => {
    setModalOpen(false);
  };

  const handleModalSelect = provider => {
    setSelected(provider.title);
    setModalOpen(false);
    setErrorMessage(null);
    setStateFields(prev => {
      return {
        ...prev,
        [id]: provider,
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
            {modalData.map(provider => (
              <Pressable
                key={provider.title}
                style={{
                  ...styles.modalList,
                  backgroundColor:
                    selected === provider.title ? '#e4e2e2' : 'transparent',
                }}
                onPress={() => handleModalSelect(provider)}>
                <BoldText style={styles.modalSelected}>
                  {provider.title}
                </BoldText>
              </Pressable>
            ))}
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
    alignItems: 'center',
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
