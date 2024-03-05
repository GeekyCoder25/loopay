import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PageContainer from './PageContainer';
import BoldText from './fonts/BoldText';
import IonIcon from '@expo/vector-icons/Ionicons';

import RegularText from './fonts/RegularText';
import { allCurrencies } from '../database/data';
import { AppContext } from './AppContext';
import FlagSelect from './FlagSelect';
import EmptyCheckbox from '../../assets/images/emptyCheckbox.svg';
import FilledCheckbox from '../../assets/images/filledCheckbox.svg';
import Button from './Button';
import ChevronDown from '../../assets/images/chevron-down-fill.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarIcon from '../../assets/images/calendar.svg';
import ToastMessage from './ToastMessage';
import { groupTransactionsByDate } from '../../utils/groupTransactions';
import { getFetchData } from '../../utils/fetchAPI';

const FilterModal = ({
  showModal,
  setShowModal,
  setTransactionHistory,
  setActiveTransactions,
  setIsFiltered,
  transactions,
}) => {
  const { selectedCurrency, setIsLoading, isAdmin } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [selectedCurrencies, setSelectedCurrencies] = useState(
    allCurrencies.map(currency => currency.acronym),
  );
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [startValue, setStartValue] = useState('DD/MM/YYYY');
  const [endValue, setEndValue] = useState('DD/MM/YYYY');
  const [filterCleared, setFilterCleared] = useState(false);

  const getTransactions = async () => {
    const currencies = selectedCurrencies.map(
      currency =>
        allCurrencies.find(index => currency === index.acronym).currency,
    );
    try {
      setIsLoading(true);
      const response = isAdmin
        ? await getFetchData(
            `user/transaction?currency=${currencies}&limit=${0}&page=${1}&start=${selectedPeriod.start}&end=${selectedPeriod.end}`,
          )
        : await getFetchData(
            `admin/transactions?currency=${currencies}&limit=${0}&page=${1}&start=${selectedPeriod.start}&end=${selectedPeriod.end}`,
          );

      if (response.status === 200) {
        return response.data.data.filter(
          transaction => transaction.transactionType !== 'swap',
        );
      }
      throw new Error(response.data?.message || response.data || response);
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hideFilter = () => {
    setShowModal(false);
  };

  const handleModal = () => {
    setModalOpen(false);
  };

  const handleSelectAllClicked = () => {
    setSelectAll(prev => !prev);
    setSelectedCurrencies(
      selectAll ? [] : allCurrencies.map(currency => currency.acronym),
    );
  };

  const today = new Date();
  const currentWeekStart = new Date(today);
  const currentWeekEnd = new Date(today);
  const lastWeekStart = new Date(today);
  const lastWeekEnd = new Date(today);
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentMonthEnd = new Date(today);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  currentWeekStart.setDate(today.getDate() - today.getDay()); // Set to the beginning of the current week (Sunday)
  currentWeekStart.setHours(0); // Set to the beginning of the current week (Sunday)
  currentWeekStart.setMinutes(0); // Set to the beginning of the current week (Sunday)
  currentWeekStart.setSeconds(0); // Set to the beginning of the current week (Sunday)

  currentWeekEnd.setDate(today.getDate()); // Set to the end of the current week (Saturday)

  lastWeekStart.setDate(today.getDate() - today.getDay() - 7); // Set to the beginning of the last week (Sunday)
  lastWeekStart.setHours(0); // Set to the beginning of the last week (Sunday)
  lastWeekStart.setMinutes(0); // Set to the beginning of the last week (Sunday)
  lastWeekStart.setSeconds(0); // Set to the beginning of the last week (Sunday)
  lastWeekStart.setDate(today.getDate() - today.getDay() - 7); // Set to the beginning of the last week (Sunday)

  lastWeekEnd.setDate(today.getDate() - today.getDay() - 1); // Set to the end of the last week (Saturday)
  lastWeekEnd.setHours(24); // Set to the end of the last week (Saturday)
  lastWeekEnd.setMinutes(0); // Set to the end of the last week (Saturday)
  lastWeekEnd.setSeconds(0); // Set to the end of the last week (Saturday)

  const periods = [
    {
      label: 'Custom period',
      start: '',
      end: '',
    },
    {
      label: 'Current week',
      start: currentWeekStart,
      end: currentWeekEnd,
    },
    {
      label: 'Last week ',
      start: lastWeekStart,
      end: lastWeekEnd,
    },
    {
      label: 'Current Month',
      start: currentMonthStart,
      end: currentMonthEnd,
    },
    {
      label: 'Last Month ',
      start: lastMonthStart,
      end: lastMonthEnd,
    },
  ];

  const handleDatePicker = (event, selectedDate) => {
    setShowPicker(false);
    setFilterCleared(false);
    if (selectedDate > Date.now()) {
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
          setSelectedPeriod(prev => {
            return {
              ...prev,
              start: selectedDate,
            };
          });
        } else if (showPicker === 'end') {
          if (selectedPeriod.start && selectedPeriod.start > selectedDate) {
            selectedDate = new Date(Date.now());
          }
          selectedDate.setMilliseconds(999);
          selectedDate.setSeconds(59);
          selectedDate.setMinutes(59);
          selectedDate.setHours(23);
          setEndValue(new Date(selectedDate).toLocaleDateString('en-GB'));
          setSelectedPeriod(prev => {
            return {
              ...prev,
              end: selectedDate,
            };
          });
        }
        break;

      default:
        break;
    }
  };

  const defaultPickerDate = () => {
    switch (showPicker) {
      case 'start':
        return selectedPeriod.start || new Date(Date.now());
      case 'end':
        return selectedPeriod.end || new Date(Date.now());
      default:
        return new Date(Date.now());
    }
  };

  const handleClear = () => {
    setSelectAll(true);
    setSelectedPeriod({});
    setSelectedCurrencies(allCurrencies.map(currency => currency.acronym));
    setStartValue('DD/MM/YYYY');
    setEndValue('DD/MM/YYYY');
    setIsFiltered(false);
    setTransactionHistory(groupTransactionsByDate(transactions));
    setActiveTransactions(transactions);
    setFilterCleared(true);
    setIsFiltered(false);
  };

  const handleApply = async () => {
    try {
      const filteredTransactionsResult = filterCleared
        ? transactions
        : await getTransactions();
      const currencyFilter = () =>
        filteredTransactionsResult.filter(
          transaction =>
            selectedCurrencies.includes(transaction.currency) ||
            allCurrencies
              .filter(currency => selectedCurrencies.includes(currency.acronym))
              .map(currency => currency.currency)
              .includes(transaction.currency),
        );
      const periodFilter = filterCurrencies => {
        const transactionsSelected =
          filterCurrencies || filteredTransactionsResult;
        if (selectedPeriod.start && !selectedPeriod.end) {
          return transactionsSelected.filter(
            transaction =>
              new Date(transaction.updatedAt) >= new Date(selectedPeriod.start),
          );
        } else if (!selectedPeriod.start && selectedPeriod.end) {
          return transactionsSelected.filter(
            transaction =>
              new Date(transaction.updatedAt) <= new Date(selectedPeriod.end),
          );
        }
        return transactionsSelected.filter(
          transaction =>
            new Date(transaction.updatedAt) >= new Date(selectedPeriod.start) &&
            new Date(transaction.updatedAt) <= new Date(selectedPeriod.end),
        );
      };

      if (!selectedCurrencies.length) {
        ToastMessage('No currency selected in filter');
      } else if (!selectedPeriod.label) {
        setTransactionHistory(groupTransactionsByDate(currencyFilter()));
        setActiveTransactions(currencyFilter());
      } else {
        const currencyFilters = currencyFilter();
        const periodFilters = periodFilter(currencyFilters);
        setTransactionHistory(groupTransactionsByDate(periodFilters));
        setActiveTransactions(periodFilters);
        !filterCleared && setIsFiltered(true);
      }
      hideFilter();
    } catch (error) {}
  };

  return (
    <>
      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={hideFilter}>
        <SafeAreaView style={styles.flex}>
          <PageContainer padding paddingTop={20}>
            <Pressable onPress={hideFilter}>
              <IonIcon name="close" size={20} />
            </Pressable>
            <BoldText style={styles.headerText}>Filter</BoldText>
            <RegularText style={styles.subText}>Accounts</RegularText>
            <View style={styles.fields}>
              <View style={styles.labelContainer}>
                <RegularText style={styles.label}>Select Currency</RegularText>
              </View>
              <Pressable
                onPress={() => setModalOpen(true)}
                style={styles.selectInputContainer}>
                <View style={styles.selectInput}>
                  {selectedCurrencies.length ? (
                    <View style={styles.selected}>
                      {allCurrencies.length === selectedCurrencies.length ? (
                        <BoldText>All</BoldText>
                      ) : (
                        selectedCurrencies.map((currency, index) => (
                          <BoldText key={currency}>
                            {currency}
                            {index < selectedCurrencies.length - 1 && ', '}
                          </BoldText>
                        ))
                      )}
                    </View>
                  ) : (
                    <BoldText>No currency selected</BoldText>
                  )}
                  <ChevronDown />
                </View>
              </Pressable>
            </View>
            <RegularText style={styles.subText}>Period</RegularText>

            <ScrollView style={styles.periods} horizontal>
              {periods.map(period => (
                <Pressable
                  key={period.label}
                  style={
                    selectedPeriod.label === period.label
                      ? styles.periodSelected
                      : styles.period
                  }
                  onPress={() => {
                    setFilterCleared(false);
                    setSelectedPeriod(period);
                  }}>
                  <BoldText>{period.label}</BoldText>
                </Pressable>
              ))}
            </ScrollView>
            {selectedPeriod.label === 'Custom period' && (
              <View>
                {showPicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={defaultPickerDate()}
                    onChange={handleDatePicker}
                  />
                )}
                <Text style={styles.topUp}>Start Date</Text>
                <Pressable
                  onPress={() => setShowPicker('start')}
                  style={styles.dateTextInputContainer}>
                  <View
                    style={{
                      ...styles.dateTextInput,
                      ...styles.dateTextInputStyles,
                    }}>
                    <View style={styles.dateTextContainer}>
                      <View style={styles.calendarIcon}>
                        <CalendarIcon width={30} height={30} />
                        <RegularText style={styles.newDate}>
                          {new Date().getDate()}
                        </RegularText>
                      </View>
                      <RegularText>{startValue}</RegularText>
                    </View>
                  </View>
                </Pressable>
                <Text style={styles.topUp}>End Date</Text>
                <Pressable
                  style={styles.dateTextInputContainer}
                  onPress={() => setShowPicker('end')}>
                  <View
                    style={{
                      ...styles.dateTextInput,
                      ...styles.dateTextInputStyles,
                    }}>
                    <View style={styles.dateTextContainer}>
                      <View style={styles.calendarIcon}>
                        <CalendarIcon width={30} height={30} />
                        <RegularText style={styles.newDate}>
                          {new Date().getDate()}
                        </RegularText>
                      </View>
                      <RegularText>{endValue}</RegularText>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}
            <View style={styles.flexSpace}>
              <View style={styles.flexSpace} />
              <View style={styles.buttons}>
                <Button
                  text={'Clear all'}
                  style={{ ...styles.button, ...styles.buttonClear }}
                  color={'#000'}
                  onPress={handleClear}
                />
                <Button
                  text={'Apply'}
                  style={styles.button}
                  onPress={handleApply}
                />
              </View>
            </View>
          </PageContainer>
          <Modal
            visible={modalOpen}
            animationType="slide"
            transparent
            onRequestClose={handleModal}>
            <SafeAreaView style={styles.flex}>
              <Pressable style={styles.overlay} onPress={handleModal} />
              <View style={styles.modalContainer}>
                <View style={styles.modal}>
                  <Image
                    style={styles.bg}
                    source={require('../../assets/images/pageBg.png')}
                  />
                  <View style={styles.modalBorder} />
                  <View style={styles.modalHeader}>
                    <RegularText style={styles.textHeader}>
                      Accounts
                    </RegularText>
                  </View>

                  <ScrollView style={{ width: 100 + '%' }}>
                    <View style={styles.currency}>
                      <View style={styles.currencyIcon}>
                        <BoldText style={styles.headerText}>
                          Select All
                        </BoldText>
                      </View>

                      <View style={styles.checkbox}>
                        {selectAll ? (
                          <Pressable onPress={handleSelectAllClicked}>
                            <IonIcon name="radio-button-on" size={24} />
                          </Pressable>
                        ) : (
                          <Pressable onPress={handleSelectAllClicked}>
                            <IonIcon name="radio-button-off" size={24} />
                          </Pressable>
                        )}
                      </View>
                    </View>
                    <View style={styles.currencies}>
                      {allCurrencies
                        .filter(
                          currency =>
                            currency.currency === selectedCurrency.currency,
                        )
                        .map(selected => (
                          <Currency
                            key={selected.currency}
                            selected={selected}
                            setSelectAll={setSelectAll}
                            selectedCurrencies={selectedCurrencies}
                            setSelectedCurrencies={setSelectedCurrencies}
                            setFilterCleared={setFilterCleared}
                          />
                        ))}
                      {allCurrencies
                        .filter(
                          currency =>
                            currency.currency !== selectedCurrency.currency,
                        )
                        .map(selected => (
                          <Currency
                            key={selected.currency}
                            selected={selected}
                            setSelectAll={setSelectAll}
                            selectedCurrencies={selectedCurrencies}
                            setSelectedCurrencies={setSelectedCurrencies}
                            setFilterCleared={setFilterCleared}
                          />
                        ))}
                    </View>
                    <View style={styles.modalButtonContainer}>
                      <Button
                        text={'Apply'}
                        style={styles.modalButton}
                        onPress={handleModal}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerText: {
    fontSize: 22,
    marginVertical: 15,
  },
  subText: {
    fontSize: 18,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    height: 70 + '%',
    maxHeight: 700,
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
  modalHeader: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5 + '%',
  },
  textHeader: {
    fontSize: 24,
  },
  bg: {
    position: 'absolute',
    width: 100 + '%',
    height: 100 + '%',
  },
  textInputContainer: {
    width: 100 + '%',
    paddingHorizontal: 5 + '%',
  },
  textInput: {
    borderColor: 'rgba(0,0,0,0.7)',
    borderWidth: 2,
    paddingHorizontal: 14,
    borderRadius: 15,
    height: 50,
    fontFamily: 'OpenSans-600',
  },
  currencies: {
    flex: 1,
  },
  currency: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  currencyIcon: {
    gap: 20,
    flexDirection: 'row',
    flex: 1,
  },
  currencyName: {
    textTransform: 'capitalize',
  },
  checkbox: {
    fontSize: 22,
    paddingRight: 10,
  },
  modalButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: 5 + '%',
  },
  modalButton: {
    width: 100,
    height: 50,
    paddingVertical: 10,
    marginTop: 0,
  },
  fields: {
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
  selectInputContainer: {
    position: 'relative',
    marginTop: 5,
  },
  selectInput: {
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'OpenSans-600',
    backgroundColor: '#eee',
  },
  selected: {
    flexDirection: 'row',
  },
  periods: {
    marginVertical: 20,
    gap: 10,
    maxHeight: 40,
  },
  period: {
    paddingVertical: 10,
    justifyContent: 'center',
    marginRight: 10,
  },
  periodSelected: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#eee',
    justifyContent: 'center',
    marginRight: 10,
  },
  topUp: {
    fontFamily: 'OpenSans-600',
  },
  dateTextInputContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
  dateTextInput: {
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
  dateTextInputStyles: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    height: 60,
    marginBottom: 30,
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  currencyType: {
    textTransform: 'capitalize',
  },
  calendarIcon: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  newDate: {
    position: 'absolute',
  },
  flexSpace: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  button: {
    width: 48 + '%',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonClear: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
  },
});
export default FilterModal;

const Currency = ({
  selected,
  setSelectAll,
  selectedCurrencies,
  setSelectedCurrencies,
  setFilterCleared,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedCurrencies.includes(selected.acronym));
  }, [selected.acronym, selectedCurrencies]);

  const handleSelect = () => {
    setSelectedCurrencies(prev => {
      prev.length + 1 === allCurrencies.length
        ? !isSelected && setSelectAll(true)
        : setSelectAll(false);
      return isSelected
        ? prev.filter(currencies => currencies !== selected.acronym)
        : !prev.includes(selected.acronym)
          ? [...prev, selected.acronym]
          : prev;
    });
    setIsSelected(prev => !prev);
    setFilterCleared(false);
  };

  return (
    <Pressable
      key={selected.currency}
      style={styles.currency}
      onPress={handleSelect}>
      <View style={styles.currencyIcon}>
        <FlagSelect country={selected.currency} />
        <View>
          <BoldText>{selected.acronym}</BoldText>
          <RegularText style={styles.currencyName}>
            {selected.currency}
          </RegularText>
        </View>
      </View>
      <View style={styles.checkbox}>
        {isSelected ? <FilledCheckbox /> : <EmptyCheckbox />}
      </View>
    </Pressable>
  );
};
