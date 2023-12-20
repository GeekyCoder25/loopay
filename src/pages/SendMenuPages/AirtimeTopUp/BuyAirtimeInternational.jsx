/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RegularText from '../../../components/fonts/RegularText';
import BoldText from '../../../components/fonts/BoldText';
import GLOIcon from '../../../../assets/images/glo.svg';
import MTNIcon from '../../../../assets/images/mtn.svg';
import AirtelIcon from '../../../../assets/images/airtel.svg';
import NineMobileIcon from '../../../../assets/images/9mobile.svg';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import Button from '../../../components/Button';
import { useWalletContext } from '../../../context/WalletContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import ErrorMessage from '../../../components/ErrorMessage';
import { randomUUID } from 'expo-crypto';
import { getFetchData } from '../../../../utils/fetchAPI';
import { AppContext } from '../../../components/AppContext';
import { allCurrencies } from '../../../database/data';
import { CountriesSelect } from '../../MenuPages/VerificationStatus/IdentityVerification';
import { allCountries } from '../../../../utils/allCountries';
import ToastMessage from '../../../components/ToastMessage';
import { setShowBalance } from '../../../../utils/storage';

const BuyAirtimeInternational = ({ navigation }) => {
  const { appData, setIsLoading, showAmount, setShowAmount } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const countryCode = appData.country.code;
  const [modalOpen, setModalOpen] = useState(false);
  const [networkToBuy, setNetworkToBuy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [countrySelected, setCountrySelected] = useState('');
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [networkProviders, setNetworkProviders] = useState([]);
  const [formData, setFormData] = useState({
    network: '',
    amount: '',
    phoneNo: '',
  });
  const { localBalance } = wallet;
  const airtimeBeneficiaries = [
    // {
    //   phoneNo: '09073002599',
    //   network: 'airtel',
    // },
  ];

  useEffect(() => {
    setErrorMessage('');
  }, [formData]);
  useEffect(() => {
    const getInternationalOperators = async () => {
      try {
        setIsLoading(true);
        const response = await getFetchData(
          `user/airtime/operators?country=${countrySelected.code}`,
        );
        if (response.status === 200) {
          const data = response.data.map(
            ({ name, operatorId, logoUrls, minAmount }) => {
              return {
                network: name,
                locale: '',
                operatorId,
                icon: logoUrls[0],
                minAmount,
              };
            },
          );
          return setNetworkProviders(data);
        }
        throw new Error(response.data);
      } catch (err) {
        ToastMessage(err.message);
        setNetworkProviders([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (countrySelected) {
      getInternationalOperators();
    }
  }, [countrySelected, setIsLoading]);

  const handleNetworkModal = () => {
    setModalOpen(prev => !prev);
  };

  const handleNetworkSelect = provider => {
    setModalOpen(false);
    setNetworkToBuy(provider);
    setFormData(prev => {
      return {
        ...prev,
        ...provider,
      };
    });
  };

  const handleAmountInput = amount => {
    setAmountInput(amount);
    if (amount > localBalance) {
      setErrorMessage('Insufficient Funds');
      setErrorKey('amountInput');
    } else {
      setErrorMessage('');
      setErrorKey('');
    }
    setFormData(prev => {
      return { ...prev, amount };
    });
  };

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
    if (amountInput < formData.minAmount || 0) {
      setErrorMessage(
        `Minimum recharge amount is ${
          allCurrencies.find(currency => currency.isLocal).symbol +
          formData.minAmount
        }`,
      );
      setErrorKey('amountInput');
    }
  };

  const handlePhoneInput = async phoneNo => {
    setFormData(prev => {
      return { ...prev, phoneNo };
    });
    setErrorMessage('');
    setErrorKey('');
    if (phoneNo.length === 11) {
      const response = await getFetchData(
        `user/get-network?phone=${phoneNo}&country=${countryCode}`,
      );
      if (response.status === 200) {
        const network = response.data.name.toLowerCase();
        handleNetworkSelect(
          networkProviders.find(index => network.startsWith(index.network)),
        );
      }
    }
  };

  const handleInputPin = async () => {
    if (Object.values(formData).includes('')) {
      return setErrorMessage(
        'Please provide all required fields before progressing',
      );
    } else if (amountInput < (formData.minAmount || 0)) {
      setErrorMessage(
        `Minimum recharge amount is ${
          allCurrencies.find(currency => currency.isLocal).symbol +
          formData.minAmount
        }`,
      );
      return setErrorKey('amountInput');
    } else if (formData.amount > wallet.localBalance) {
      setErrorMessage('Insufficient balance');
      return setErrorKey('amountInput');
    }
    navigation.navigate('TransferAirtime', {
      formData: {
        ...formData,
        id: randomUUID(),
        currency: 'naira',
        countryCode,
        type: 'airtime',
      },
      isInternational: true,
    });
  };

  const handleCountrySelect = selected => {
    setCountrySelected(selected);
    setOpenCountryModal(false);
    setNetworkProviders([]);
    setNetworkToBuy('');
    setFormData(prev => {
      return {
        ...prev,
        network: '',
        operatorId: '',
        icon: '',
      };
    });
  };
  const handleOpenNetwork = () => {
    if (!countrySelected) return ToastMessage('Country not provided');
    setModalOpen(true);
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  const localCurrencySymbol = allCurrencies.find(
    currency => currency.isLocal,
  ).symbol;
  return (
    <PageContainer padding paddingTop={0}>
      <ScrollView style={styles.body}>
        <View style={styles.header}>
          <RegularText>Beneficiaries</RegularText>
          {airtimeBeneficiaries.length > 3 && (
            <RegularText>View all</RegularText>
          )}
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.beneficiaries}>
          {airtimeBeneficiaries.map(beneficiary => (
            <Beneficiary
              beneficiary={beneficiary}
              key={beneficiary.phoneNo}
              networkProvidersIcon={networkProvidersIcon}
            />
          ))}
        </ScrollView>
        <BoldText style={styles.headerText}>Buy International Airtime</BoldText>
        <RegularText style={styles.headerSubText}>Select Country</RegularText>
        <Pressable
          onPress={() => setOpenCountryModal(true)}
          style={styles.textInputContainer}>
          <View style={{ ...styles.textInput, height: 60, paddingLeft: 5 }}>
            {countrySelected ? (
              <View style={styles.networkToBuySelected}>
                <Image
                  source={{
                    uri: `https://flagcdn.com/w160/${countrySelected.code.toLowerCase()}.png`,
                  }}
                  width={32}
                  height={25}
                  style={{ borderRadius: 5 }}
                />
                <BoldText style={styles.networkToBuySelected}>
                  {countrySelected.name}
                </BoldText>
              </View>
            ) : (
              <RegularText style={styles.networkToBuy}>
                Select a Country
              </RegularText>
            )}
            <ChevronDown />
          </View>
        </Pressable>
        <Modal
          visible={openCountryModal}
          animationType="slide"
          transparent
          onRequestClose={() => setOpenCountryModal(false)}>
          <CountriesSelect
            modalData={allCountries}
            selected={countrySelected}
            handleModalSelect={selected => handleCountrySelect(selected)}
            hideLocal
          />
        </Modal>
        <RegularText style={styles.headerSubText}>Network</RegularText>
        <Pressable
          onPress={handleOpenNetwork}
          style={styles.textInputContainer}>
          <View style={{ ...styles.textInput, height: 60, paddingLeft: 5 }}>
            {networkToBuy ? (
              <View style={styles.networkToBuySelected}>
                {networkToBuy && countrySelected.code !== 'NG' ? (
                  <Image
                    source={{ uri: networkToBuy.icon }}
                    style={styles.networkIcon}
                  />
                ) : (
                  networkProvidersIcon(networkToBuy.network)
                )}
                <BoldText style={styles.networkToBuySelected}>
                  {networkToBuy.network}
                </BoldText>
              </View>
            ) : (
              <RegularText style={styles.networkToBuy}>
                Choose Network
              </RegularText>
            )}
            <ChevronDown />
          </View>
        </Pressable>
        <Modal
          visible={modalOpen}
          animationType="slide"
          transparent
          onRequestClose={handleNetworkModal}>
          <Pressable style={styles.overlay} onPress={handleNetworkModal} />
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.modalBorder} />
              <ScrollView style={{ width: 100 + '%' }}>
                <View style={styles.modalLists}>
                  {networkProviders.map(provider => (
                    <Pressable
                      key={provider.network}
                      style={{
                        ...styles.modalList,
                        backgroundColor:
                          networkToBuy?.network === provider.network
                            ? '#e4e2e2'
                            : 'transparent',
                      }}
                      onPress={() => handleNetworkSelect(provider)}>
                      <Image
                        source={{ uri: provider.icon }}
                        style={styles.networkIcon}
                      />
                      <BoldText style={styles.networkToBuySelected}>
                        {provider.network}
                      </BoldText>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              ...styles.textInputStyles,
              borderColor: errorKey === 'phoneInput' ? 'red' : '#ccc',
            }}
            inputMode="tel"
            onChangeText={text => handlePhoneInput(text)}
            value={formData.phoneNo}
          />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Amount to be credited</Text>
          <Pressable onPress={handleShow}>
            <Text style={styles.label}>
              Balance:{' '}
              {showAmount
                ? localCurrencySymbol +
                  addingDecimal(`${localBalance?.toLocaleString()}`)
                : '***'}
            </Text>
          </Pressable>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              ...styles.textInputStyles,
              borderColor: errorKey === 'amountInput' ? 'red' : '#ccc',
            }}
            inputMode="decimal"
            onChangeText={text => handleAmountInput(text)}
            onBlur={handleBlur}
            value={amountInput}
          />
          {errorMessage && (
            <View style={{ marginTop: 15 }}>
              <ErrorMessage errorMessage={errorMessage} />
            </View>
          )}
        </View>

        <Button text={'Buy Airtime'} onPress={handleInputPin} />
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    gap: 15,
    flex: 1,
    paddingHorizontal: 2 + '%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  beneficiaries: {
    flexDirection: 'row',
    marginTop: 20,
  },
  beneficiary: {
    alignItems: 'center',
    gap: 15,
    marginRight: 15,
  },
  phoneNo: {
    fontSize: 10,
  },
  headerText: {
    marginVertical: 30,
    fontSize: 20,
  },
  headerSubText: { color: '#868585' },
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
    marginBottom: 40,
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
  networkToBuySelected: {
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
    paddingVertical: 40,
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
  textHeader: {
    fontSize: 24,
  },
  bg: {
    position: 'absolute',
    width: 100 + '%',
    height: 100 + '%',
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
    gap: 20,
  },
  networkIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  modalListIcon: {
    gap: 20,
    flexDirection: 'row',
  },
  currencyAmount: {
    fontSize: 22,
    paddingRight: 10,
  },
});
export default BuyAirtimeInternational;

const Beneficiary = ({ beneficiary, networkProvidersIcon }) => {
  return (
    <Pressable style={styles.beneficiary}>
      {networkProvidersIcon(beneficiary.network)}
      <RegularText style={styles.phoneNo}>{beneficiary.phoneNo}</RegularText>
    </Pressable>
  );
};

export const networkProvidersIcon = network => {
  switch (network) {
    case 'glo':
      return <GLOIcon />;
    case 'mtn':
      return <MTNIcon />;
    case 'airtel':
      return <AirtelIcon />;
    case '9mobile':
      return <NineMobileIcon />;
    default:
      break;
  }
};
