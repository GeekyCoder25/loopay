import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
import BillElectricity from './BillElectricity';
import { randomUUID } from 'expo-crypto';
import BillTV from './BillTV';
import BillSchool from './BillSchool';
import RecurringSwitch from '../../../components/RecurringSwitch';
import SchedulePayment from '../SchedulePayments/SchedulePayment';
import useFetchData from '../../../../utils/fetchAPI';

const PayABillParams = ({ route, navigation }) => {
  const { postFetchData } = useFetchData();
  const { selectedCurrency, showAmount, setShowAmount } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const [stateFields, setStateFields] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(selectedCurrency);
  const [fetchStepState, setFetchStepState] = useState(1);
  const [globalApiBody, setGlobalApiBody] = useState({});
  const [apiBody, setApiBody] = useState('');
  const { buttonText, data: fields } = route.params;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [hasAskedPin, setHasAskedPin] = useState(false);

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

  useEffect(() => {
    const fetchData = async field => {
      try {
        if (field.apiUrl.startsWith('https')) {
          const response = await fetch(field.apiUrl);
          const json = await response.json();
          console.log(json.slice(0, 2));
          return (field.modalData = json.slice(0, 20));
        }

        if (field.type === 'select' && field.apiUrl) {
          const response = await postFetchData(field.apiUrl, apiBody);
          if (response.status === 200) {
            const data = response.data;
            return (field.modalData = data);
          }
        } else if (field.type === 'select' && field.selectData) {
          field.modalData = field.selectData;
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const field = fields.find(
      fieldIndex => fieldIndex.fetchStep === fetchStepState,
    );
    field && fetchData(field);
  }, [fetchStepState, fields, apiBody, postFetchData]);

  const payElectricity = () => {
    if (Object.values(stateFields).includes('')) {
      return setErrorMessage('Please provide all required fields');
    } else if (stateFields.amount > wallet[`${selected.currency}Balance`]) {
      setErrorMessage('Insufficient balance');
      return setErrorKey('amount');
    } else if (
      (stateFields.amount < stateFields.provider.minLocalTransactionAmount ||
        stateFields.amount < 1000) &&
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
    setHasAskedPin(true);

    navigation.navigate('TransferBill', {
      ...stateFields,
      ...globalApiBody,
      referenceId: randomUUID().split('-').join(''),
      routeId: route.params.title,
      paymentCurrency: selected.acronym,
      scheduleData,
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
        payElectricity();
        break;

      default:
        payElectricity();
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
  let childComponent;

  switch (route.params.title) {
    case 'electricity':
      childComponent = (
        <BillElectricity
          fields={fields}
          stateFields={stateFields}
          setStateFields={setStateFields}
          errorKey={errorKey}
          setErrorKey={setErrorKey}
          setErrorMessage={setErrorMessage}
          globalApiBody={globalApiBody}
          setGlobalApiBody={setGlobalApiBody}
          setIsButtonDisabled={setIsButtonDisabled}
          selectedCurrency={selected}
        />
      );
      break;
    case 'TV':
      childComponent = (
        <BillTV
          fields={fields}
          stateFields={stateFields}
          setStateFields={setStateFields}
          errorKey={errorKey}
          setErrorKey={setErrorKey}
          setErrorMessage={setErrorMessage}
          globalApiBody={globalApiBody}
          setGlobalApiBody={setGlobalApiBody}
          setIsButtonDisabled={setIsButtonDisabled}
          selectedCurrency={selected}
        />
      );
      break;
    case 'school':
      childComponent = (
        <BillSchool
          fields={fields}
          stateFields={stateFields}
          setStateFields={setStateFields}
          errorKey={errorKey}
          setErrorKey={setErrorKey}
          setErrorMessage={setErrorMessage}
          globalApiBody={globalApiBody}
          setGlobalApiBody={setGlobalApiBody}
          setIsButtonDisabled={setIsButtonDisabled}
          selectedCurrency={selected}
        />
      );
      break;

    default:
      childComponent = fields.map(field => (
        <SelectInputField
          fields={fields}
          key={field.title}
          selectInput={field}
          stateFields={stateFields}
          setStateFields={setStateFields}
          showBalance={field.balance}
          errorKey={errorKey}
          setErrorMessage={setErrorMessage}
          setErrorKey={setErrorKey}
          selectedCurrency={selected}
          modalData={field.modalData || []}
          setFetchStepState={setFetchStepState}
          setApiBody={setApiBody}
        />
      ));
      break;
  }
  return (
    <>
      <PageContainer paddingTop={0} padding scroll>
        <BoldText style={styles.headerText}>{route.params.headerText}</BoldText>
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
        <View style={styles.textInputContainer} />
        {childComponent}
        <View style={styles.recurringContainer}>
          <RecurringSwitch
            isRecurring={isRecurring}
            setIsRecurring={setIsRecurring}
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            setHasAskedPin={setHasAskedPin}
          />
          {errorMessage && (
            <View>
              <ErrorMessage errorMessage={errorMessage} />
            </View>
          )}
        </View>
        <View style={styles.button}>
          <Button
            text={buttonText}
            onPress={buttonFunc}
            disabled={isButtonDisabled}
            style={isButtonDisabled && styles.disabledButton}
          />
        </View>
      </PageContainer>
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(false)}>
        <Back onPress={() => setModalOpen(false)} />
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

      {scheduleData && !hasAskedPin && (
        <SchedulePayment
          type="bill"
          isRecurring={isRecurring}
          setIsRecurring={setIsRecurring}
          scheduleData={scheduleData}
          setScheduleData={setScheduleData}
        />
      )}
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
  },
  recurringContainer: {
    marginTop: 15,
    rowGap: 25,
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
  disabledButton: { backgroundColor: 'rgba(28, 28, 28, 0.5)' },
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
