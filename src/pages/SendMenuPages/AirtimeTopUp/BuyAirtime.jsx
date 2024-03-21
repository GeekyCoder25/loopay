/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  ActivityIndicator,
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
import { AppContext } from '../../../components/AppContext';
import { allCurrencies } from '../../../database/data';
import ToastMessage from '../../../components/ToastMessage';
import { setShowBalance } from '../../../../utils/storage';
import FlagSelect from '../../../components/FlagSelect';
import Back from '../../../components/Back';
import RecurringSwitch from '../../../components/RecurringSwitch';
import SchedulePayment from '../SchedulePayments/SchedulePayment';
import useFetchData from '../../../../utils/fetchAPI';

const BuyAirtime = ({ route, navigation }) => {
  const { getFetchData } = useFetchData();
  const { appData, setIsLoading, showAmount, setShowAmount, selectedCurrency } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const { code: countryCode } = appData.country;
  const [paymentModal, setPaymentModal] = useState(false);
  const [networkModal, setNetworkModal] = useState(false);
  const [selected, setSelected] = useState(selectedCurrency);
  const [networkToBuy, setNetworkToBuy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [hasAskedPin, setHasAskedPin] = useState(false);
  const [isNigeria] = useState(countryCode === 'NG');
  const [networkProviders, setNetworkProviders] = useState(
    isNigeria
      ? [
          { network: '9mobile', locale: 'ng', operatorId: 340 },
          { network: 'mtn', locale: 'ng', operatorId: 341 },
          { network: 'airtel', locale: 'ng', operatorId: 342 },
          { network: 'glo', locale: 'ng', operatorId: 344 },
        ]
      : [],
  );

  const [formData, setFormData] = useState({
    network: '',
    amount: '',
    phoneNo: '',
  });
  const balance = wallet[`${selected.currency}Balance`];
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

  useEffect(() => {
    const getOperators = async () => {
      const response = await getFetchData(
        `user/airtime/operators?country=${countryCode}`,
      );
      if (response.status === 200) {
        const data = response.data.map(({ name, operatorId, logoUrls }) => {
          return { network: name, locale: '', operatorId, icon: logoUrls[0] };
        });
        return setNetworkProviders(data);
      }
      setNetworkProviders([]);
    };
    if (!isNigeria) {
      getOperators();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode, isNigeria]);

  const handleModal = () => {
    setNetworkModal(prev => !prev);
  };

  const handleCurrencyChange = newSelect => {
    setErrorKey('');
    setErrorMessage('');
    setSelected(newSelect);
  };

  const handleNetworkSelect = provider => {
    setNetworkModal(false);
    setNetworkToBuy(provider);
    setFormData(prev => {
      return {
        ...prev,
        network: provider.network,
        operatorId: provider.operatorId,
        icon: provider.icon,
      };
    });
  };

  const handleAmountInput = amount => {
    setAmountInput(amount);
    if (amount > balance) {
      setErrorMessage('Insufficient balance');
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
    if (selected.acronym === 'NGN' && amountInput < 50) {
      setErrorMessage(
        `Minimum recharge amount is ${
          allCurrencies.find(currency => currency.isLocal).symbol + 50
        }`,
      );
      setErrorKey('amountInput');
    }
  };

  const checkOperator = async () => {
    const phoneNo = formData.phoneNo;
    setIsLoading(true);
    const response = await getFetchData(
      `user/get-network?phone=${phoneNo}&country=${countryCode}`,
    );
    setIsLoading(false);
    if (response.status === 200) {
      const network = response.data.name.toLowerCase();
      return handleNetworkSelect(
        networkProviders.find(index => network.startsWith(index.network)),
      );
    }
    ToastMessage(`${response.data || response}`);
  };

  const handlePhoneInput = async phoneNo => {
    setFormData(prev => {
      return { ...prev, phoneNo };
    });
    setErrorMessage('');
    setErrorKey('');
    if (isNigeria && phoneNo.length === 11) {
      checkOperator();
    }
  };

  const localCurrencySymbol = allCurrencies.find(
    currency => currency.isLocal,
  ).symbol;

  const handleInputPin = async () => {
    if (Object.values(formData).includes('')) {
      return setErrorMessage(
        'Please provide all required fields before progressing',
      );
    } else if (selected.acronym === 'NGN' && amountInput < 50) {
      setErrorMessage(`Minimum recharge amount is ${localCurrencySymbol + 50}`);
      return setErrorKey('amountInput');
    } else if (isNigeria && formData.phoneNo.length < 11) {
      setErrorMessage2('Incomplete phone number');
      return setErrorKey('phoneInput');
    } else if (formData.amount > balance) {
      setErrorMessage('Insufficient balance');
      return setErrorKey('amountInput');
    }
    setHasAskedPin(true);

    navigation.navigate('TransferAirtime', {
      formData: {
        ...formData,
        id: randomUUID(),
        currency: allCurrencies.find(
          currency => currency.acronym === selected.acronym,
        ).currency,
        countryCode,
        paymentCurrency: selected.acronym,
        type: 'airtime',
        scheduleData,
      },
      isInternational: !isNigeria,
    });
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };
  return (
    <>
      <PageContainer padding paddingTop={0}>
        <ScrollView
          style={styles.body}
          automaticallyAdjustKeyboardInsets={true}>
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
          <View style={styles.label}>
            <Text style={styles.label}>Pay With</Text>
          </View>
          <Pressable
            onPress={() => setPaymentModal(true)}
            style={styles.textInputContainer}>
            <View style={{ ...styles.textInput, height: 60, paddingLeft: 5 }}>
              <View style={styles.currencyIcon}>
                <FlagSelect country={selected.currency} />
                <View>
                  <RegularText style={styles.currencyName}>
                    {selected.currency} Balance
                  </RegularText>
                </View>
              </View>
              <ChevronDown />
            </View>
          </Pressable>
          <RegularText style={styles.headerSubText}>Network</RegularText>
          <Pressable
            onPress={() => setNetworkModal(true)}
            style={styles.textInputContainer}>
            <View style={{ ...styles.textInput, height: 60, paddingLeft: 5 }}>
              {networkToBuy ? (
                <View style={styles.networkToBuySelected}>
                  {networkToBuy &&
                    (isNigeria ? (
                      networkProvidersIcon(networkToBuy.network)
                    ) : (
                      <Image
                        source={{ uri: networkToBuy.icon }}
                        style={styles.networkIcon}
                      />
                    ))}
                  <BoldText style={styles.networkToBuySelected}>
                    {networkToBuy.network}
                    {isNigeria ? ` - ${networkToBuy.locale}` : ''}
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
            visible={networkModal}
            animationType="slide"
            transparent
            onRequestClose={handleModal}>
            <Pressable style={styles.overlay} onPress={handleModal} />
            <View style={styles.modalContainer}>
              <View style={styles.networkModal}>
                <View style={styles.modalBorder} />
                <ScrollView style={{ width: 100 + '%' }}>
                  <View style={styles.modalLists}>
                    {networkProviders.length ? (
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
                          <View>
                            {isNigeria ? (
                              networkProvidersIcon(provider.network)
                            ) : (
                              <Image
                                source={{ uri: provider.icon }}
                                style={styles.networkIcon}
                              />
                            )}
                          </View>
                          <BoldText style={styles.networkToBuySelected}>
                            {`${provider.network}${
                              isNigeria ? ` - ${provider.locale}` : ''
                            }`}
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
              onBlur={
                !isNigeria && formData.phoneNo ? checkOperator : undefined
              }
              maxLength={isNigeria ? 11 : undefined}
              value={formData.phoneNo}
            />
          </View>
          <ErrorMessage errorMessage={errorMessage2} />
          <View style={styles.topUpContainer}>
            <Text style={styles.label}>Amount to be credited</Text>
            <Pressable onPress={handleShow}>
              <Text style={styles.label}>
                Balance:{' '}
                {showAmount
                  ? selected.symbol +
                    addingDecimal(`${balance?.toLocaleString()}`)
                  : '***'}
              </Text>
            </Pressable>
          </View>
          <View style={styles.textInputContainer}>
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
            </View>
            <RecurringSwitch
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              scheduleData={scheduleData}
              setScheduleData={setScheduleData}
              setHasAskedPin={setHasAskedPin}
            />
            {scheduleData && !hasAskedPin && (
              <SchedulePayment
                type="airtime"
                isRecurring={isRecurring}
                setIsRecurring={setIsRecurring}
                scheduleData={scheduleData}
                setScheduleData={setScheduleData}
              />
            )}
            {errorMessage && (
              <View style={{ marginTop: 15 }}>
                <ErrorMessage errorMessage={errorMessage} />
              </View>
            )}
          </View>
          <Button text={'Buy Airtime'} onPress={handleInputPin} />
        </ScrollView>
      </PageContainer>
      <Modal
        visible={paymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setPaymentModal(false)}>
        <Back onPress={() => setPaymentModal(false)} />
        <View style={styles.paymentModal}>
          <BoldText style={styles.paymentModalHeader}>
            Select account to pay with
          </BoldText>
          {allCurrencies
            .filter(i => i.currency !== selected.currency)
            .map(select => (
              <Pressable
                key={select.currency}
                style={styles.currency}
                onPress={() => {
                  handleCurrencyChange(select);
                  setPaymentModal(false);
                }}>
                <View style={styles.currencyIcon}>
                  <FlagSelect country={select.currency} />
                  <View>
                    <BoldText>{select.acronym}</BoldText>
                    <RegularText style={styles.currencyName}>
                      {select.currency}
                    </RegularText>
                  </View>
                </View>

                <Pressable onPress={handleShow}>
                  <BoldText style={styles.amount}>
                    {showAmount
                      ? select.symbol +
                        addingDecimal(
                          wallet[`${select.currency}Balance`]?.toLocaleString(),
                        )
                      : '***'}
                  </BoldText>
                </Pressable>
              </Pressable>
            ))}
        </View>
      </Modal>
    </>
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
  currencies: {
    flex: 1,
  },
  currency: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  currencyIcon: {
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencyName: { textTransform: 'capitalize' },
  paymentModal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingTop: 20,
    gap: 10,
    padding: 3 + '%',
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
  networkModal: {
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
export default BuyAirtime;

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
