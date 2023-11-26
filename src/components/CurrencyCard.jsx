import { Image, View, StyleSheet } from 'react-native';
import { addingDecimal } from '../../utils/AddingZero';
import BoldText from './fonts/BoldText';
import RegularText from './fonts/RegularText';
import FlagSelect from './FlagSelect';
import AtmChevron from '../../assets/images/atmChevronRight.svg';
import { useContext } from 'react';
import { AppContext } from './AppContext';

const CurrencyCard = ({ currencyIndex }) => {
  const { isAdmin } = useContext(AppContext);
  const { acronym, accNo, balance, color, currency, fullName, symbol } =
    currencyIndex;

  return (
    <View style={{ ...styles.atm, backgroundColor: color }}>
      <Image
        source={require('../../assets/images/atmBgLeft.png')}
        style={styles.bg}
      />
      <Image
        source={require('../../assets/images/atmBgLeft.png')}
        style={styles.bgRight}
      />
      <View style={styles.atmInner}>
        <View style={styles.atmTop}>
          <Image
            source={require('../../assets/icon2.png')}
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
              {!isAdmin && (
                <View>
                  <View style={styles.atmBottom}>
                    <BoldText style={styles.fullName}>Account Number:</BoldText>
                    <RegularText style={styles.fullName}>{accNo}</RegularText>
                  </View>
                </View>
              )}
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

const styles = StyleSheet.create({
  atm: {
    flex: 1,
    width: 100 + '%',
    height: 220,
    borderRadius: 15,
    position: 'relative',
    // elevation: 20,

    marginBottom: 50,
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
    gap: 5,
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
export default CurrencyCard;
