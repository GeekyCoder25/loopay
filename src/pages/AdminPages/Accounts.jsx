import { FlatList, StyleSheet, View } from 'react-native';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import { useAdminDataContext } from '../../context/AdminContext';

import CurrencyCard from '../../components/CurrencyCard';
import { allCurrencies } from '../../database/data';
import { useContext } from 'react';
import { AppContext } from '../../components/AppContext';

const Accounts = () => {
  const { selectedCurrency } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const { localBalance, dollarBalance, poundBalance, euroBalance } =
    adminData?.allBalances;

  const localCurrency = allCurrencies[0];
  const unArrangedCurrencies = [
    {
      currency: localCurrency.currency,
      fullName: localCurrency.fullName,
      balance: localBalance,
      acronym: localCurrency.acronym,
      symbol: localCurrency.symbol,
      color: '#006E53',
    },
    {
      currency: 'dollar',
      fullName: 'United States Dollar',
      balance: dollarBalance,
      acronym: 'USD',
      symbol: '$',
      color: '#ED4C5C',
    },
    {
      currency: 'pound',
      fullName: 'Great British Pound',
      balance: poundBalance,
      acronym: 'GBP',
      symbol: '£',
      color: '#569AFF',
    },
    {
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

  return (
    <View style={styles.body}>
      <FlatList
        data={currencies}
        renderItem={({ item }) => (
          <CurrencyCard key={item.currency} currencyIndex={item} />
        )}
        keyExtractor={({ currency }) => currency}
        ListHeaderComponent={
          <>
            <BalanceCard />
            <BoldText style={styles.header}>Balance from all accounts</BoldText>
          </>
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
});

export default Accounts;
