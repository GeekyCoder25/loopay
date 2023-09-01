/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../components/AppContext';
import RegularText from '../../../components/fonts/RegularText';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import Button from '../../../components/Button';
import ErrorMessage from '../../../components/ErrorMessage';

const IdentitiyVerification = ({ navigation }) => {
  const { vh } = useContext(AppContext);
  const [stateFields, setStateFields] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorKey, setErrorKey] = useState(null);

  const fields = [
    {
      title: 'Country/Region of residence ',
      placeholder: 'Select Country of residence',
      id: 'country',
      type: 'select',
      apiUrl: 'https://jsonplaceholder.typicode.com/todos',
    },
    {
      title: 'ID type',
      placeholder: 'Select ID type',
      id: 'id',
      type: 'select',
      apiUrl: 'https://jsonplaceholder.typicode.com/users',
    },
  ];

  useEffect(() => {
    fields.forEach(element => {
      setStateFields(prev => {
        return {
          ...prev,
          [element.id]: '',
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (Object.values(stateFields).includes('')) {
      setErrorMessage('Please provide all required fields');
      return setErrorKey(true);
    }
    navigation.navigate('VerificationInformation');
  };

  return (
    <PageContainer PageContainer padding={true} justify={true}>
      <View
        style={{
          ...styles.container,
          minHeight: vh * 0.55,
        }}>
        <BoldText style={styles.headerText}>Identity Verification</BoldText>
        <View style={styles.body}>
          {fields.map(field => (
            <SelectInputfield
              key={field.id}
              selectInput={field}
              setStateFields={setStateFields}
              showBalance={field.balance}
              setErrorMessage={setErrorMessage}
              errorKey={errorKey}
              setErrorKey={setErrorKey}
            />
          ))}
          {errorMessage && (
            <View>
              <ErrorMessage errorMessage={errorMessage} />
            </View>
          )}
        </View>
        <Button text="Next" onPress={handleNext} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    color: '#525252',
  },
  body: {
    flex: 1,
    marginTop: 30,
  },
  label: {
    fontFamily: 'OpenSans-600',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 15,
  },
  textInput: {
    borderRadius: 5,
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    borderWidth: 0.5,
    borderColor: '#1e1e1e',
  },
  textInputStyles: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalSelected: {
    textTransform: 'capitalize',
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
    marginBottom: 10,
  },
  error: {
    textAlign: 'center',
  },
});
export default IdentitiyVerification;

const SelectInputfield = ({
  selectInput,
  setStateFields,
  setErrorMessage,
  errorKey,
  setErrorKey,
}) => {
  const [selected, setSelected] = useState(false);
  const [modalData, setModalData] = useState([]);
  const { title, type, placeholder, id, apiUrl } = selectInput;
  const [modalOpen, setModalOpen] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const setModalDataFunc = async () => {
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        json.forEach(i => {
          if (!i.title) i.title = i.name;
        });
        setModalData(json.slice(0, 20));
      } catch (error) {
        console.log(error.message);
        setIsLocalLoading(false);
      }
    };
    if (type === 'select' && apiUrl) {
      setModalDataFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View>
      <RegularText style={styles.label}>{title}</RegularText>
      <View style={styles.textInputContainer}>
        <Pressable
          onPress={() => setModalOpen(true)}
          style={styles.textInputContainer}>
          <View
            style={{
              ...styles.textInput,
              borderWidth: errorKey ? 1 : 0.5,
              borderColor: errorKey ? 'red' : '#1e1e1e',
            }}>
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
        isLocalLoading={isLocalLoading}
        id={id}
      />
    </View>
  );
};
const LocalModal = ({
  modalOpen,
  setModalOpen,
  modalData,
  selected,
  setSelected,
  setStateFields,
  isLocalLoading,
  setErrorMessage,
  setErrorKey,
  id,
}) => {
  const handleModalSelect = provider => {
    setSelected(provider.title);
    setModalOpen(false);
    setErrorMessage(null);
    setErrorKey(null);
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
      onRequestClose={() => setModalOpen(false)}>
      <Pressable style={styles.overlay} onPress={() => setModalOpen(false)} />
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <ScrollView>
            {modalData.length ? (
              modalData.map(provider => (
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
              ))
            ) : isLocalLoading ? (
              <ActivityIndicator
                size={'large'}
                color={'#1e1e1e'}
                style={styles.loading}
              />
            ) : (
              <BoldText style={styles.error}>
                Couldn&apos;t connect to server
              </BoldText>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
