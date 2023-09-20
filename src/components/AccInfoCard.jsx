import React, { useContext, useEffect, useState } from 'react';
import {
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
import WalletAmount from './WalletAmount';
import SelectCurrencyModal from './SelectCurrencyModal';
import { useWalletContext } from '../context/WalletContext';
import { addingDecimal } from '../../utils/AddingZero';

const AccInfoCard = () => {
  const { selectedCurrency } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const { wallet, transactions } = useWalletContext();
  const [showAmount, setShowAmount] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    const pending = transactions
      .filter(
        transaction =>
          transaction.status === 'pending' &&
          transaction.currency === selectedCurrency.currency,
      )
      .map(balance => Number(balance.amount));
    !pending.length && pending.push(0);
    setPendingAmount(pending?.reduce((a, b) => a + b));
  }, [selectedCurrency, transactions]);

  const pendingBalance = addingDecimal(
    (wallet.balance + pendingAmount).toLocaleString(),
  );

  return (
    <>
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
              <WalletAmount
                showAmount={showAmount}
                setShowAmount={setShowAmount}
              />
              <View style={styles.flagContainer}>
                <RegularText style={styles.currencyType}>
                  {selectedCurrency.currency}
                </RegularText>
                <FlagSelect country={selectedCurrency.currency} />
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => setModalOpen(true)}
            style={styles.chevronDown}>
            <ChevronDown />
          </Pressable>
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.cardDetails}>
            <RegularText style={styles.currencyType}>
              Book Balance:{' '}
              <BoldText>
                {showAmount ? selectedCurrency.symbol + pendingBalance : '****'}
              </BoldText>
            </RegularText>
          </View>
        </View>
      </ImageBackground>
      <SelectCurrencyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
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
  currencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
    textTransform: 'capitalize',
  },
  chevronDown: {},
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AccInfoCard;
