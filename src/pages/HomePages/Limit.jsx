import React, { useContext } from 'react';
import { Image, FlatList, StyleSheet, View } from 'react-native';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { addingDecimal } from '../../../utils/AddingZero';
import { allCurrencies } from '../../database/data';

const Limit = () => {
  const { appData } = useContext(AppContext);
  const localCurrencySymbol = allCurrencies[0].symbol;
  const { level = 1 } = appData;

  const limitTypes = [
    {
      level: 1,
      type: 'transfer',
      singleCredit: 100000,
      dailyCredit: 500000,
      singleDebit: 50000,
      dailyDebit: 200000,
    },
    {
      level: 2,
      type: 'transfer',
      singleCredit: 5000000,
      dailyCredit: 5000000,
      singleDebit: 900000,
      dailyDebit: 900000,
    },
    {
      level: 3,
      type: 'transfer',
      singleCredit: 'Unlimited',
      dailyCredit: 'Unlimited',
      singleDebit: 5000000,
      dailyDebit: 25000000,
    },
    {
      level: 4,
      type: 'transfer',
      singleCredit: 'Unlimited',
      dailyCredit: 'Unlimited',
      singleDebit: 5000000,
      dailyDebit: 25000000,
    },
    {
      level: 5,
      type: 'transfer',
      singleCredit: 'Unlimited',
      dailyCredit: 'Unlimited',
      singleDebit: 'Unlimited',
      dailyDebit: 'Unlimited',
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={limitTypes}
        ListHeaderComponent={
          <View style={styles.header}>
            <Header
              title={'Limit Settings'}
              text={'View all transaction limits'}
            />
          </View>
        }
        renderItem={({ item: limit }) => (
          <View key={limit.level} style={styles.limit}>
            {level === limit.level && (
              <View style={styles.current}>
                <Image
                  source={require('../../../assets/images/crown.png')}
                  style={styles.crown}
                />
                <BoldText style={styles.currentText}>Current</BoldText>
              </View>
            )}
            <BoldText style={styles.limitHeader}>Lvl {limit.level}</BoldText>
            <View style={styles.limitContent}>
              <View style={styles.row}>
                <RegularText>Single Credit:</RegularText>
                <BoldText>
                  {typeof limit.singleCredit === 'string'
                    ? limit.singleCredit
                    : localCurrencySymbol +
                      addingDecimal(limit.singleCredit.toLocaleString())}
                </BoldText>
              </View>
              <View style={styles.row}>
                <RegularText>Daily Credit:</RegularText>
                <BoldText>
                  {typeof limit.dailyCredit === 'string'
                    ? limit.dailyCredit
                    : localCurrencySymbol +
                      addingDecimal(limit.dailyCredit.toLocaleString())}
                </BoldText>
              </View>
              <View style={styles.row}>
                <RegularText>Single Debit:</RegularText>
                <BoldText>
                  {typeof limit.singleDebit === 'string'
                    ? limit.singleDebit
                    : localCurrencySymbol +
                      addingDecimal(limit.singleDebit.toLocaleString())}
                </BoldText>
              </View>
              <View style={styles.row}>
                <RegularText>Daily Debit:</RegularText>
                <BoldText>
                  {typeof limit.dailyDebit === 'string'
                    ? limit.dailyDebit
                    : localCurrencySymbol +
                      addingDecimal(limit.dailyDebit.toLocaleString())}
                </BoldText>
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item.level}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 4 + '%',
    marginHorizontal: 3 + '%',
    paddingBottom: 30,
  },
  header: { gap: 15, marginBottom: 30 },
  form: {
    flex: 1,
    paddingVertical: 30,
    minHeight: 150,
  },
  limit: {
    elevation: 5,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 15,
    marginBottom: 50,
    position: 'relative',
    overflow: 'hidden',
  },
  current: {
    position: 'absolute',
    right: 0,
    padding: 10,
    paddingVertical: 5,
    backgroundColor: '#1e1e1e',
    elevation: 5,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  currentText: {
    color: '#fff',
  },
  crown: {
    width: 25,
    height: 25,
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
