/* eslint-disable react-native/no-inline-styles */
import PageContainer from '../../components/PageContainer';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import BackIcon from '../../../assets/images/backArrow.svg';
import BoldText from '../../components/fonts/BoldText';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import { useContext, useEffect, useState } from 'react';
import RegularText from '../../components/fonts/RegularText';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';
import { allCurrencies } from '../../database/data';
import { getFetchData, putFetchData } from '../../../utils/fetchAPI';
import ErrorMessage from '../../components/ErrorMessage';
import { useAdminDataContext } from '../../context/AdminContext';
import AdminSelectCurrencyModal from './components/AdminSelectCurrency';

const Rate = ({ navigation }) => {
  const { selectedCurrency, vh, setIsLoading } = useContext(AppContext);
  const [defaultTab, setDefaultTab] = useState(0);
  const { setModalFunc, setModalOpen } = useAdminDataContext();
  const [swapFrom, setSwapFrom] = useState(selectedCurrency);
  const [swapTo, setSwapTo] = useState(
    allCurrencies.find(
      currency => currency.currency !== selectedCurrency.currency,
    ),
  );
  const [allRates, setAllRates] = useState([]);
  const [allFees, setAllFees] = useState([]);
  const [updatedFee, setUpdatedFee] = useState({});
  const [updatedFees, setUpdatedFees] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedRate, setSelectedRate] = useState(null);
  const [selectedSwapName, setSelectedSwapName] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newFee, setNewFee] = useState('');
  const [rateRefetch, setRateRefetch] = useState(false);
  const [newRateData, setNewRateData] = useState({
    currency: null,
    rate: null,
    fee: null,
  });

  useEffect(() => {
    const getRates = async () => {
      const response = await getFetchData('admin/rate');
      response.status === 200 && setAllRates(response.data);
    };
    const getFees = async () => {
      const response = await getFetchData('admin/fees');
      response.status === 200 && setAllFees(response.data);
    };
    !defaultTab ? getRates() : getFees();
  }, [defaultTab, rateRefetch]);

  useEffect(() => {
    setSelectedSwapName(
      swapFrom.currency.charAt(0).toUpperCase() +
        swapFrom.currency.slice(1) +
        'To' +
        swapTo.currency.charAt(0).toUpperCase() +
        swapTo.currency.slice(1),
    );
  }, [swapFrom.currency, swapTo.currency]);

  useEffect(() => {
    const selectedRateName = allRates.find(
      rate => rate.currency === selectedSwapName,
    );
    setSelectedRate(selectedRateName);
    setNewRateData(selectedRateName);
  }, [allRates, selectedSwapName]);

  const handleSwapFrom = () => {
    setModalOpen(true);
    const swapFromFunc = selected => {
      setSwapFrom(selected);
      if (swapTo.currency === selected.currency) {
        setSwapTo(
          allCurrencies.find(
            currency => currency.currency !== selected.currency,
          ),
        );
      }
    };
    setModalFunc(() => swapFromFunc);
  };

  const handleSwapTo = () => {
    setModalOpen(true);
    const swapToFunc = selected => {
      setSwapTo(selected);
      if (swapFrom.currency === selected.currency) {
        setSwapFrom(
          allCurrencies.find(
            currency => currency.currency !== selected.currency,
          ),
        );
      }
    };
    setModalFunc(() => swapToFunc);
  };

  const handleUpdate = async () => {
    try {
      if (!newRate && !newFee) {
        throw new Error('Please input a new rate or fee');
      }
      setIsLoading(true);
      const response = await putFetchData('admin/rate', newRateData);
      if (response.status === 200) {
        setRateRefetch(prev => !prev);
        setNewRate('');
        setNewFee('');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFees = async () => {
    try {
      setIsLoading(true);
      const response = await putFetchData('admin/fees', updatedFees);
      if (response.status === 200) {
        setRateRefetch(prev => !prev);
        setUpdatedFees([]);
        setUpdatedFee({});
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFields = [
    ...allCurrencies.map(currency => {
      return {
        feeName: `Transfer to other bank's fee in ${currency.acronym}`,
        index: `transfer_others_in_${currency.acronym}`,
        group: 'transferOthers',
        currency: currency.currency,
        amount: 0,
      };
    }),
    ...allCurrencies.map(currency => {
      return {
        feeName: `Tax fee for ${currency.acronym}`,
        index: `tax_in_${currency.acronym}`,
        group: 'tax',
        currency: currency.currency,
        amount: 0,
      };
    }),
  ];

  return (
    <PageContainer style={styles.container} scroll>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <BackIcon />
          <BoldText style={styles.headerText}>Currency rate</BoldText>
        </Pressable>
      </View>
      <View style={styles.bodySelectors}>
        <Pressable
          style={{
            ...styles.bodySelector,
            backgroundColor: !defaultTab ? '#525252' : '#d0d1d2',
          }}
          onPress={() => setDefaultTab(0)}>
          <BoldText
            style={{
              color: !defaultTab ? '#fff' : '#1E1E1E',
            }}>
            Rates
          </BoldText>
        </Pressable>
        <Pressable
          style={{
            ...styles.bodySelector,
            backgroundColor: defaultTab ? '#525252' : '#d0d1d2',
          }}
          onPress={() => setDefaultTab(1)}>
          <BoldText
            style={{
              color: defaultTab ? '#fff' : '#1E1E1E',
            }}>
            Fees
          </BoldText>
        </Pressable>
      </View>
      <View style={{ ...styles.body, minHeight: vh * 0.8 }}>
        {!defaultTab ? (
          <>
            <View>
              <RegularText style={styles.label}>Swap From</RegularText>
              <Pressable style={styles.input} onPress={handleSwapFrom}>
                <BoldText style={styles.inputText}>
                  {swapFrom.symbol} {swapFrom.acronym} - {swapFrom.fullName}
                </BoldText>
                <ChevronDown />
              </Pressable>
            </View>
            <View>
              <RegularText style={styles.label}>Swap To</RegularText>
              <Pressable style={styles.input} onPress={handleSwapTo}>
                <BoldText style={styles.inputText}>
                  {swapTo.symbol} {swapTo.acronym} - {swapTo.fullName}
                </BoldText>
                <ChevronDown />
              </Pressable>
            </View>
            <View>
              <RegularText style={styles.label}>Current rate</RegularText>
              <Pressable style={{ ...styles.input, ...styles.input2 }}>
                <BoldText style={{ ...styles.inputText, ...styles.inputText2 }}>
                  {swapFrom.symbol}1 = {swapTo.symbol}
                  {selectedRate?.rate}
                </BoldText>
                <RegularText style={styles.fee}>
                  {selectedRate?.fee}% fee{selectedRate?.fee > 1 && 's'}
                </RegularText>
              </Pressable>
            </View>
            <View>
              <RegularText style={styles.label}>Input new rate</RegularText>
              <TextInput
                style={{ ...styles.input, ...styles.inputText }}
                inputMode="decimal"
                onChangeText={text => {
                  setNewRate(text);
                  setNewRateData(prev => {
                    return {
                      ...prev,
                      rate: text,
                    };
                  });
                }}
                onFocus={() => setErrorMessage('')}
                value={newRate}
              />
            </View>
            <View>
              <RegularText style={styles.label}>Service Charge</RegularText>
              <View style={styles.inputContainer}>
                <BoldText style={styles.inputSymbol}>%</BoldText>
                <TextInput
                  style={styles.inputAbsolute}
                  inputMode="decimal"
                  onChangeText={text => {
                    setNewFee(text);
                    setNewRateData(prev => {
                      return {
                        ...prev,
                        fee: text,
                      };
                    });
                  }}
                  onFocus={() => setErrorMessage('')}
                  value={newFee}
                />
              </View>
            </View>
            <ErrorMessage
              errorMessage={errorMessage}
              style={styles.errorMessage}
            />
            <View style={styles.button}>
              <Button text="Update Rate" onPress={handleUpdate} />
            </View>
          </>
        ) : (
          <>
            {updateFields.map(updateField => (
              <Fees
                key={updateField.index}
                updateField={updateField}
                currentInput={currentInput}
                setCurrentInput={setCurrentInput}
                allFees={allFees}
                updatedFees={updatedFees}
                setUpdatedFees={setUpdatedFees}
                updatedFee={updatedFee}
                setUpdatedFee={setUpdatedFee}
              />
            ))}
            <Button text="Update Fees" onPress={handleUpdateFees} />
          </>
        )}
      </View>
      <AdminSelectCurrencyModal />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 5 + '%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerText: {
    fontSize: 20,
  },
  bodySelectors: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  bodySelector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 10,
  },
  selectedTab: {
    backgroundColor: 'red',
  },
  body: {
    paddingHorizontal: 5 + '%',
    paddingVertical: 3 + '%',
    gap: 30,
  },
  label: {
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    height: 55,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    borderWidth: 1,
  },
  input2: {
    backgroundColor: '#1e1e1e',
  },
  inputText: {
    fontSize: 18,
  },
  inputText2: {
    color: '#fff',
  },
  inputContainer: {
    position: 'relative',
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
  },
  fee: {
    color: '#bbb',
  },
  inputSymbol: {
    fontSize: 18,
    paddingLeft: 15,
  },
  inputAbsolute: {
    width: 95 + '%',
    fontSize: 18,
    fontFamily: 'OpenSans-600',
    padding: 15,
    paddingLeft: 0,
  },
  feeInputContainer: {
    position: 'relative',
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
  },
  feeInput: {
    width: 95 + '%',
    fontSize: 18,
    fontFamily: 'OpenSans-600',
    padding: 15,
    paddingLeft: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 50,
  },
});

export default Rate;

const Fees = ({
  updateField,
  setUpdatedFee,
  allFees,
  updatedFees,
  updatedFee,
  setUpdatedFees,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [currentInput, setCurrentInput] = useState(updateField.fee);

  const value =
    updatedFees.find(fee => fee.feeName === updateField.index)?.amount ||
    allFees.find(fee => fee.feeName === updateField.index)?.amount ||
    '0';

  return (
    <View>
      <View key={updateField.feeName}>
        <View>
          <RegularText style={styles.label}>{updateField.feeName}</RegularText>
          <View style={styles.feeInputContainer}>
            <TextInput
              style={styles.feeInput}
              inputMode="decimal"
              onChangeText={text => {
                setInputFocused(true);
                setCurrentInput(text);
                setUpdatedFee({
                  feeName: updateField.index,
                  amount: Number(text),
                  currency: updateField.currency,
                  group: updateField.group,
                });
              }}
              value={`${inputFocused ? currentInput : value}`}
              onBlur={() => {
                updatedFee.amount &&
                  setUpdatedFees(prev => {
                    return [
                      ...prev.filter(i => i.feeName !== updatedFee.feeName),
                      updatedFee,
                    ];
                  });
                setInputFocused(false);
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
