import { Pressable, StyleSheet, View } from 'react-native';
import { addingDecimal } from '../../../../utils/AddingZero';
import BoldText from '../../../components/fonts/BoldText';
import { useContext, useEffect, useState } from 'react';
import { useAdminDataContext } from '../../../context/AdminContext';
import { AppContext } from '../../../components/AppContext';
import ChevronDown from '../../../../assets/images/chevron-down.svg';

const BalanceCard = () => {
  const { selectedCurrency } = useContext(AppContext);
  const { adminData, setModalOpen } = useAdminDataContext();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (adminData) {
      setBalance(adminData[`${selectedCurrency.currency}Balance`]);
    }
  }, [adminData, selectedCurrency.currency]);

  return (
    <View style={{ ...styles.cardHeader }}>
      <Pressable onPress={() => setModalOpen(true)} style={styles.plus}>
        <ChevronDown />
      </Pressable>
      <View style={styles.cardHeaderBalance}>
        <BoldText>Balance</BoldText>
      </View>
      <View>
        <BoldText style={styles.cardHeaderAmount}>
          {selectedCurrency.symbol + addingDecimal(balance.toLocaleString())}
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
    paddingHorizontal: 20,
    paddingVertical: 30,
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
