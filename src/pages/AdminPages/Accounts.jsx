import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import { useAdminDataContext } from '../../context/AdminContext';
import FlagSelect from '../../components/FlagSelect';
import { addingDecimal } from '../../../utils/AddingZero';
import AtmChevron from '../../../assets/images/atmChevronRight.svg';
import RegularText from '../../components/fonts/RegularText';

const Accounts = () => {
  const { adminData } = useAdminDataContext();
  const { nairaBalance, dollarBalance, poundBalance, euroBalance } = adminData;

  const currencies = [
    {
      currency: 'Naira',
      fullName: 'Nigerian Naira',
      balance: nairaBalance,
      acronym: 'NGN',
      symbol: '₦',
      color: '#006E53',
    },
    {
      currency: 'Dollar',
      fullName: 'United State Dollar',
      balance: dollarBalance,
      acronym: 'USD',
      symbol: '$',
      color: '#ED4C5C',
    },
    {
      currency: 'Pound',
      fullName: 'Great British Pound',
      balance: poundBalance,
      acronym: 'GBP',
      symbol: '£',
      color: '#569AFF',
    },
    {
      currency: 'Euro',
      fullName: 'European dollar',
      balance: euroBalance,
      acronym: 'EUR',
      symbol: '€',
      color: '#105AAD',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <PageContainer style={styles.body}>
        <BalanceCard />
        <View style={styles.balances}>
          <BoldText>Balance from all accounts</BoldText>
          {currencies.map(currency => (
            <CurrencyCard key={currency.currency} currencyIndex={currency} />
          ))}
        </View>
      </PageContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    paddingHorizontal: 5 + '%',
  },
  balances: {
    marginTop: 30,
    marginBottom: 50,
    gap: 20,
  },
  atm: {
    flex: 1,
    width: 100 + '%',
    height: 220,
    borderRadius: 15,
    position: 'relative',
    elevation: 20,
  },
  bg: {
    position: 'absolute',
    left: -50,
    bottom: -30,
  },
  bgRight: {
    position: 'absolute',
    right: -55,
    bottom: -50,
  },
  atmInner: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    gap: 20,
  },
  atmTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
  },
  loopay: {
    color: 'rgba(238, 238, 238, 0.7)',
    fontSize: 18,
    fontFamily: 'OpenSans-800',
  },
  flagContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  flag: {
    width: 40,
    height: 40,
  },
  atmBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  atmDetails: {
    gap: 20,
  },
  balance: {
    color: '#fff',
    fontSize: 24,
  },
  fullName: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  atmChevron: {
    marginRight: -10,
  },
});

export default Accounts;

const CurrencyCard = ({ currencyIndex }) => {
  const { acronym, balance, color, currency, fullName, symbol } = currencyIndex;
  return (
    <View style={{ ...styles.atm, backgroundColor: color }}>
      <Image
        source={require('../../../assets/images/atmBgLeft.png')}
        style={styles.bg}
      />
      <Image
        source={require('../../../assets/images/atmBgLeft.png')}
        style={styles.bgRight}
      />
      <View style={styles.atmInner}>
        <View style={styles.atmTop}>
          <Image
            source={require('../../../assets/icon2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.flagContainer}>
            <BoldText style={styles.loopay}>LOOPAY</BoldText>
            <FlagSelect country={currency} style={styles.flag} />
          </View>
        </View>
        <View style={styles.atmBottom}>
          <View style={styles.atmDetails}>
            <BoldText style={styles.balance}>
              {`${symbol}${
                balance
                  ? addingDecimal(balance.toLocaleString())
                  : addingDecimal('0')
              }`}
            </BoldText>
            <View>
              <BoldText style={styles.balance}>{acronym}</BoldText>
              <RegularText style={styles.fullName}>{fullName}</RegularText>
            </View>
          </View>
          <View style={styles.atmChevron}>
            <AtmChevron width={50} height={60} />
          </View>
        </View>
      </View>
    </View>
  );
};
