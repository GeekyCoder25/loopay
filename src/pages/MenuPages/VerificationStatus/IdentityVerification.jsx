/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
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
import { allCountries } from '../../../../utils/allCountries';
import Back from '../../../components/Back';

const IdentityVerification = ({ navigation }) => {
  const { vh } = useContext(AppContext);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorKey, setErrorKey] = useState(null);

  const fields = [
    {
      title: 'Country/Region of residence ',
      placeholder: 'Select Country of residence',
      id: 'country',
      type: 'select',
      apiUrl: 'https://jsonplaceholder.typicode.com/todos',
      apiData: allCountries,
    },
    {
      title: 'ID type',
      placeholder: 'Select ID type',
      id: 'idType',
      type: 'select',
      apiUrl: 'https://jsonplaceholder.typicode.com/users',
      apiData: [
        // { name: 'Bank Verification Number (BVN)' },
        { name: 'National ID', type: 'photo' },
        // { name: 'Passport ID', type: 'photo' },
        { name: 'Driver License ID', type: 'photo' },
      ],
    },
  ];

  useEffect(() => {
    fields.forEach(element => {
      setFormData(prev => {
        return {
          ...prev,
          [element.id]: '',
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (Object.values(formData).includes('')) {
      setErrorMessage('Please provide all required fields');
      return setErrorKey(true);
    }
    formData.idType.type === 'photo'
      ? navigation.navigate('VerificationInformation', formData)
      : navigation.navigate('VerifyInput', formData);
  };

  return (
    <PageContainer padding justify={true}>
      <View
        style={{
          ...styles.container,
          minHeight: vh * 0.55,
        }}>
        <BoldText style={styles.headerText}>Identity Verification</BoldText>
        <View style={styles.body}>
          {fields.map(field => (
            <SelectInputField
              key={field.id}
              selectInput={field}
              setFormData={setFormData}
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
        <Button text="Next" onPress={handleNext} style={styles.button} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
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
  searchTextInputContainer: {
    paddingHorizontal: 3 + '%',
    marginBottom: 20,
  },
  searchTextInput: {
    borderWidth: 1,
    borderColor: '#E2F3F5',
    marginTop: 20,
    borderRadius: 5,
    height: 35,
    fontFamily: 'OpenSans-400',
    paddingLeft: 10,
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
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
  modalSelected: {
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
  button: {
    marginBottom: 15 + '%',
  },
});
export default IdentityVerification;

const SelectInputField = ({
  selectInput,
  setFormData,
  setErrorMessage,
  errorKey,
  setErrorKey,
}) => {
  const [selected, setSelected] = useState(false);
  const [modalData, setModalData] = useState([]);
  const { title, type, placeholder, id, apiUrl, apiData } = selectInput;
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

    if (type === 'select' && apiData) {
      setModalData(apiData);
    } else if (type === 'select' && apiUrl) {
      setModalDataFunc();
    }
  }, [apiData, apiUrl, type]);

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
        setFormData={setFormData}
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
  setFormData,
  isLocalLoading,
  setErrorMessage,
  setErrorKey,
  id,
}) => {
  const handleModalSelect = provider => {
    setSelected(provider.title || provider.name);
    setModalOpen(false);
    setErrorMessage(null);
    setErrorKey(null);
    setFormData(prev => {
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
      {id !== 'country' ? (
        <>
          <Pressable
            style={styles.overlay}
            onPress={() => setModalOpen(false)}
          />
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
                          selected === provider.title
                            ? '#e4e2e2'
                            : 'transparent',
                      }}
                      onPress={() => handleModalSelect(provider)}>
                      <BoldText>{provider.title || provider.name}</BoldText>
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
        </>
      ) : (
        <>
          <Back onPress={() => setModalOpen(false)} />
          <CountriesSelect
            modalData={modalData}
            selected={selected}
            handleModalSelect={handleModalSelect}
          />
        </>
      )}
    </Modal>
  );
};

export const CountriesSelect = ({
  modalData,
  selected,
  handleModalSelect,
  hideLocal,
}) => {
  const { appData } = useContext(AppContext);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [countries, setCountries] = useState(modalData);

  const handleSearchFocus = async () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearch = text => {
    const foundHistories = modalData.filter(data =>
      Object.values(data).toString().toLowerCase().includes(text.toLowerCase()),
    );
    setCountries(foundHistories);
  };

  return (
    <PageContainer paddingTop={5}>
      <View style={styles.searchTextInputContainer}>
        <TextInput
          style={{
            ...styles.searchTextInput,
          }}
          placeholder={isSearchFocused ? '' : 'Search'}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onChangeText={text => handleSearch(text)}
        />
      </View>
      <ScrollView>
        {countries.length ? (
          <View>
            {!hideLocal &&
              countries
                .filter(country => country.code === appData.country.code)
                .map(provider => (
                  <Country
                    key={provider.name}
                    provider={provider}
                    selected={selected}
                    handleModalSelect={handleModalSelect}
                  />
                ))}
            {countries
              .filter(country => country.code !== appData.country.code)
              .map(provider => (
                <Country
                  key={provider.name}
                  provider={provider}
                  selected={selected}
                  handleModalSelect={handleModalSelect}
                />
              ))}
          </View>
        ) : (
          <BoldText style={styles.error}>No country found</BoldText>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export const Country = ({ provider, selected, handleModalSelect }) => {
  return (
    <Pressable
      style={{
        ...styles.modalList,
        backgroundColor: selected === provider.name ? '#e4e2e2' : 'transparent',
      }}
      onPress={() => handleModalSelect(provider)}>
      <Image
        source={{
          uri: `https://flagcdn.com/w160/${provider.code.toLowerCase()}.png`,
        }}
        width={32}
        height={25}
        style={{ borderRadius: 5 }}
      />
      <BoldText style={styles.modalSelected}>
        {provider.title || provider.name}
      </BoldText>
    </Pressable>
  );
};
