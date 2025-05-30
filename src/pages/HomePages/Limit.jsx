import React, { useContext } from 'react';
import { Image, FlatList, StyleSheet, View, Pressable } from 'react-native';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { addingDecimal } from '../../../utils/AddingZero';
import ToastMessage from '../../components/ToastMessage';
import { FontAwesome } from '@expo/vector-icons';

const Limit = ({ navigation }) => {
  const { appData, selectedCurrency } = useContext(AppContext);
  const { level = 1 } = appData;

  const limitTypes = [
    {
      level: 1,
      type: 'transfer',
      singleCredit: 'Unlimited',
      dailyCredit: 'Unlimited',
      singleDebit: 50000,
      dailyDebit: 50000,
    },
    {
      level: 2,
      type: 'transfer',
      singleCredit: 'Unlimited',
      dailyCredit: 'Unlimited',
      singleDebit: 300000,
      dailyDebit: 300000,
    },
    {
      level: 3,
      type: 'transfer',
      singleCredit: 'Unlimited',
      dailyCredit: 'Unlimited',
      singleDebit: 500000,
      dailyDebit: 500000,
    },
    {
      level: 4,
      type: 'transfer',
      singleCredit: 'Unlimited',
      dailyCredit: 'Unlimited',
      singleDebit: 1000000,
      dailyDebit: 1000000,
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

  const handleNavigate = limit => {
    level < limit.level
      ? navigation.navigate('LimitUpgrade', limit)
      : ToastMessage('Tier level has already been upgrade');
  };
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
            <View style={styles.limitHeaderRow}>
              <BoldText style={styles.limitHeader}>Lvl {limit.level}</BoldText>
              {limit.level - 1 === level && (
                <Pressable
                  onPress={() => handleNavigate(limit)}
                  style={styles.upgrade}>
                  <BoldText style={styles.upgradeLink}>
                    Upgrade <FontAwesome name="chevron-right" />
                  </BoldText>
                </Pressable>
              )}
            </View>
            <View style={styles.limitContent}>
              <View style={styles.row}>
                <RegularText>Single Credit:</RegularText>
                <BoldText>
                  {typeof limit.singleCredit === 'string'
                    ? limit.singleCredit
                    : selectedCurrency.symbol +
                      addingDecimal(limit.singleCredit.toLocaleString())}
                </BoldText>
              </View>
              <View style={styles.row}>
                <RegularText>Daily Credit:</RegularText>
                <BoldText>
                  {typeof limit.dailyCredit === 'string'
                    ? limit.dailyCredit
                    : selectedCurrency.symbol +
                      addingDecimal(limit.dailyCredit.toLocaleString())}
                </BoldText>
              </View>
              <View style={styles.row}>
                <RegularText>Single Debit:</RegularText>
                <BoldText>
                  {typeof limit.singleDebit === 'string'
                    ? limit.singleDebit
                    : selectedCurrency.symbol +
                      addingDecimal(limit.singleDebit.toLocaleString())}
                </BoldText>
              </View>
              <View style={styles.row}>
                <RegularText>Daily Debit:</RegularText>
                <BoldText>
                  {typeof limit.dailyDebit === 'string'
                    ? limit.dailyDebit
                    : selectedCurrency.symbol +
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
    width: 15,
    height: 15,
  },
  limitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  limitHeader: {
    textTransform: 'capitalize',
    fontSize: 18,
  },
  upgrade: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 2,
  },
  upgradeLink: {
    color: '#fff',
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
    color: '#000000',
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
