/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import BoldText from './fonts/BoldText';
import { Pressable, View, StyleSheet } from 'react-native';
import FaIcon from '@expo/vector-icons/FontAwesome';

const WalletAmount = () => {
  const wallet = useWalletContext();
  const [walletAmount, setWalletAmount] = useState('****');
  const [showAmount, setShowAmount] = useState(true);

  useEffect(() => {
    wallet &&
      setWalletAmount(
        `${wallet?.balance}${
          wallet?.balance?.toString().includes('.') ? '' : '.00'
        }`,
      );
  }, [wallet]);

  return (
    <View style={styles.eyeContainer}>
      <BoldText
        style={{
          ...styles.amount,
          marginTop: showAmount ? undefined : 15,
          fontSize: showAmount ? 40 : 30,
        }}>
        {showAmount ? walletAmount : '****'}
      </BoldText>
      {wallet && (
        <Pressable
          style={styles.eye}
          onPress={() => setShowAmount(prev => !prev)}>
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
