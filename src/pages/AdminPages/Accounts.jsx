import { ScrollView, StyleSheet, View } from 'react-native';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import { useAdminDataContext } from '../../context/AdminContext';

import CurrencyCard from '../../components/CurrencyCard';
import { allCurrencies } from '../../database/data';

const Accounts = () => {
  const { adminData } = useAdminDataContext();
  const { localBalance, dollarBalance, poundBalance, euroBalance } = adminData;

  const localCurrency = allCurrencies[0];
  const currencies = [
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
      fullName: 'United State Dollar',
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
      fullName: 'European dollar',
      balance: euroBalance,
      acronym: 'EUR',
      symbol: '€',
      color: '#105AAD',
    },
  ];

  return (
    <ScrollView style={styles.body}>
      <BalanceCard />
      <View style={styles.balances}>
        <BoldText>Balance from all accounts</BoldText>
        {currencies.map(currency => (
          <CurrencyCard key={currency.currency} currencyIndex={currency} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingBottom: 50,
    paddingHorizontal: 5 + '%',
  },
  balances: {
    marginTop: 30,
    marginBottom: 50,
    gap: 30,
  },
});

export default Accounts;
