/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
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
import RegularText from '../../../components/fonts/RegularText';
import BoldText from '../../../components/fonts/BoldText';
import GLOIcon from '../../../../assets/images/glo.svg';
import MTNIcon from '../../../../assets/images/mtn.svg';
import AirtelIcon from '../../../../assets/images/airtel.svg';
import NineMobileIcon from '../../../../assets/images/9mobile.svg';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import Button from '../../../components/Button';
import ErrorMessage from '../../../components/ErrorMessage';
import { randomUUID } from 'expo-crypto';
import { getFetchData } from '../../../../utils/fetchAPI';
import ToastMessage from '../../../components/ToastMessage';
import { useWalletContext } from '../../../context/WalletContext';
import { AppContext } from '../../../components/AppContext';

const BuyData = ({ navigation }) => {
  const { appData } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [networkToBuy, setNetworkToBuy] = useState(null);
  const [dataPlans, setDataPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [formData, setFormData] = useState({
    network: '',
    phoneNo: '',
    plan: null,
  });
  const [planToBuy, setPlanToBuy] = useState(formData.plan);
  const countryCode = appData.country.code;
  const dataBeneficiaries = [
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

  const networkProviders = [
    { network: '9mobile', locale: 'ng', operatorId: 340 },
    { network: 'mtn', locale: 'ng', operatorId: 341 },
    { network: 'airtel', locale: 'ng', operatorId: 342 },
    { network: 'glo', locale: 'ng', operatorId: 344 },
  ];

  const handleModal = () => {
    setModalOpen(false);
    setPlanModalOpen(false);
  };
  const handleNetworkSelect = async provider => {
    handleModal();
    setNetworkToBuy(provider);
    setPlanToBuy(null);
    setFormData(prev => {
      return {
        ...prev,
        network: provider.network,
        plan: null,
      };
    });
    setErrorMessage('');
    setErrorKey('');
    const plansResponse = await getFetchData(
      `user/get-data-plans?provider=${provider.network}&country=${countryCode}`,
    );
    const plans = plansResponse.data;
    console.log(plansResponse);
    setDataPlans(plans || []);
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
        const operator = networkProviders.find(index =>
          network.startsWith(index.network),
        );
        handleNetworkSelect(operator);
      }
    }
  };

  const handlePlanModal = () => {
    if (!formData.network) {
      return ToastMessage('Please select a network first');
    }
    setPlanModalOpen(true);
  };

  const handlePlanSelect = plan => {
    setFormData(prev => {
      return {
        ...prev,
        plan,
        amount: plan.amount,
        operatorId: plan.operatorId,
      };
    });
    setPlanToBuy(`${Math.ceil(plan.amount).toLocaleString()} - ${plan.value}`);
    setPlanModalOpen(false);
    setErrorMessage('');
    setErrorKey('');
  };

  const handleInputPin = async () => {
    if (Object.values(formData).includes('')) {
      return setErrorMessage(
        'Please provide all required fields before progressing',
      );
    } else if (!formData.plan) {
      setErrorMessage('Please select a data plan');
      return setErrorKey('amountInput');
    } else if (formData.phoneNo.length < 11) {
      setErrorMessage('Incomplete phone number');
      return setErrorKey('phoneInput');
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
        type: 'data',
      },
    });
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
          {dataBeneficiaries.length > 3 && <RegularText>View all</RegularText>}
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.beneficiaries}>
          {dataBeneficiaries.map(beneficiary => (
            <Beneficiary
              beneficiary={beneficiary}
              key={beneficiary.phoneNo}
              networkProvidersIcon={networkProvidersIcon}
            />
          ))}
        </ScrollView>
        <BoldText style={styles.headerText}>Buy Data Bundle</BoldText>
        <RegularText style={styles.headerSubText}>Select a Network</RegularText>
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
          visible={modalOpen || planModalOpen}
          animationType="slide"
          transparent
          onRequestClose={handleModal}>
          <Pressable style={styles.overlay} onPress={handleModal} />
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.modalBorder} />
              <ScrollView style={{ width: 100 + '%' }}>
                <View style={styles.modalLists}>
                  {modalOpen ? (
                    networkProviders.map(provider => (
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
                    ))
                  ) : dataPlans.length ? (
                    dataPlans.map(plan => (
                      <Pressable
                        key={plan.value}
                        style={{
                          ...styles.modalList,
                          backgroundColor:
                            planToBuy === plan ? '#e4e2e2' : 'transparent',
                        }}
                        onPress={() => handlePlanSelect(plan)}>
                        <BoldText style={styles.dataPlan}>
                          {Math.ceil(plan.amount).toLocaleString()} -{' '}
                          {plan.value}
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
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Text style={styles.label}>Enter Phone Number</Text>
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
            maxLength={11}
          />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Choose a Plan</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Pressable
            onPress={handlePlanModal}
            style={styles.textInputContainer}>
            <View
              style={{
                ...styles.textInput,
                ...styles.textInputStyles,
                borderColor: errorKey === 'amountInput' ? 'red' : '#f9f9f9',
              }}>
              {planToBuy ? (
                <BoldText style={styles.networkToBuySelected}>
                  {planToBuy}
                </BoldText>
              ) : (
                <RegularText style={styles.networkToBuy}>
                  Choose a Plan
                </RegularText>
              )}
              <ChevronDown />
            </View>
          </Pressable>
          {errorMessage && (
            <View style={{ marginTop: 15 }}>
              <ErrorMessage errorMessage={errorMessage} />
            </View>
          )}
        </View>
        <Button text={'Buy Data'} onPress={handleInputPin} />
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  dataPlan: {
    width: 100 + '%',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  networkIcon: {
    gap: 20,
    flexDirection: 'row',
  },
  currencyAmount: {
    fontSize: 22,
    paddingRight: 10,
  },
});
export default BuyData;

const Beneficiary = ({ beneficiary, networkProvidersIcon }) => {
  return (
    <Pressable style={styles.beneficiary}>
      {networkProvidersIcon(beneficiary.network)}
      <RegularText style={styles.phoneNo}>{beneficiary.phoneNo}</RegularText>
    </Pressable>
  );
};
