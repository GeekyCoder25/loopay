import { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import Check from '../../../assets/images/success.svg';
import Pending from '../../../assets/images/pending.svg';
import Block from '../../../assets/images/blocked.svg';
import { useAdminDataContext } from '../../context/AdminContext';
import { addingDecimal } from '../../../utils/AddingZero';
import BalanceCard from './components/BalanceCard';
import { allCurrencies } from '../../database/data';
import { AppContext } from '../../components/AppContext';

const Dashboard = ({ navigation }) => {
  const { selectedCurrency } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const [success, setSuccess] = useState([]);
  const [successBalance, setSuccessBalance] = useState(0);
  const [pending, setPending] = useState([]);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [blocked, setBlocked] = useState([]);
  const [blockedBalance, setBlockedBalance] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    if (adminData) {
      const selectedIds = new Set();
      setSuccess(
        adminData.transactions.filter(
          transaction =>
            transaction.status === 'success' &&
            !selectedIds.has(transaction.id) &&
            selectedIds.add(transaction.id),
        ),
      );
      setPending(
        adminData.transactions.filter(
          transaction =>
            transaction.status === 'pending' &&
            !selectedIds.has(transaction.id) &&
            selectedIds.add(transaction.id),
        ),
      );
      setBlocked(
        adminData.transactions.filter(
          transaction =>
            (transaction.status === 'blocked' ||
              transaction.status === 'declined') &&
            !selectedIds.has(transaction.id) &&
            selectedIds.add(transaction.id),
        ),
      );
      setTotalUsers(adminData.users.length);

      const checkSameDateAndTime = sessionTimestamp => {
        if (sessionTimestamp) {
          const sessionDate = new Date(sessionTimestamp);
          const currentDate = new Date();
          const timeDifference = currentDate - sessionDate;
          const minutesDifference = timeDifference / (1000 * 60);

          return (
            sessionDate.toLocaleDateString() ===
              currentDate.toLocaleDateString() &&
            sessionDate.getHours() === currentDate.getHours() &&
            (sessionDate.getMinutes() === currentDate.getMinutes() ||
              minutesDifference <= 5)
          );
        }
      };
      setActiveUsers(0);
      adminData.lastActiveSessions.forEach(session => {
        checkSameDateAndTime(session) && setActiveUsers(prev => prev + 1);
      });
    }
  }, [adminData]);

  useEffect(() => {
    if (success.length) {
      setSuccessBalance(
        success
          .map(successIndex => Number(successIndex.amount))
          .reduce((a, b) => a + b),
      );
    }
    if (pending.length) {
      setPendingBalance(
        pending
          .map(pendingIndex => Number(pendingIndex.amount))
          .reduce((a, b) => a + b),
      );
    }
    if (blocked.length) {
      setBlockedBalance(
        blocked
          .map(blockedIndex => Number(blockedIndex.amount))
          .reduce((a, b) => a + b),
      );
    }
  }, [success, pending, blocked]);

  return (
    <ScrollView style={styles.body}>
      <PageContainer style={styles.container}>
        <BalanceCard showPlus={true} />
        <View style={styles.transactions}>
          <Pressable
            style={styles.transaction}
            onPress={() => {
              navigation.navigate('Transactions', {
                previousScreen: 'Dashboard',
                transactionStatus: 'success',
                transactions: success,
              });
            }}>
            <View style={styles.icon}>
              <Check />
            </View>
            <View style={styles.transactionDetails}>
              <BoldText style={styles.transactionTitle}>
                Successful Transactions
              </BoldText>
              <BoldText style={styles.transactionLength}>
                {success.length}
              </BoldText>
              <BoldText style={styles.success}>
                {selectedCurrency.symbol +
                  addingDecimal(successBalance.toLocaleString())}
              </BoldText>
            </View>
          </Pressable>
          <Pressable
            style={styles.transaction}
            onPress={() => {
              navigation.navigate('Transactions', {
                previousScreen: 'Dashboard',
                transactionStatus: 'pending',
                transactions: pending,
              });
            }}>
            <View style={styles.icon}>
              <Pending />
            </View>
            <View style={styles.transactionDetails}>
              <BoldText style={styles.transactionTitle}>
                Pending Transactions
              </BoldText>
              <BoldText style={styles.transactionLength}>
                {pending.length}
              </BoldText>
              <BoldText>
                {selectedCurrency.symbol +
                  addingDecimal(pendingBalance.toLocaleString())}
              </BoldText>
            </View>
          </Pressable>
          <Pressable
            style={styles.transaction}
            onPress={() => {
              navigation.navigate('Transactions', {
                previousScreen: 'Dashboard',
                transactionStatus: 'blocked',
                transactions: blocked,
              });
            }}>
            <View style={styles.icon}>
              <Block />
            </View>
            <View style={styles.transactionDetails}>
              <BoldText style={styles.transactionTitle}>
                Blocked Transactions
              </BoldText>
              <BoldText style={styles.transactionLength}>
                {blocked.length}
              </BoldText>
              <BoldText style={styles.blocked}>
                {selectedCurrency.symbol +
                  addingDecimal(blockedBalance.toLocaleString())}
              </BoldText>
            </View>
          </Pressable>
          <View style={styles.sessions}>
            <BoldText style={styles.sessionHeader}>Active Percentage</BoldText>
            <View style={styles.total}>
              <BoldText style={styles.totalNo}>{totalUsers}</BoldText>
              <RegularText style={styles.totalText}>Total</RegularText>
            </View>
            <View style={styles.sessionGraph}>
              <View
                style={{
                  ...styles.sessionActive,
                  width: (activeUsers / totalUsers) * 100 + '%',
                }}
              />
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.status}>
                <View style={styles.activeBg} />
                <View>
                  <RegularText style={styles.statusText}>Online</RegularText>
                  <BoldText style={styles.statusNo}>
                    {activeUsers} user{activeUsers === 1 ? '' : 's'}
                  </BoldText>
                </View>
              </View>

              <View style={styles.status}>
                <View style={styles.totalBg} />
                <View>
                  <RegularText style={styles.statusText}>Offline</RegularText>
                  <BoldText style={styles.statusNo}>
                    {totalUsers - activeUsers} user
                    {totalUsers - activeUsers === 1 ? '' : 's'}
                  </BoldText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </PageContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
    paddingBottom: 50,
  },
  transactions: {
    marginTop: 30,
    gap: 15,
  },
  transaction: {
    backgroundColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
  },
  icon: {
    paddingRight: 15,
  },
  transactionDetails: {
    borderLeftWidth: 0.5,
    flex: 1,
    paddingLeft: 15,
    gap: 5,
  },
  transactionTitle: {
    fontSize: 18,
    color: '#525252',
  },
  transactionLength: {
    fontSize: 24,
    color: '#000',
    marginBottom: 10,
  },
  success: {
    color: '#2A5A00',
  },
  blocked: { color: '#E20010' },
  sessions: {
    backgroundColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
    borderRadius: 7,
  },
  sessionHeader: {
    color: '#11263C',
    fontSize: 18,
  },
  total: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  totalNo: {
    fontSize: 30,
    color: '#11263C',
  },
  totalText: {
    fontSize: 18,
    color: '#868585',
    marginBottom: 5,
  },
  sessionGraph: {
    width: 100 + '%',
    height: 15,
    backgroundColor: '#cfcfcf',
    borderRadius: 10,
  },
  sessionActive: {
    backgroundColor: '#525252',
    height: 100 + '%',
    borderRadius: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
    paddingRight: 30,
    gap: 15,
    alignItems: 'center',
  },
  activeBg: {
    backgroundColor: '#525252',
    width: 30,
    height: 5,
    borderRadius: 3,
    marginBottom: 24,
  },
  totalBg: {
    backgroundColor: '#cfcfcf',
    width: 30,
    height: 5,
    borderRadius: 3,
    marginBottom: 24,
  },
  statusText: {
    color: '#525252',
    fontSize: 16,
  },
  statusNo: {
    color: '#11263C',
    fontSize: 18,
  },
});

export default Dashboard;
