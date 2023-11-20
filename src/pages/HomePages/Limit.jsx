import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { addingDecimal } from '../../../utils/AddingZero';

const Limit = () => {
  const { selectedCurrency, vh } = useContext(AppContext);

  const limitTypes = [
    {
      level: 1,
      type: 'transfer',
      singleCredit: 900000,
      dailyCredit: 5000000,
      singleDebit: 50000,
      dailyDebit: 200000,
    },
    {
      level: 2,
      type: 'transfer',
      singleCredit: 900000,
      dailyCredit: 5000000,
      singleDebit: 50000,
      dailyDebit: 200000,
    },
    {
      level: 3,
      type: 'transfer',
      singleCredit: 900000,
      dailyCredit: 5000000,
      singleDebit: 50000,
      dailyDebit: 200000,
    },
    {
      level: 4,
      type: 'transfer',
      singleCredit: 900000,
      dailyCredit: 5000000,
      singleDebit: 50000,
      dailyDebit: 200000,
    },
  ];
  return (
    <PageContainer padding scroll>
      <View style={{ ...styles.container, minHeight: vh * 0.5 }}>
        <View style={styles.header}>
          <Header
            title={'Limit Settings'}
            text={'View all transaction limits'}
          />
        </View>
        <View style={styles.levels}>
          {limitTypes.map(limit => (
            <View key={limit.level} style={styles.limit}>
              <BoldText style={styles.limitHeader}>Lvl {limit.level}</BoldText>
              <View style={styles.limitContent}>
                <View style={styles.row}>
                  <RegularText>Single Credit:</RegularText>
                  <BoldText>
                    {selectedCurrency.symbol}
                    {addingDecimal(limit.singleCredit.toLocaleString())}
                  </BoldText>
                </View>
                <View style={styles.row}>
                  <RegularText>Daily Credit:</RegularText>
                  <BoldText>
                    {selectedCurrency.symbol}
                    {addingDecimal(limit.dailyCredit.toLocaleString())}
                  </BoldText>
                </View>
                <View style={styles.row}>
                  <RegularText>Single Debit:</RegularText>
                  <BoldText>
                    {selectedCurrency.symbol}
                    {addingDecimal(limit.singleDebit.toLocaleString())}
                  </BoldText>
                </View>
                <View style={styles.row}>
                  <RegularText>Daily Debit:</RegularText>
                  <BoldText>
                    {selectedCurrency.symbol}
                    {addingDecimal(limit.dailyDebit.toLocaleString())}
                  </BoldText>
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* <View style={styles.form}>
          <View>
            <RegularText>Enter new Transaction Limit:</RegularText>
            <View style={styles.textInputContainer}>
              <TextInput
                style={{
                  ...styles.textInput,
                }}
                onChangeText={text => {}}
                inputMode={'numeric'}
              />
            </View>
          </View>
          <View>
            <RegularText>Enter password to continue</RegularText>
            <View style={styles.textInputContainer}>
              <TextInput
                style={{
                  ...styles.textInput,
                }}
                onChangeText={text => {}}
                inputMode={'numeric'}
                // onFocus={() => setInputFocus(true)}
                // onBlur={() => setInputFocus(false)}
              />
            </View>
          </View>
        </View> */}
        {/* <View style={styles.button}>
          <Button text={'Update Limit'} />
        </View> */}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 4 + '%',
  },
  header: { gap: 15, marginBottom: 30 },
  form: {
    flex: 1,
    paddingVertical: 30,
    minHeight: 150,
  },
  levels: {
    paddingHorizontal: 3 + '%',
    gap: 50,
    paddingBottom: 30,
  },
  limit: {
    elevation: 5,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 15,
  },
  limitHeader: {
    textTransform: 'capitalize',
    marginBottom: 20,
    fontSize: 18,
  },
  limitContent: {
    gap: 15,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInputContainer: {
    marginTop: 5,
    marginBottom: 30,
  },
  textInput: {
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: 'flex-start',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
  },
});
export default Limit;
