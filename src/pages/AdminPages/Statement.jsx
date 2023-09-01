import PageContainer from '../../components/PageContainer';
import { ScrollView, StyleSheet, View } from 'react-native';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import RegularText from '../../components/fonts/RegularText';
import { useAdminDataContext } from '../../context/AdminContext';
import { useContext, useEffect, useState } from 'react';
import { addingDecimal } from '../../../utils/AddingZero';
import { AppContext } from '../../components/AppContext';

const Statement = () => {
  const { selectedCurrency } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const { transactions } = adminData;
  const [income, setIncome] = useState('0');
  const [outcome, setOutcome] = useState('0');
  const [onhold, setOnhold] = useState('0');

  useEffect(() => {
    const interTransactions = transactions.filter(
      transaction => transaction.type === 'intra',
    );

    const transactionsAddUp = array =>
      Number(
        array
          .map(transaction => Number(transaction.amount))
          .reduce((a, b) => a + b)
          .toFixed(2),
      ).toLocaleString();

    const incomeTransactions = interTransactions.filter(
      transaction =>
        transaction.status === 'success' &&
        transaction.transactionType === 'credit',
    );

    const outcomeTransactions = interTransactions.filter(
      transaction =>
        transaction.status === 'success' &&
        transaction.transactionType === 'debit',
    );
    const onholdTransactions = interTransactions.filter(
      transaction => transaction.transactionType === 'pending',
    );

    incomeTransactions.length &&
      setIncome(transactionsAddUp(incomeTransactions));
    outcomeTransactions.length &&
      setOutcome(transactionsAddUp(outcomeTransactions));
    onholdTransactions.length &&
      setOnhold(transactionsAddUp(onholdTransactions));
  }, [transactions]);

  return (
    <PageContainer style={styles.container}>
      <ScrollView>
        <BalanceCard />

        <View style={styles.body}>
          <BoldText style={styles.headerText}>Account Summary</BoldText>
          <View style={styles.card}>
            <View style={styles.chart}></View>
            <View style={styles.labels}>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.incomeBg }} />
                <View>
                  <RegularText style={styles.statusText}>Income</RegularText>
                  <BoldText style={styles.statusNo}>
                    {selectedCurrency.symbol + addingDecimal(income)}
                  </BoldText>
                </View>
              </View>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.outcomeBg }} />
                <View>
                  <RegularText style={styles.statusText}>Outcome</RegularText>
                  <BoldText style={styles.statusNo}>
                    {selectedCurrency.symbol + addingDecimal(outcome)}
                  </BoldText>
                </View>
              </View>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.onholdBg }} />
                <View>
                  <RegularText style={styles.statusText}>Onhold</RegularText>
                  <BoldText style={styles.statusNo}>
                    {selectedCurrency.symbol + addingDecimal(onhold)}
                  </BoldText>
                </View>
              </View>
            </View>
          </View>
          <Button text="Download Statement.CSV" />
        </View>
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  card: {
    backgroundColor: '#EEEEEE',
    height: 200,
    marginVertical: 10,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    color: '#11263C',
    fontSize: 16,
  },
  body: {
    marginTop: 30,
  },
  chart: {
    flex: 1,
  },
  labels: {
    flex: 1,
    gap: 5,
  },
  status: {
    flexDirection: 'row',
    paddingRight: 30,
    gap: 15,
    alignItems: 'center',
  },
  statusBg: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 24,
  },
  incomeBg: {
    backgroundColor: '#00102b',
  },
  outcomeBg: {
    backgroundColor: '#777f8c',
  },
  onholdBg: {
    backgroundColor: '#bec2c7',
  },
  statusText: {
    color: '#868585',
    fontSize: 18,
    fontFamily: 'OpenSans-600',
  },
  statusNo: {
    color: '#11263C',
    fontSize: 18,
  },
});

export default Statement;
