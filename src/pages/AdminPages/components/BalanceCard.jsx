import { Pressable, StyleSheet, View } from 'react-native';
import { addingDecimal } from '../../../../utils/AddingZero';
import BoldText from '../../../components/fonts/BoldText';
import { useContext, useEffect, useState } from 'react';
import { useAdminDataContext } from '../../../context/AdminContext';
import { AppContext } from '../../../components/AppContext';
import ChevronDown from '../../../../assets/images/chevron-down.svg';
import { getShowBalance, setShowBalance } from '../../../../utils/storage';

const BalanceCard = () => {
  const { selectedCurrency, showAmount, setShowAmount } =
    useContext(AppContext);
  const { adminData, setModalOpen } = useAdminDataContext();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    getShowBalance().then(status => setShowAmount(status));
  }, [setShowAmount]);
  useEffect(() => {
    if (adminData) {
      const currency = ['dollar', 'euro', 'pound'].includes(
        selectedCurrency.currency,
      )
        ? selectedCurrency.currency
        : 'local';

      setBalance(adminData.allBalances[`${currency}Balance`]);
    }
  }, [adminData, selectedCurrency.currency]);

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };
  return (
    <View style={{ ...styles.cardHeader }}>
      <Pressable onPress={() => setModalOpen(true)} style={styles.plus}>
        <ChevronDown />
      </Pressable>
      <View style={styles.cardHeaderBalance}>
        <BoldText>Balance</BoldText>
      </View>
      <Pressable onPress={handleShow}>
        <BoldText style={styles.cardHeaderAmount}>
          {showAmount && balance
            ? selectedCurrency.symbol + addingDecimal(balance.toLocaleString())
            : '***'}
        </BoldText>
      </Pressable>
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
