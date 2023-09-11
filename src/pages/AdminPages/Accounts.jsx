import { StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import { useAdminDataContext } from '../../context/AdminContext';

import CurrencyCard from '../../components/CurrencyCard';

const Accounts = () => {
  const { adminData } = useAdminDataContext();
  const { nairaBalance, dollarBalance, poundBalance, euroBalance } = adminData;

  const currencies = [
    {
      currency: 'naira',
      fullName: 'Nigerian Naira',
      balance: nairaBalance,
      acronym: 'NGN',
      symbol: '₦',
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
    <PageContainer style={styles.body} scroll>
      <BalanceCard />
      <View style={styles.balances}>
        <BoldText>Balance from all accounts</BoldText>
        {currencies.map(currency => (
          <CurrencyCard key={currency.currency} currencyIndex={currency} />
        ))}
      </View>
    </PageContainer>
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
    gap: 20,
  },
});

export default Accounts;
