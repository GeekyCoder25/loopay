import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import RegularText from '../../components/fonts/RegularText';
import { useAdminDataContext } from '../../context/AdminContext';
import { useContext, useEffect, useState } from 'react';
import { addingDecimal } from '../../../utils/AddingZero';
import { AppContext } from '../../components/AppContext';
import Donut from './components/Donut';

const Statement = () => {
  const { selectedCurrency } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const { transactions } = adminData;
  const [income, setIncome] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const [onhold, setOnhold] = useState(0);

  useEffect(() => {
    const interTransactions = transactions.filter(
      transaction =>
        transaction.type === 'inter' &&
        transaction.currency === selectedCurrency.currency,
    );

    const transactionsAddUp = array =>
      Number(
        array
          .map(transaction => Number(transaction.amount))
          .reduce((a, b) => a + b)
          .toFixed(2),
      );

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
      transaction => transaction.status === 'pending',
    );

    incomeTransactions.length
      ? setIncome(transactionsAddUp(incomeTransactions))
      : setIncome(0);
    outcomeTransactions.length
      ? setOutcome(transactionsAddUp(outcomeTransactions))
      : setOutcome(0);
    onholdTransactions.length
      ? setOnhold(transactionsAddUp(onholdTransactions))
      : setOnhold(0);
  }, [selectedCurrency, transactions]);

  return (
    <PageContainer style={styles.container} scroll>
      <BalanceCard />
      <View style={styles.body}>
        <BoldText style={styles.headerText}>Account Summary</BoldText>
        <View style={styles.card}>
          <View style={styles.chart}>
            {!income && !outcome && !onhold ? (
              <View>
                <BoldText>
                  {selectedCurrency.symbol}
                  {'0.00'}
                </BoldText>
                <RegularText>Label</RegularText>
              </View>
            ) : (
              <Donut
                percentage={100}
                // delay={500 + 100 * i}
                max={income + outcome + onhold}
                income={income}
                outcome={outcome}
                onhold={onhold}
              />
            )}
          </View>
          <View style={styles.labelsContainer}>
            <View style={styles.labels}>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.incomeBg }} />
                <View>
                  <RegularText style={styles.statusText}>Income</RegularText>
                  <BoldText style={styles.statusNo}>
                    {selectedCurrency.symbol +
                      addingDecimal(income.toLocaleString())}
                  </BoldText>
                </View>
              </View>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.outcomeBg }} />
                <View>
                  <RegularText style={styles.statusText}>Outcome</RegularText>
                  <BoldText style={styles.statusNo}>
                    {selectedCurrency.symbol +
                      addingDecimal(outcome.toLocaleString())}
                  </BoldText>
                </View>
              </View>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.onholdBg }} />
                <View>
                  <RegularText style={styles.statusText}>Onhold</RegularText>
                  <BoldText style={styles.statusNo}>
                    {selectedCurrency.symbol +
                      addingDecimal(onhold.toLocaleString())}
                  </BoldText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Button text="Download Statement.CSV" />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  card: {
    backgroundColor: '#EEEEEE',
    minHeight: 200,
    marginVertical: 10,
    marginBottom: 30,
    flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  labels: {
    gap: 5,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  status: {
    flexDirection: 'row',
    paddingRight: 30,
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBg: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 20,
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
