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
  const { vw, showAmount, setShowAmount } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [walletAmount, setWalletAmount] = useState('****');

  useEffect(() => {
    const getShowAmount = async () => {
      const status = await getShowBalance();
      setShowAmount(status);
    };
    getShowAmount();
    wallet
      ? setWalletAmount(`${addingDecimal(wallet.balance?.toLocaleString())}`)
      : setWalletAmount('****');
  }, [setShowAmount, wallet]);

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  let fontSize = vw / (walletAmount.length + 2);
  fontSize = fontSize > 40 ? 40 : fontSize;

  return (
    <View style={styles.eyeContainer}>
      <BoldText
        style={{
          ...styles.amount,
          marginTop: showAmount ? undefined : 15,
          fontSize: showAmount ? fontSize : 30,
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
