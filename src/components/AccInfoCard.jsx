import React, { useContext } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppContext } from './AppContext';
import ChevronDown from '../../assets/images/chevron-down.svg';
import BoldText from './fonts/BoldText';
import RegularText from './fonts/RegularText';
import FlagSelect from './FlagSelect';

const AccInfoCard = () => {
  const { selectedCurrency } = useContext(AppContext);
  const walletAmount = 0;
  const pendingBalance = 0;

  return (
    <ImageBackground
      source={require('../../assets/images/cardBg.png')}
      resizeMode="cover"
      style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.amountContainer}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{selectedCurrency.symbol}</Text>
          </View>
          <View>
            <BoldText style={styles.amount}>{walletAmount}</BoldText>
            <View style={styles.flagContainer}>
              <RegularText style={styles.currrencyType}>
                {selectedCurrency.currency}
              </RegularText>
              <FlagSelect country={selectedCurrency.currency} />
            </View>
          </View>
        </View>
        <Pressable
          // onPress={() => setModalOpen(true)}
          style={styles.chevronDown}>
          <ChevronDown />
        </Pressable>
      </View>

      <View style={styles.cardHeader}>
        <View style={styles.cardDetails}>
          <RegularText style={styles.currrencyType}>
            Pending Balance:{' '}
            <BoldText>
              {selectedCurrency.symbol}
              {pendingBalance}
            </BoldText>
          </RegularText>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000',
    height: 180,
    width: 100 + '%',
    marginVertical: 30,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  symbolContainer: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 28,
    fontFamily: 'AlfaSlabOne-Regular',
    transform: [{ translateY: -4 }],
  },
  amount: {
    color: '#ccc',
    fontSize: 40,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currrencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
  },
  chevronDown: {},
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AccInfoCard;
