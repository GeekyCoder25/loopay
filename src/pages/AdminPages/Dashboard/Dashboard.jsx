import { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { Pressable, StyleSheet, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import Check from '../../../../assets/images/success.svg';
import Pending from '../../../../assets/images/pending.svg';
import Block from '../../../../assets/images/blocked.svg';
import { useAdminDataContext } from '../../../context/AdminContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import BalanceCard from '../components/BalanceCard';
import { AppContext } from '../../../components/AppContext';
import FaIcon from '@expo/vector-icons/FontAwesome';

const Dashboard = ({ navigation }) => {
  const { selectedCurrency, showAmount } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const { statusTransactionsAmount, statusTransactionsLength } = adminData;
  const [success, setSuccess] = useState([]);
  const [successBalance, setSuccessBalance] = useState(0);
  const [pending, setPending] = useState([]);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [reversed, setReversed] = useState([]);
  const [reversedBalance, setReversedBalance] = useState(0);
  const [blocked, setBlocked] = useState([]);
  const [blockedBalance, setBlockedBalance] = useState(0);
  const [totalUsers, setTotalUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (adminData) {
      setSuccess(statusTransactionsLength.success[selectedCurrency.currency]);
      setPending(statusTransactionsLength.pending[selectedCurrency.currency]);
      setReversed(statusTransactionsLength.reversed[selectedCurrency.currency]);
      setBlocked(statusTransactionsLength.blocked[selectedCurrency.currency]);
      setTotalUsers(adminData.users.total);
      setActiveUsers([]);

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
      adminData.lastActiveSessions.forEach(userSession => {
        userSession = userSession.updatedAt;
        checkSameDateAndTime(userSession) &&
          setActiveUsers(prev => [...prev, userSession]);
      });
    }
  }, [adminData, selectedCurrency.currency, statusTransactionsLength]);

  useEffect(() => {
    setSuccessBalance(
      statusTransactionsAmount.success[selectedCurrency.currency],
    );
    setPendingBalance(
      statusTransactionsAmount.pending[selectedCurrency.currency],
    );
    setReversedBalance(
      statusTransactionsAmount.reversed[selectedCurrency.currency],
    );
    setBlockedBalance(
      statusTransactionsAmount.blocked[selectedCurrency.currency],
    );
  }, [selectedCurrency.currency, statusTransactionsAmount]);

  return (
    <PageContainer style={styles.container} scroll>
      <BalanceCard showPlus={true} />
      <View style={styles.transactions}>
        <Pressable
          style={styles.transaction}
          onPress={() => {
            navigation.navigate('Transactions', {
              transactionStatus: 'success',
            });
          }}>
          <View style={styles.icon}>
            <Check />
          </View>
          <View style={styles.transactionDetails}>
            <BoldText style={styles.transactionTitle}>
              Successful Transactions
            </BoldText>
            <BoldText style={styles.transactionLength}>{success}</BoldText>
            <BoldText style={styles.success}>
              {showAmount
                ? selectedCurrency.symbol +
                  addingDecimal(successBalance.toLocaleString())
                : '***'}
            </BoldText>
          </View>
        </Pressable>
        <Pressable
          style={styles.transaction}
          onPress={() => {
            navigation.navigate('Transactions', {
              transactionStatus: 'pending',
            });
          }}>
          <View style={styles.icon}>
            <Pending />
          </View>
          <View style={styles.transactionDetails}>
            <BoldText style={styles.transactionTitle}>
              Pending Transactions
            </BoldText>
            <BoldText style={styles.transactionLength}>{pending}</BoldText>
            <BoldText>
              {showAmount
                ? selectedCurrency.symbol +
                  addingDecimal(pendingBalance.toLocaleString())
                : '***'}
            </BoldText>
          </View>
        </Pressable>
        <Pressable
          style={styles.transaction}
          onPress={() => {
            navigation.navigate('Transactions', {
              transactionStatus: 'reversed',
            });
          }}>
          <View style={styles.icon}>
            <FaIcon
              name="undo"
              color="orange"
              width={50}
              height={50}
              size={40}
              style={styles.reverseIcon}
            />
          </View>
          <View style={styles.transactionDetails}>
            <BoldText style={styles.transactionTitle}>
              Reversed Transactions
            </BoldText>
            <BoldText style={styles.transactionLength}>{reversed}</BoldText>
            <BoldText style={styles.reversed}>
              {showAmount
                ? selectedCurrency.symbol +
                  addingDecimal(reversedBalance.toLocaleString())
                : '***'}
            </BoldText>
          </View>
        </Pressable>
        <Pressable
          style={styles.transaction}
          onPress={() => {
            navigation.navigate('Transactions', {
              transactionStatus: 'blocked',
            });
          }}>
          <View style={styles.icon}>
            <Block />
          </View>
          <View style={styles.transactionDetails}>
            <BoldText style={styles.transactionTitle}>
              Blocked Transactions
            </BoldText>
            <BoldText style={styles.transactionLength}>{blocked}</BoldText>
            <BoldText style={styles.blocked}>
              {showAmount
                ? selectedCurrency.symbol +
                  addingDecimal(blockedBalance.toLocaleString())
                : '***'}
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
                width: (activeUsers.length / totalUsers) * 100 + '%',
              }}
            />
          </View>
          <View style={styles.statusContainer}>
            <Pressable
              style={styles.status}
              onPress={() =>
                navigation.navigate('ActiveUsers', {
                  defaultTab: 1,
                })
              }>
              <View style={styles.activeBg} />
              <View>
                <RegularText style={styles.statusText}>Online</RegularText>
                <BoldText style={styles.statusNo}>
                  {activeUsers.length} user
                  {activeUsers.length === 1 ? '' : 's'}
                </BoldText>
              </View>
            </Pressable>

            <Pressable
              style={styles.status}
              onPress={() =>
                navigation.navigate('ActiveUsers', {
                  defaultTab: 0,
                })
              }>
              <View style={styles.totalBg} />
              <View>
                <RegularText style={styles.statusText}>Offline</RegularText>
                <BoldText style={styles.statusNo}>
                  {totalUsers - activeUsers.length} user
                  {totalUsers - activeUsers.length === 1 ? '' : 's'}
                </BoldText>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </PageContainer>
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
    width: 65,
    paddingRight: 15,
  },
  reverseIcon: { textAlign: 'center' },
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
