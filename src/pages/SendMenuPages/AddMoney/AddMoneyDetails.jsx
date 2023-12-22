import React, { useContext } from 'react';
import PageContainer from '../../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import Button from '../../../components/Button';
import { AppContext } from '../../../components/AppContext';
import { addingDecimal } from '../../../../utils/AddingZero';

const AddMoneyDetails = ({ navigation, route }) => {
  const { selectedCurrency } = useContext(AppContext);
  const { acronym, symbol } = selectedCurrency;
  const { params } = route;
  const { vh } = useContext(AppContext);

  const transactionDetails = [
    {
      title: 'Amount to Pay',
      value: addingDecimal(params.amount.toLocaleString()),
      symbol,
    },
    {
      title: 'Transaction Fee',
      value: addingDecimal(params.fee.toLocaleString()),
      symbol,
    },
    {
      title: 'Amount you’ll receive',
      value: addingDecimal(params.toReceive.toLocaleString()),
      symbol,
    },
    {
      title: 'Payment Method',
      value: params.fullTitle,
    },
  ];

  const handlePay = () => {
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
  };

  return (
    <PageContainer paddingTop={10} scroll>
      <View style={{ ...styles.body, minHeight: vh * 0.88 }}>
        <BoldText style={styles.headerText}>Review</BoldText>
        <View style={styles.card}>
          <BoldText style={styles.cardText}>{acronym} Deposit</BoldText>
          <BoldText style={styles.cardAmount}>
            {symbol}
            {addingDecimal(params.amount.toLocaleString())}
          </BoldText>
        </View>
        <View style={styles.modalBorder} />
        {transactionDetails.map(detail => (
          <View key={detail.title} style={styles.detail}>
            <RegularText>{detail.title}</RegularText>
            <BoldText>
              {detail?.symbol} {detail.value}
            </BoldText>
          </View>
        ))}
        <View style={styles.button}>
          <Button text="Make Payment" onPress={handlePay} />
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 5 + '%',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 50,
  },
  card: {
    backgroundColor: '#1e1e1e',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    borderRadius: 10,
  },
  cardText: {
    backgroundColor: '#e4e2e2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: '#1e1e1e',
    fontSize: 18,
  },
  cardAmount: {
    color: '#fff',
    fontSize: 24,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
    alignSelf: 'center',
    marginTop: 30,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderColor: '#bbb',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 2,
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 50,
  },
});
export default AddMoneyDetails;
