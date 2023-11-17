import React, { useContext, useEffect } from 'react';
import PageContainer from '../../components/PageContainer';
import { View, StyleSheet } from 'react-native';
import CurrencyCard from '../../components/CurrencyCard';
import { useWalletContext } from '../../context/WalletContext';
import BoldText from '../../components/fonts/BoldText';
import { AppContext } from '../../components/AppContext';

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

  const currencies = [
    {
      accNo,
      currency: 'naira',
      fullName: 'Nigerian Naira',
      balance: localBalance,
      acronym: 'NGN',
      symbol: '₦',
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
    <PageContainer padding scroll>
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
export default AccountDetails;
