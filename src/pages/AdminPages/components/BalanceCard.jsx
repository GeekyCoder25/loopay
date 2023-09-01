/* eslint-disable react-native/no-inline-styles */
import { Pressable, StyleSheet, View } from 'react-native';
import Plus from '../../../../assets/images/adminPlus.svg';
import { addingDecimal } from '../../../../utils/AddingZero';
import BoldText from '../../../components/fonts/BoldText';
import { useEffect, useState } from 'react';
import { useAdminDataContext } from '../../../context/AdminContext';
const BalanceCard = ({ showPlus }) => {
  const { adminData } = useAdminDataContext();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (adminData) {
      setBalance(adminData.nairaBalance);
    }
  }, [adminData]);

  return (
    <View style={{ ...styles.cardHeader, paddingTop: showPlus ? 20 : 40 }}>
      <Pressable style={styles.plus} on Press={() => console.log('shit')}>
        {showPlus && <Plus />}
      </Pressable>
      <View style={styles.cardHeaderBalance}>
        <BoldText>Balance</BoldText>
      </View>
      <View>
        <BoldText style={styles.cardHeaderAmount}>
          ₦{addingDecimal(balance.toLocaleString())}
        </BoldText>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardHeader: {
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  plus: {
    alignSelf: 'flex-end',
  },
  cardHeaderBalance: {
    backgroundColor: '#e4e2e2',
    padding: 5,
    paddingHorizontal: 30,
    borderRadius: 4,
  },
  cardHeaderAmount: {
    color: '#fff',
    fontSize: 28,
    marginTop: 25,
  },
});
export default BalanceCard;
