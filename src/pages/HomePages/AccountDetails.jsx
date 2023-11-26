import React, { useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import CurrencyCard from '../../components/CurrencyCard';
import { useWalletContext } from '../../context/WalletContext';
import BoldText from '../../components/fonts/BoldText';
import { AppContext } from '../../components/AppContext';
import { allCurrencies } from '../../database/data';

const AccountDetails = () => {
  const { setWalletRefresh } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const {
    loopayAccNo: accNo,
    localBalance,
    dollarBalance,
    poundBalance,
    euroBalance,
  } = wallet;

  const localCurrency = allCurrencies[0];
  const currencies = [
    {
      accNo,
      currency: localCurrency.currency,
      fullName: localCurrency.fullName,
      balance: localBalance,
      acronym: localCurrency.acronym,
      symbol: localCurrency.symbol,
      color: '#006E53',
    },
    {
      accNo,
      currency: 'dollar',
      fullName: 'United State Dollar',
      balance: dollarBalance,
      acronym: 'USD',
      symbol: '$',
      color: '#ED4C5C',
    },
    {
      accNo,
      currency: 'pound',
      fullName: 'Great British Pound',
      balance: poundBalance,
      acronym: 'GBP',
      symbol: '£',
      color: '#569AFF',
    },
    {
      accNo,
      currency: 'euro',
      fullName: 'European dollar',
      balance: euroBalance,
      acronym: 'EUR',
      symbol: '€',
      color: '#105AAD',
    },
  ];

  useEffect(() => {
    setWalletRefresh(prev => !prev);
  }, [setWalletRefresh]);
  return (
    <View style={styles.body}>
      <FlatList
        data={currencies}
        renderItem={({ item }) => (
          <CurrencyCard key={item.currency} currencyIndex={item} />
        )}
        keyExtractor={({ currency }) => currency}
        ListHeaderComponent={
          <BoldText style={styles.header}>Balance from all accounts</BoldText>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 30,
  },

  body: {
    paddingHorizontal: 5 + '%',
  },
  balances: {},
});
export default AccountDetails;
