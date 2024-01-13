/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import RegularText from './fonts/RegularText';
import BoldText from './fonts/BoldText';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import { addingDecimal } from '../../utils/AddingZero';
import { allCurrencies } from '../database/data';

const FooterCard = ({
  userToSendTo,
  airtime,
  amountInput,
  dataPlan,
  fee,
  billPlan,
  token,
  reference,
  isCredit,
  type,
}) => {
  const { selectedCurrency } = useContext(AppContext);
  amountInput = addingDecimal(
    Number(
      airtime && !dataPlan ? airtime.amount : amountInput,
    ).toLocaleString(),
  );

  const currency = airtime
    ? allCurrencies.find(
        currencyIndex => currencyIndex.currency === airtime.currency,
      )
    : selectedCurrency;

  return (
    <View style={styles.footerCard}>
      <BoldText style={styles.cardAmount}>
        {billPlan ||
          dataPlan ||
          `${isCredit ? '' : '-'} ${currency.symbol + amountInput}`}
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
              {addingDecimal(amountInput.toLocaleString())}
            </BoldText>
          </View>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Payment Method</RegularText>
            <BoldText style={{ ...styles.cardValue, color: '#006E53' }}>
              {currency?.acronym} Balance
            </BoldText>
          </View>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Transaction Fee</RegularText>
            <BoldText
              style={{ ...styles.cardValue, color: fee ? 'red' : '#006E53' }}>
              {fee
                ? selectedCurrency.symbol + addingDecimal(fee.toLocaleString())
                : selectedCurrency.symbol + '0.00'}
            </BoldText>
          </View>
        </View>
      ) : (
        <View style={styles.footerCardDetails}>
          {airtime && (
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Phone Number</RegularText>
              <BoldText style={styles.cardValue}>{airtime.phoneNo}</BoldText>
            </View>
          )}
          {dataPlan && (
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Data Plan</RegularText>
              <BoldText style={styles.cardValue}>{dataPlan}</BoldText>
            </View>
          )}
          {billPlan && (
            <>
              <View style={styles.cardLine}>
                <RegularText style={styles.cardKey}>Bill Plan</RegularText>
                <BoldText style={styles.cardValue}>{billPlan}</BoldText>
              </View>
              <View style={styles.cardLine}>
                <RegularText style={styles.cardKey}>Token</RegularText>
                <BoldText style={styles.cardValue}>{token}</BoldText>
              </View>
            </>
          )}
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Amount</RegularText>
            <BoldText style={styles.cardValue}>
              {currency?.symbol}
              {addingDecimal(amountInput)}
            </BoldText>
          </View>
          {(airtime?.reference || reference) && (
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Reference ID</RegularText>
              <BoldText style={styles.cardValue}>
                {airtime?.reference || reference}
              </BoldText>
            </View>
          )}
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Payment Method</RegularText>
            <BoldText
              style={{
                ...styles.cardValue,
                color: '#006E53',
              }}>
              {isCredit ? (
                <BoldText style={{ textTransform: 'capitalize' }}>
                  {type || ''} Transfer
                </BoldText>
              ) : (
                currency?.acronym + ' Balance'
              )}
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
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
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
