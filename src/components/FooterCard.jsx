/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import RegularText from './fonts/RegularText';
import BoldText from './fonts/BoldText';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import { addingDecimal } from '../../utils/AddingZero';
import { allCurrencies } from '../database/data';

const FooterCard = ({ userToSendTo, airtime, amountInput, dataPlan, fee }) => {
  const { selectedCurrency } = useContext(AppContext);
  amountInput = addingDecimal(
    Number(airtime ? airtime.amount : amountInput).toLocaleString(),
  );

  const currency = airtime
    ? allCurrencies.find(
        currencyIndex => currencyIndex.currency === airtime.currency,
      )?.symbol
    : selectedCurrency.symbol;

  return (
    <View style={styles.footerCard}>
      <BoldText style={styles.cardAmount}>
        {dataPlan || currency + amountInput}
      </BoldText>
      {userToSendTo ? (
        <View style={styles.footerCardDetails}>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Account Number</RegularText>
            <BoldText style={styles.cardValue}>{userToSendTo.accNo}</BoldText>
          </View>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Account Name</RegularText>
            <BoldText style={styles.cardValue}>
              {userToSendTo.fullName || userToSendTo.name}
            </BoldText>
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
            <BoldText
              style={{ ...styles.cardValue, color: fee ? 'red' : '#006E53' }}>
              {fee ? selectedCurrency.symbol + fee : 'free'}
            </BoldText>
          </View>
        </View>
      ) : (
        <View style={styles.footerCardDetails}>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Phone Number</RegularText>
            <BoldText style={styles.cardValue}>{airtime.phoneNo}</BoldText>
          </View>
          {dataPlan ? (
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Data Plan</RegularText>
              <BoldText style={styles.cardValue}>{dataPlan}</BoldText>
            </View>
          ) : (
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Amount</RegularText>
              <BoldText style={styles.cardValue}>
                {currency}
                {amountInput}
              </BoldText>
            </View>
          )}
          {airtime.reference && (
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Reference ID</RegularText>
              <BoldText style={styles.cardValue}>{airtime.reference}</BoldText>
            </View>
          )}
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Payment Method</RegularText>
            <BoldText style={{ ...styles.cardValue, color: '#006E53' }}>
              Balance
            </BoldText>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  footerCard: {
    backgroundColor: '#efe2e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 5,
    marginVertical: 30,
  },
  footerCardDetails: {
    gap: 10,
    marginBottom: 30,
  },
  cardAmount: {
    marginTop: 30,
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
