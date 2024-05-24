/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import { useWalletContext } from '../context/WalletContext';
import BoldText from './fonts/BoldText';
import { View, StyleSheet } from 'react-native';
import { getShowBalance } from '../../utils/storage';
import { addingDecimal } from '../../utils/AddingZero';
import { AppContext } from './AppContext';

const WalletAmount = () => {
  const { wallet } = useWalletContext();
  const { vw, showAmount, setShowAmount } = useContext(AppContext);
  const [walletAmount, setWalletAmount] = useState('****');

  useEffect(() => {
    const getShowAmount = async () => {
      const status = await getShowBalance();
      setShowAmount(status);
    };
    getShowAmount();
    typeof wallet.balance === 'number'
      ? setWalletAmount(`${addingDecimal(wallet.balance?.toLocaleString())}`)
      : setWalletAmount('****');
  }, [setShowAmount, wallet]);

  let fontSize = vw / (walletAmount.length + 2);
  fontSize = fontSize > 30 ? 30 : 30;

  return (
    <View style={styles.eyeContainer}>
      <BoldText
        style={{
          ...styles.amount,
          transform: showAmount ? [] : [{ translateY: 10 }],
          fontSize: showAmount ? fontSize : 30,
        }}>
        {showAmount ? walletAmount : '****'}
      </BoldText>
    </View>
  );
};

const styles = StyleSheet.create({
  amount: {
    color: '#ccc',
    textAlignVertical: 'bottom',
  },
  eyeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default WalletAmount;
