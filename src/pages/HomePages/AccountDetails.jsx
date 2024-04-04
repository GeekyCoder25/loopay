import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CurrencyCard from '../../components/CurrencyCard';
import { useWalletContext } from '../../context/WalletContext';
import BoldText from '../../components/fonts/BoldText';
import { AppContext } from '../../components/AppContext';
import { allCurrencies } from '../../database/data';

const AccountDetails = () => {
  const { setWalletRefresh, selectedCurrency } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const {
    accNo,
    loopayAccNo,
    localBalance,
    dollarBalance,
    poundBalance,
    euroBalance,
  } = wallet;

  const localCurrency = allCurrencies[0];
  const unArrangedCurrencies = [
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
      accNo: loopayAccNo,
      currency: 'dollar',
      fullName: 'United States Dollar',
      balance: dollarBalance,
      acronym: 'USD',
      symbol: '$',
      color: '#ED4C5C',
    },
    {
      accNo: loopayAccNo,
      currency: 'pound',
      fullName: 'Great British Pound',
      balance: poundBalance,
      acronym: 'GBP',
      symbol: '£',
      color: '#569AFF',
    },
    {
      accNo: loopayAccNo,
      currency: 'euro',
      fullName: 'European Euro',
      balance: euroBalance,
      acronym: 'EUR',
      symbol: '€',
      color: '#105AAD',
    },
  ];
  const currencies = [
    ...unArrangedCurrencies.filter(
      currency => currency.acronym === selectedCurrency.acronym,
    ),
    ...unArrangedCurrencies.filter(
      currency => currency.acronym !== selectedCurrency.acronym,
    ),
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
