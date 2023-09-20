/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
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
import { AppContext } from '../../../components/AppContext';
import ErrorMessage from '../../../components/ErrorMessage';
import { postFetchData } from '../../../../utils/fetchAPI';

const BuyAirtime = ({ navigation }) => {
  const { selectedCurrency, appData } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [networkToBuy, setNetworkToBuy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [formData, setFormData] = useState({
    network: '',
    amount: '',
    phoneNo: '',
  });
  const { balance } = wallet;
  const airtimeBeneficiaries = [
    // {
    //   phoneNo: '09073002599',
    //   network: 'airtel',
    // },
    // {
    //   phoneNo: '+2349054343663',
    //   network: '9mobile',
    // },
    // {
    //   phoneNo: '09066487855',
    //   network: 'mtn',
    // },
    // {
    //   phoneNo: '09063555855',
    //   network: 'glo',
    // },
  ];

  useEffect(() => {
    setErrorMessage2('');
  }, [formData]);

  const networkProviders = [
    { network: 'mtn', locale: 'ng' },
    { network: 'airtel', locale: 'ng' },
    { network: 'glo', locale: 'ng' },
    { network: '9mobile', locale: 'ng' },
  ];

  const handleModal = () => {
    setModalOpen(prev => !prev);
  };

  const handleNetworkSelect = provider => {
    handleModal();
    setNetworkToBuy({ network: provider.network, locale: provider.locale });
    setFormData(prev => {
      return { ...prev, network: provider.network };
    });
  };

  const handleAmountInput = amount => {
    setAmountInput(amount);
    if (amount > balance) {
      setErrorMessage('Insufficient Funds');
      setErrorKey('amountInput');
    } else {
      setErrorMessage('');
      setErrorKey('');
      setFormData(prev => {
        return { ...prev, amount };
      });
    }
  };

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
    if (amountInput < 50) {
      setErrorMessage(
        `Minimum recharge amount is ${selectedCurrency.symbol}${50}`,
      );
      setErrorKey('amountInput');
    }
  };

  const handlePhoneInput = phoneNo => {
    setFormData(prev => {
      return { ...prev, phoneNo };
    });
  };

  const handleInputPin = async () => {
    if (Object.values(formData).includes('')) {
      return setErrorMessage2(
        'Please provide all required fields before progressing',
      );
    }

    if (!appData.pin) {
      await postFetchData('auth/forget-password', {
        email: appData.email,
        otpCodeLength: 6,
      });
    }
    navigation.navigate('TransferAirtime', { formData });
  };

  const networkProvidersIcon = network => {
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
        <BoldText style={styles.headerText}>Buy Airtime</BoldText>
        <RegularText style={styles.headerSubText}>Network</RegularText>
        <Pressable
          onPress={() => setModalOpen(true)}
          style={styles.textInputContainer}>
          <View style={{ ...styles.textInput, height: 60, paddingLeft: 5 }}>
            {networkToBuy ? (
              <View style={styles.networkToBuySelected}>
                {networkToBuy && networkProvidersIcon(networkToBuy.network)}
                <BoldText style={styles.networkToBuySelected}>
                  {networkToBuy.network} - {networkToBuy.locale}
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
          onRequestClose={handleModal}>
          <Pressable style={styles.overlay} onPress={handleModal} />
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
                      <View style={styles.networkIcon}>
                        {networkProvidersIcon(provider.network)}
                      </View>
                      <BoldText style={styles.networkToBuySelected}>
                        {`${provider.network}-${provider.locale}`}
                      </BoldText>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <View style={styles.topUpContainer}>
          <Text style={styles.topUp}>Amount to be credited</Text>
          <Text style={styles.topUp}>
            Balance:{' '}
            {selectedCurrency.symbol +
              addingDecimal(`${balance.toLocaleString()}`)}
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              ...styles.textInputStyles,
              borderColor: errorKey === 'amountInput' ? 'red' : '#ccc',
            }}
            inputMode="numeric"
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

        <Text style={styles.topUp}>Phone Number</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{ ...styles.textInput, ...styles.textInputStyles }}
            inputMode="tel"
            onChangeText={text => handlePhoneInput(text)}
            value={formData.phoneNo}
          />
        </View>
        <ErrorMessage errorMessage={errorMessage2} />

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
  topUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topUp: {
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
  modalListIcon: {
    gap: 20,
    flexDirection: 'row',
  },
  currencyAmount: {
    fontSize: 22,
    paddingRight: 10,
  },
});
export default BuyAirtime;

const Beneficiary = ({ beneficiary, networkProvidersIcon }) => {
  return (
    <Pressable style={styles.beneficiary}>
      {networkProvidersIcon(beneficiary.network)}
      <RegularText style={styles.phoneNo}>{beneficiary.phoneNo}</RegularText>
    </Pressable>
  );
};
