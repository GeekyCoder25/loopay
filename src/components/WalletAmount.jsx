/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import { useWalletContext } from '../context/WalletContext';
import BoldText from './fonts/BoldText';
import { Pressable, View, StyleSheet } from 'react-native';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { getShowBalance, setShowBalance } from '../../utils/storage';
import { addingDecimal } from '../../utils/AddingZero';
import { AppContext } from './AppContext';

const WalletAmount = () => {
  const { vw } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [walletAmount, setWalletAmount] = useState('****');
  const [showAmount, setShowAmount] = useState(false);

  useEffect(() => {
    const getShowAmount = async () => {
      const status = await getShowBalance();
      setShowAmount(status);
    };
    getShowAmount();
    wallet
      ? setWalletAmount(`${addingDecimal(wallet.balance?.toLocaleString())}`)
      : setWalletAmount('****');
  }, [wallet]);

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  return (
    <View style={styles.eyeContainer}>
      <BoldText
        style={{
          ...styles.amount,
          marginTop: showAmount ? undefined : 15,
          fontSize: showAmount
            ? walletAmount.length > 8
              ? vw > 400
                ? 40
                : 25
              : 40
            : 30,
        }}>
        {showAmount ? walletAmount : '****'}
      </BoldText>
      {wallet && (
        <Pressable style={styles.eye} onPress={handleShow}>
          <FaIcon
            name={showAmount ? 'eye-slash' : 'eye'}
            size={25}
            color={'#fff'}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  amount: {
    color: '#ccc',
  },
  eyeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eye: {
    marginLeft: 20,
  },
});
export default WalletAmount;
