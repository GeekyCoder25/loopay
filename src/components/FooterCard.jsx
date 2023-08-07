import { StyleSheet, View } from 'react-native';
import RegularText from './fonts/RegularText';
import BoldText from './fonts/BoldText';
import { useContext } from 'react';
import { AppContext } from './AppContext';

const FooterCard = ({ userToSendTo, amountInput }) => {
  const { selectedCurrency } = useContext(AppContext);
  return (
    <View style={styles.footerCard}>
      <BoldText style={styles.cardAmount}>
        {selectedCurrency.symbol}
        {amountInput}
      </BoldText>
      <View style={styles.footerCardDetails}>
        <View style={styles.cardLine}>
          <RegularText style={styles.cardKey}>Account Number</RegularText>
          <BoldText style={styles.cardValue}>{userToSendTo.accNo}</BoldText>
        </View>
        <View style={styles.cardLine}>
          <RegularText style={styles.cardKey}>Account Name</RegularText>
          <BoldText style={styles.cardValue}>{userToSendTo.fullName}</BoldText>
        </View>
        <View style={styles.cardLine}>
          <RegularText style={styles.cardKey}>Amount</RegularText>
          <BoldText style={styles.cardValue}>
            {selectedCurrency.symbol}
            {amountInput}
          </BoldText>
        </View>
        <View style={styles.cardLine}>
          <RegularText style={styles.cardKey}>Payment Method</RegularText>
          <BoldText style={{ ...styles.cardValue, color: '#006E53' }}>
            Balance
          </BoldText>
        </View>
        <View style={styles.cardLine}>
          <RegularText style={styles.cardKey}>Transaction Fees</RegularText>
          <BoldText style={{ ...styles.cardValue, color: '#006E53' }}>
            free
          </BoldText>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  footerCard: {
    backgroundColor: '#efe2e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 30,
    borderRadius: 5,
    marginBottom: 30,
  },
  footerCardDetails: {
    gap: 10,
  },
  cardAmount: {
    fontSize: 24,
    marginBottom: 30,
  },
  cardLine: {
    flexDirection: 'row',
    width: 100 + '%',
  },
  cardKey: {
    flex: 1,
    color: '#525252',
    fontFamily: 'OpenSans-600',
  },
  cardValue: {
    flex: 1,
    textAlign: 'right',
    color: '#525252',
  },
});
export default FooterCard;
