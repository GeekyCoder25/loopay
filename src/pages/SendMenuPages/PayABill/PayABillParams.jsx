import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { useContext, useEffect, useState } from 'react';
import Button from '../../../components/Button';
import SelectInputField from './PayABillFields';
import ErrorMessage from '../../../components/ErrorMessage';
import { useWalletContext } from '../../../context/WalletContext';
import RegularText from '../../../components/fonts/RegularText';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import { AppContext } from '../../../components/AppContext';
import Back from '../../../components/Back';
import { allCurrencies } from '../../../database/data';
import FlagSelect from '../../../components/FlagSelect';
import { addingDecimal } from '../../../../utils/AddingZero';
import { setShowBalance } from '../../../../utils/storage';

const PayABillParams = ({ route, navigation }) => {
  const { selectedCurrency, showAmount, setShowAmount } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const [stateFields, setStateFields] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(selectedCurrency);
  const { buttonText, data: fields } = route.params;

  useEffect(() => {
    fields.forEach(element => {
      !element.optional &&
        setStateFields(prev => {
          return {
            ...prev,
            [element.id]: '',
          };
        });
    });
  }, [fields]);

  // const handleVerify = () => {
  //   console.log(stateFields);
  // };

  const fetchModal = () => {
    return [{ title: 'DSTV' }, { title: 'Gotv' }, { title: 'startimes' }];
  };

  const VerifyCardNumber = () => {
    if (Object.values(stateFields).includes('')) {
      return setErrorMessage('Please provide all required fields');
    }
    navigation.push('PayABillParams', {
      headerText: 'Cable TV',
      data: [
        {
          title: 'User Info',
          type: 'select',
          placeholder: 'User Info',
          id: 'userInfo',
        },
        {
          title: 'Package',
          type: 'select',
          placeholder: 'Select Package',
          id: 'package',
        },
        {
          title: 'Duration',
          type: 'select',
          placeholder: 'Duration',
          id: 'duration',
        },
      ],
      buttonText: 'Pay',
      buttonFunc: PayCableTv,
    });
  };

  const PayCableTv = () => {
    console.log('shit');
  };

  const payElectricity = () => {
    if (Object.values({ ...stateFields, message: 'message' }).includes('')) {
      return setErrorMessage('Please provide all required fields');
    } else if (stateFields.amount > wallet.localBalance) {
      setErrorMessage('Insufficient balance');
      return setErrorKey('amount');
    } else if (
      stateFields.amount < stateFields.provider.minLocalTransactionAmount &&
      selected.currency === 'NGN'
    ) {
      setErrorMessage(
        'Amount is less than the minimum accepted by this biller',
      );
      return setErrorKey('amount');
    } else if (
      stateFields.amount > stateFields.provider.maxLocalTransactionAmount &&
      selected.currency === 'NGN'
    ) {
      setErrorMessage(
        'Amount is greater than the maximum accepted by this biller',
      );
      return setErrorKey('amount');
    }

    navigation.navigate('TransferBill', {
      ...stateFields,
      routeId: route.params.title,
      paymentCurrency: selected.acronym,
    });
  };

  const buttonFunc = () => {
    switch (route.params.title) {
      case 'electricity':
        payElectricity();
        break;
      case 'water':
        payElectricity();
        break;
      case 'TV':
        VerifyCardNumber();
        break;

      default:
        break;
    }
  };
  const handleCurrencyChange = newSelect => {
    setErrorKey('');
    setErrorMessage('');
    setSelected(newSelect);
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  return (
    <>
      <PageContainer paddingTop={0} padding>
        <ScrollView style={styles.body}>
          <BoldText style={styles.headerText}>
            {route.params.headerText}
          </BoldText>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Pay With</Text>
          </View>
          <View style={styles.textInputContainer}>
            <Pressable
              onPress={() => setModalOpen(true)}
              style={styles.textInputContainer}>
              <View style={styles.textInput}>
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
          </View>
          {fields.map(field => (
            <SelectInputField
              key={field.title}
              selectInput={field}
              setStateFields={setStateFields}
              customFunc={fetchModal}
              showBalance={field.balance}
              errorKey={errorKey}
              setErrorMessage={setErrorMessage}
              setErrorKey={setErrorKey}
              selectedCurrency={selected}
            />
          ))}
          {errorMessage && (
            <View>
              <ErrorMessage errorMessage={errorMessage} />
            </View>
          )}
          <View style={styles.button}>
            <Button text={buttonText} onPress={buttonFunc} />
          </View>
        </ScrollView>
      </PageContainer>
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(false)}>
        <Back route={route} onPress={() => setModalOpen(false)} />
        <View style={styles.modal}>
          <BoldText style={styles.modalHeader}>
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
                  setModalOpen(false);
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
  headerText: {
    marginVertical: 5 + '%',
    fontSize: 25,
  },
  button: {
    marginVertical: 30,
  },
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
  amount: {
    fontSize: 18,
  },
  symbol: {
    position: 'absolute',
    fontSize: 28,
    zIndex: 9,
    top: 5,
    left: 15,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencyName: { textTransform: 'capitalize' },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingTop: 20,
    gap: 10,
    padding: 3 + '%',
  },
  modalHeader: { textAlign: 'center', fontSize: 16 },
});
export default PayABillParams;
