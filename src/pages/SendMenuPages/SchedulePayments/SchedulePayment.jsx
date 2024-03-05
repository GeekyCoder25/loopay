/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import RegularText from '../../../components/fonts/RegularText';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import FlagSelect from '../../../components/FlagSelect';
import { AppContext } from '../../../components/AppContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import { useWalletContext } from '../../../context/WalletContext';
import Button from '../../../components/Button';
import { allCurrencies } from '../../../database/data';
import Back from '../../../components/Back';
import { postFetchData } from '../../../../utils/fetchAPI';
import ErrorMessage from '../../../components/ErrorMessage';
import { randomUUID } from 'expo-crypto';
import FaIcon from '@expo/vector-icons/FontAwesome';
import IonIcon from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToastMessage from '../../../components/ToastMessage';
import CalendarIcon from '../../../../assets/images/calendar.svg';
import InputPin from '../../../components/InputPin';
import { useBeneficiaryContext } from '../../../context/BeneficiariesContext';

const SchedulePayment = ({ navigation, route }) => {
  const { selectedCurrency, setIsLoading, setWalletRefresh, isAndroid } =
    useContext(AppContext);
  const { wallet, setWallet } = useWalletContext();
  const { setRefetchBeneficiary } = useBeneficiaryContext();
  const [selected, setSelected] = useState(selectedCurrency);
  const [stateFields, setStateFields] = useState({
    id: randomUUID(),
    currency: selected.currency,
    symbol: selected.symbol,
  });
  const [errorKey, setErrorKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState({});
  const [frequencyModalOpen, setFrequencyModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [selectedPeriodModal, setSelectedPeriodModal] = useState({});
  const [showDailyClock, setShowDailyClock] = useState(false);
  const [showMonthlyDate, setShowMonthlyDate] = useState(false);
  const [startValue, setStartValue] = useState('DD/MM/YYYY');
  const [endValue, setEndValue] = useState('DD/MM/YYYY');
  const [interval, setInterval] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const { minimumAmountToAdd } = selected;

  const handlePriceInput = text => {
    setValue(text);
    text = Number(text);

    setStateFields(prev => {
      return {
        ...prev,
        amount: text,
      };
    });
    setErrorKey(false);
    setErrorMessage(false);
  };

  const handleAutoFill = () => {
    if (value && value < minimumAmountToAdd) {
      setErrorKey(true);
      setErrorMessage(
        `Minimum amount is ${selected.symbol}${minimumAmountToAdd}`,
      );
    }
    value && setValue(addingDecimal(value));
  };

  const handleCurrencyChange = newSelect => {
    setErrorKey('');
    setErrorMessage('');
    setSelected(newSelect);
    setStateFields(prev => {
      return {
        ...prev,
        currency: newSelect.currency,
        symbol: newSelect.symbol,
      };
    });
  };

  const handleModal = () => {
    setModalOpen(prev => !prev);
  };

  const handleFrequencyChange = frequency => {
    setSelectedPeriod({});
    setSelectedFrequency(frequency);
    setErrorKey('');
    setErrorMessage('');
    setStateFields(prev => {
      return { ...prev, frequency };
    });
  };

  const frequencies = [
    {
      label: 'Hourly',
      id: 'hourly',
    },
    {
      label: 'Daily',
      id: 'daily',
    },
    {
      label: 'Weekly',
      id: 'weekly',
    },
    {
      label: 'Monthly',
      id: 'monthly',
    },
  ];

  const defaultPickerDate = period => {
    return period ? new Date(period) : new Date(Date.now());
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleDailyPicker = timeEvent => {
    setShowDailyClock(false);
    if (timeEvent.type === 'set') {
      const formattedTime = new Date(timeEvent.nativeEvent.timestamp);
      formattedTime.setSeconds(0);
      setSelectedPeriod({
        period: formattedTime,
        label: formattedTime.toTimeString().split(' ')[0],
      });
    }
  };
  const handleMonthlyPicker = timeEvent => {
    setShowMonthlyDate(false);
    if (timeEvent.type === 'set') {
      const formattedTime = new Date(timeEvent.nativeEvent.timestamp);
      formattedTime.setSeconds(0);
      setSelectedPeriod({
        period: formattedTime,
        label: formattedTime.getDate(),
      });
    }
  };

  const addOrdinal = number => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits - 20 < 0 && lastTwoDigits - 20 > -10) {
      return number + suffixes[0];
    }
    const suffix = suffixes[lastDigit] || suffixes[0];
    return number + suffix;
  };

  const handleDatePicker = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate < Date.now()) {
      selectedDate = new Date(Date.now());
    }
    switch (event.type) {
      case 'set':
        if (showPicker === 'start') {
          selectedDate.setMilliseconds(0);
          selectedDate.setSeconds(0);
          selectedDate.setMinutes(0);
          selectedDate.setHours(0);
          setStartValue(new Date(selectedDate).toLocaleDateString('en-GB'));
          setInterval(prev => {
            return {
              ...prev,
              start: selectedDate,
            };
          });
        } else if (showPicker === 'end') {
          if (interval.start && interval.start > selectedDate) {
            selectedDate = new Date(interval.start);
          }
          selectedDate.setMilliseconds(999);
          selectedDate.setSeconds(59);
          selectedDate.setMinutes(59);
          selectedDate.setHours(23);
          setEndValue(new Date(selectedDate).toLocaleDateString('en-GB'));
          setInterval(prev => {
            return {
              ...prev,
              end: selectedDate,
            };
          });
        }
        setErrorKey('');
        setErrorMessage('');

        break;

      default:
        break;
    }
  };

  const handleContinue = async () => {
    if (!stateFields.title) {
      setErrorKey('title');
      return setErrorMessage('Please provide a name title for your schedule');
    } else if (!value) {
      setErrorKey('amount');
      return setErrorMessage('Please provide schedule amount');
    } else if (!stateFields.frequency) {
      setErrorKey('frequency');
      return setErrorMessage('Please select schedule frequency');
    } else if (!selectedPeriod.period) {
      setErrorKey('frequencyIndex');

      if (selectedFrequency.id === 'hourly') {
        return setErrorMessage('Please select schedule frequency minute');
      } else if (selectedFrequency.id === 'daily') {
        return setErrorMessage('Please select schedule frequency hour');
      } else if (selectedFrequency.id === 'weekly') {
        return setErrorMessage('Please select schedule frequency day');
      } else if (selectedFrequency.id === 'monthly') {
        return setErrorMessage('Please select schedule frequency date');
      }
    } else if (!stateFields.frequency) {
      setErrorKey('frequency');
      return setErrorMessage('Please select schedule frequency');
    } else if (!interval.start) {
      setErrorKey('start');
      return setErrorMessage('Please select schedule start');
    } else if (value && value < minimumAmountToAdd) {
      setErrorKey(true);
      return setErrorMessage(
        `Minimum schedule amount is ${selected.symbol}${minimumAmountToAdd}`,
      );
    } else {
      console.log(stateFields);
      return setCanContinue(true);
    }
  };
  const transferLoopay = async () => {
    try {
      const data = route.params.scheduleData;
      const response = await postFetchData('user/loopay/transfer', data);
      if (response.status === 200) {
        const balance = response.data.amount;
        setWallet(prev => {
          return { ...prev, balance: prev.balance - Number(balance) };
        });
        if (data.saveAsBeneficiary) {
          await postFetchData('user/beneficiary', data.userToSendTo);
          setRefetchBeneficiary(prev => !prev);
        }
        setWalletRefresh(prev => !prev);
        navigation.replace('Success', {
          userToSendTo: data.userToSendTo,
          amountInput: data.amount,
          transaction: response.data.transaction,
        });
        return response.status;
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const transferOthers = async () => {
    try {
      const data = route.params.scheduleData;
      const id = randomUUID();
      const response = await postFetchData('user/transfer', data);
      if (response.status === 200) {
        const { transaction } = response.data;
        await postFetchData('user/savedbanks', data.bankData);
        navigation.replace('Success', {
          userToSendTo: data.bankSelected,
          amount: data.amount,
          fee: data.fee,
          id,
          transaction,
        });
        setWalletRefresh(prev => !prev);
        return response.status;
      }
      typeof response === 'string'
        ? setErrorMessage(response)
        : setErrorMessage(response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const transferBill = async () => {
    try {
      const data = route.params.scheduleData;
      setIsLoading(true);
      const response = await postFetchData(
        `user/bill-pay?${data.routeId}`,
        data,
      );
      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        navigation.replace('Success', {
          amountInput: data.amount,
          billPlan: data.provider.name,
          token: response.data.token,
          reference: response.data.referenceId,
          transaction: response.data.transaction,
        });
        return response.status;
      }
      return response.data;
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const transferAirtime = async setErrorMessageParam => {
    try {
      const data = route.params.scheduleData.formData;

      const response = await postFetchData(`user/${data.type}`, data);
      if (!response.status || response.status !== 200) {
        const errRes = response.data?.message || response.data || response;
        setErrorMessageParam(errRes);
        return errRes;
      }
      setWalletRefresh(prev => !prev);
      navigation.replace('Success', {
        airtime: { ...data, reference: response.data.reference },
        amountInput: response.data.transaction?.amount || data.amount,
        dataPlan: data.plan?.value || undefined,
        transaction: response.data.transaction,
      });
      return response.status;
    } finally {
    }
  };
  const handleSchedule = async () => {
    switch (route.params.type) {
      case 'loopay':
        await transferLoopay();
        break;
      case 'others':
        await transferOthers();
        break;
      case 'bill':
        await transferBill();
        break;
      case 'airtime':
        await transferAirtime();
        break;
      case 'data':
        await transferAirtime();
        break;

      default:
        break;
    }
  };

  if (canContinue) {
    return (
      <InputPin
        customFunc={handleSchedule}
        handleCancel={() => setCanContinue(false)}
      />
    );
  }

  return (
    <>
      <Back goBack={navigation.goBack} />
      <PageContainer style={styles.container} scroll>
        <BoldText style={styles.headerText}>Schedule Payment</BoldText>
        <View style={styles.body}>
          <RegularText style={styles.label}>Schedule Title</RegularText>
          <View style={styles.textInputContainer}>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: errorKey === 'title' ? 'red' : '#ccc',
              }}
              onChangeText={text => {
                setErrorMessage('');
                setErrorKey('');
                setStateFields(prev => {
                  return {
                    ...prev,
                    title: text,
                  };
                });
              }}
              placeholder="Name"
            />
          </View>

          <View style={styles.labelContainer}>
            <RegularText style={styles.label}>Select Currency</RegularText>
          </View>
          <Pressable
            onPress={() =>
              route.params.type === 'others'
                ? ToastMessage(
                    'Naira is the only supported currency for inter bank transfers at the moment',
                  )
                : setModalOpen(true)
            }
            style={styles.textInputContainer}>
            <View style={{ ...styles.textInput, ...styles.selectInput }}>
              <View style={styles.selected}>
                <FlagSelect country={selected.currency} />
                <RegularText
                  style={
                    styles.selectedText
                  }>{`${selected.acronym} (${selected.fullName})`}</RegularText>
              </View>
              <ChevronDown />
            </View>
          </Pressable>
          {/* {route.params.type === 'loopay' && (
          <>
            <View style={styles.labelContainer}>
              <RegularText style={styles.label}>
                Enter user Loopay tag or account number
              </RegularText>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorKey === 'tagName' ? 'red' : '#ccc',
                }}
                onChangeText={text => handleTagCheck(text)}
                placeholder={'#username'}
                onBlur={handleCheck}
              />
              {userFound && (
                <Pressable style={styles.textInputRight}>
                  <Check />
                </Pressable>
              )}
            </View>
          </>
        )} */}

          <RegularText style={styles.label}>Amount</RegularText>
          <View style={styles.textInputContainer}>
            <View style={styles.symbolContainer}>
              <BoldText style={styles.symbol}>{selected.symbol}</BoldText>
            </View>
            <TextInput
              style={{
                ...styles.textInput,
                ...styles.textInputStyles,
                borderColor: errorKey === 'amount' ? 'red' : '#ccc',
              }}
              inputMode="decimal"
              onChangeText={text => handlePriceInput(text)}
              onBlur={handleAutoFill}
              value={value}
            />
          </View>

          <View style={styles.labelContainer}>
            <RegularText style={styles.label}>Frequency</RegularText>
          </View>
          <Pressable
            onPress={() => setFrequencyModalOpen(true)}
            style={styles.textInputContainer}>
            <View
              style={{
                ...styles.textInput,
                ...styles.selectInput,
                borderColor: errorKey === 'frequency' ? 'red' : '#ccc',
              }}>
              <View style={styles.selected}>
                <RegularText style={styles.selectedText}>
                  {selectedFrequency?.label || 'Order Frequency'}
                </RegularText>
              </View>
              <ChevronDown />
            </View>
          </Pressable>
          {selectedFrequency.id === 'hourly' && (
            <>
              <View style={styles.labelContainer}>
                <RegularText style={styles.label}>Select minute</RegularText>
              </View>
              <Pressable
                onPress={() => setShowDailyClock(true)}
                style={styles.textInputContainer}>
                <View
                  style={{
                    ...styles.textInput,
                    ...styles.selectInput,
                    borderColor: errorKey === 'frequencyIndex' ? 'red' : '#ccc',
                  }}>
                  <View style={styles.selected}>
                    <IonIcon name="time-outline" size={24} />
                    {showDailyClock ? (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={defaultPickerDate(selectedPeriod.period)}
                        onChange={handleDailyPicker}
                        mode="time"
                        display={isAndroid ? 'spinner' : 'default'}
                        minuteInterval={1}
                      />
                    ) : (
                      <RegularText style={styles.selectedText}>
                        {selectedPeriod.label || 'Hour of the day'}
                      </RegularText>
                    )}
                  </View>
                  <ChevronDown />
                </View>
              </Pressable>
            </>
          )}
          {selectedFrequency.id === 'daily' && (
            <>
              <View style={styles.labelContainer}>
                <RegularText style={styles.label}>Select hour</RegularText>
              </View>
              <Pressable
                onPress={() => setShowDailyClock(true)}
                style={styles.textInputContainer}>
                <View
                  style={{
                    ...styles.textInput,
                    ...styles.selectInput,
                    borderColor: errorKey === 'frequencyIndex' ? 'red' : '#ccc',
                  }}>
                  <View style={styles.selected}>
                    <IonIcon name="time-outline" size={24} />
                    {showDailyClock ? (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={defaultPickerDate(selectedPeriod.period)}
                        onChange={handleDailyPicker}
                        mode="time"
                        display={isAndroid ? 'spinner' : 'default'}
                      />
                    ) : (
                      <RegularText style={styles.selectedText}>
                        {selectedPeriod.label || 'Hour of the day'}
                      </RegularText>
                    )}
                  </View>
                  <ChevronDown />
                </View>
              </Pressable>
            </>
          )}
          {selectedFrequency.id === 'weekly' && (
            <>
              <View style={styles.labelContainer}>
                <RegularText style={styles.label}>Select day</RegularText>
              </View>
              <Pressable
                onPress={() => setSelectedPeriodModal(true)}
                style={styles.textInputContainer}>
                <View
                  style={{
                    ...styles.textInput,
                    ...styles.selectInput,
                    borderColor: errorKey === 'frequencyIndex' ? 'red' : '#ccc',
                  }}>
                  <View style={styles.selected}>
                    <RegularText style={styles.selectedText}>
                      {selectedPeriod.label || 'Day of the week'}
                    </RegularText>
                  </View>
                  <ChevronDown />
                </View>
              </Pressable>
            </>
          )}

          {selectedFrequency.id === 'monthly' && (
            <>
              <View style={styles.labelContainer}>
                <RegularText style={styles.label}>Select Date</RegularText>
              </View>
              <Pressable
                onPress={() => setShowMonthlyDate(true)}
                style={styles.textInputContainer}>
                <View
                  style={{
                    ...styles.textInput,
                    ...styles.selectInput,
                    borderColor: errorKey === 'frequencyIndex' ? 'red' : '#ccc',
                  }}>
                  <View style={styles.selected}>
                    <View style={styles.dateTextContainer}>
                      <View style={styles.calendarIcon}>
                        <CalendarIcon width={30} height={30} />
                        <RegularText style={styles.newDate}>
                          {selectedPeriod.period
                            ? new Date(selectedPeriod.period).getDate()
                            : new Date().getDate()}
                        </RegularText>
                      </View>

                      {showMonthlyDate ? (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={defaultPickerDate(selectedPeriod.period)}
                          onChange={handleMonthlyPicker}
                          minimumDate={new Date(new Date().getFullYear(), 0, 1)}
                          maximumDate={
                            new Date(new Date().getFullYear(), 0, 31)
                          }
                        />
                      ) : (
                        <RegularText style={styles.selectedText}>
                          {selectedPeriod.label
                            ? `${addOrdinal(selectedPeriod.label)} of every month`
                            : 'Date of the month'}
                        </RegularText>
                      )}
                    </View>
                  </View>
                  <ChevronDown />
                </View>
              </Pressable>
            </>
          )}

          <RegularText style={styles.topUp}>Start Date</RegularText>
          <Pressable
            onPress={() => setShowPicker('start')}
            style={styles.textInputContainer}>
            <View
              style={{
                ...styles.textInput,
                borderColor: errorKey === 'start' ? 'red' : '#ccc',
              }}>
              <View style={styles.dateTextContainer}>
                <View style={styles.calendarIcon}>
                  <CalendarIcon width={30} height={30} />
                  <RegularText style={styles.newDate}>
                    {interval.start
                      ? new Date(interval.start).getDate()
                      : new Date().getDate()}
                  </RegularText>
                </View>
                {showPicker === 'start' ? (
                  <DateTimePicker
                    testID="date~TimePicker"
                    value={defaultPickerDate(interval.start)}
                    onChange={handleDatePicker}
                    style={styles.picker}
                  />
                ) : (
                  <RegularText>{startValue}</RegularText>
                )}
              </View>
            </View>
          </Pressable>
          <RegularText style={styles.topUp}>End Date</RegularText>
          <Pressable
            style={styles.textInputContainer}
            onPress={() => setShowPicker('end')}>
            <View style={{ ...styles.textInput }}>
              <View style={styles.dateTextContainer}>
                <View style={styles.calendarIcon}>
                  <CalendarIcon width={30} height={30} />
                  <RegularText style={styles.newDate}>
                    {interval.end
                      ? new Date(interval.end).getDate()
                      : new Date().getDate()}
                  </RegularText>
                </View>
                {showPicker === 'end' ? (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={defaultPickerDate(interval.end)}
                    onChange={handleDatePicker}
                    style={styles.picker}
                  />
                ) : (
                  <RegularText>{endValue}</RegularText>
                )}
              </View>
            </View>
          </Pressable>

          <RegularText style={styles.label}>Description</RegularText>
          <View style={styles.textInputContainer}>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: errorKey === 'desc' ? 'red' : '#ccc',
              }}
              onChangeText={text => {
                setErrorMessage('');
                setErrorKey('');
                setStateFields(prev => {
                  return {
                    ...prev,
                    description: text,
                  };
                });
              }}
              placeholder="(optional)"
            />
          </View>
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </View>
        <View style={styles.button}>
          <Button
            text="Continue"
            onPress={() => handleContinue(selectedCurrency)}
          />
        </View>

        <Modal
          visible={modalOpen}
          animationType="slide"
          transparent
          onRequestClose={handleModal}>
          <Back onPress={() => setModalOpen(false)} />
          <View style={styles.modal}>
            <BoldText style={styles.modalHeader}>Select currency</BoldText>
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
                  <BoldText style={styles.amount}>
                    {select.symbol +
                      addingDecimal(
                        wallet[`${select.currency}Balance`]?.toLocaleString(),
                      )}
                  </BoldText>
                </Pressable>
              ))}
          </View>
        </Modal>

        <Modal
          visible={frequencyModalOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setFrequencyModalOpen(false)}>
          <Back onPress={() => setFrequencyModalOpen(false)} />
          <View style={styles.modal}>
            <BoldText style={styles.modalHeader}>
              Select Order Frequency
            </BoldText>
            {frequencies.map(frequency => (
              <Pressable
                key={frequency.id}
                style={styles.currency}
                onPress={() => {
                  handleFrequencyChange(frequency);
                  setFrequencyModalOpen(false);
                }}>
                <View style={styles.currencyIcon}>
                  <View>
                    <BoldText style={styles.currencyName}>
                      {frequency.label}
                    </BoldText>
                  </View>
                </View>
                <BoldText style={styles.amount}>
                  {selectedFrequency?.id === frequency.id ? (
                    <FaIcon name="check-circle" size={24} />
                  ) : (
                    <FaIcon name="circle-o" size={24} />
                  )}
                </BoldText>
              </Pressable>
            ))}
          </View>
        </Modal>

        <Modal
          visible={selectedPeriodModal}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedPeriodModal(false)}>
          <Back onPress={() => setSelectedPeriodModal(false)} />
          <View style={styles.modal}>
            <BoldText style={styles.modalHeader}>Select Day</BoldText>
            {days.map(day => (
              <Pressable
                key={day}
                style={styles.currency}
                onPress={() => {
                  setSelectedPeriod({ label: day, period: day });
                  setSelectedPeriodModal(false);
                }}>
                <View style={styles.currencyIcon}>
                  <View>
                    <BoldText style={styles.currencyName}>{day}</BoldText>
                  </View>
                </View>
                <BoldText style={styles.amount}>
                  {selectedPeriod === day ? (
                    <FaIcon name="check-circle" size={24} />
                  ) : (
                    <FaIcon name="circle-o" size={24} />
                  )}
                </BoldText>
              </Pressable>
            ))}
          </View>
        </Modal>
      </PageContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  headerText: {
    fontSize: 20,
  },
  body: {
    marginVertical: 40,
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
    marginBottom: 30,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'OpenSans-600',
  },
  textInputStyles: {
    paddingVertical: 10,
    paddingLeft: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInputRight: {
    position: 'absolute',
    top: 30 + '%',
    right: 10,
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  calendarIcon: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  picker: { marginLeft: -10 },
  newDate: {
    position: 'absolute',
    top: '17%',
  },
  success: { marginTop: -15 },
  symbolContainer: {
    position: 'absolute',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
  symbol: {
    fontSize: 28,
  },
  selectInput: {},
  modalSelected: {
    textTransform: 'uppercase',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedText: {
    color: '#525252',
    fontSize: 16,
    fontFamily: 'OpenSans-600',
  },
  errorMessage: {
    color: 'red',
    transform: [{ translateY: -35 }],
    textAlign: 'center',
  },
  fee: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
  },
  feeText: {
    color: '#fff',
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.5,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingTop: 20,
    gap: 10,
    padding: 3 + '%',
  },
  modalHeader: {
    fontSize: 16,
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
    gap: 20,
    flexDirection: 'row',
    flex: 1,
  },
  currencyName: { textTransform: 'capitalize' },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
});

export default SchedulePayment;
