/* eslint-disable react-native/no-inline-styles */
import { useCallback, useContext, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import UserIcon from '../../components/UserIcon';
import BoldText from '../../components/fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { allCurrencies } from '../../database/data';
import { AppContext } from '../../components/AppContext';
import { postFetchData } from '../../../utils/fetchAPI';
import ToastMessage from '../../components/ToastMessage';
import { useAdminDataContext } from '../../context/AdminContext';
import { useFocusEffect } from '@react-navigation/native';

const Transactions = ({ route }) => {
  const { transactionStatus } = route.params;
  const [transactions, setTransactions] = useState(route.params.transactions);

  useFocusEffect(
    useCallback(() => {
      setTransactions(route.params.transactions);
    }, [route.params]),
  );

  return (
    <PageContainer scroll>
      <View style={styles.transactions}>
        {transactions.length ? (
          transactions.map(transaction => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          ))
        ) : (
          <View>
            <BoldText>No current {transactionStatus} transactions </BoldText>
          </View>
        )}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  transactions: {
    marginHorizontal: 5 + '%',
    marginVertical: 20,
    gap: 30,
  },
  transaction: { backgroundColor: '#eee', padding: 10, borderRadius: 5 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusText: {
    textTransform: 'capitalize',
  },
  amount: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 24,
  },
  reference: {
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    // alignItems: 'center',
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingLeft: 10,
  },
  decline: {
    // paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    backgroundColor: 'red',
  },
  declineText: {
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    flex: 1,
    backgroundColor: 'green',
    // paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
});
export default Transactions;

const Transaction = ({ transaction, setTransactions }) => {
  const { setIsLoading, setWalletRefresh } = useContext(AppContext);
  const [otpCode, setOtpCode] = useState('');
  const {
    amount,
    currency,
    paystackReference,
    senderName,
    senderPhoto,
    // destinationBank,
    status,
  } = transaction;

  const currencySymbol = allCurrencies.find(
    id => currency === id.currency,
  )?.symbol;

  const statusColor = () => {
    switch (status) {
      case 'success':
        return (
          <View style={styles.status}>
            <FaIcon
              name="check-circle-o"
              style={{ ...styles.faIcon, color: '#38b34a' }}
            />
            <BoldText style={{ color: '#38b34a', ...styles.statusText }}>
              {status}
            </BoldText>
          </View>
        );
      case 'pending':
        return (
          <View style={styles.status}>
            <FaIcon
              name="clock-o"
              style={{ ...styles.faIcon, color: '#ffa500' }}
            />
            <BoldText style={{ color: '#ffa500', ...styles.statusText }}>
              {status}
            </BoldText>
          </View>
        );
      case 'declined':
        return (
          <View style={styles.status}>
            <FaIcon
              name="close"
              style={{ ...styles.faIcon, color: 'rgb(255, 0, 0)' }}
            />
            <BoldText style={{ color: 'rgb(255, 0, 0)', ...styles.statusText }}>
              {status}
            </BoldText>
          </View>
        );
      case 'abandoned':
        return (
          <View style={styles.status}>
            <FaIcon
              name="close"
              style={{ ...styles.faIcon, color: '#ff0000' }}
            />
            <BoldText style={{ color: '#ff0000', ...styles.statusText }}>
              {status}
            </BoldText>
          </View>
        );
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const response = await postFetchData('admin/finalize', {
        transfer_code: paystackReference,
        otp: otpCode,
      });
      if (response.status !== 200) throw new Error(response.data);
      setWalletRefresh(prev => !prev);
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    try {
      setIsLoading(true);
      const response = await postFetchData('admin/block-transaction', {
        _id: transaction._id,
      });
      if (response.status !== 200) throw new Error(response.data);
      setTransactions(prev =>
        prev.filter(
          transactionIndex => transactionIndex._id !== transaction._id,
        ),
      );
      setWalletRefresh(prev => !prev);
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.transaction}>
      <View style={styles.header}>
        <View style={styles.header}>
          <UserIcon uri={senderPhoto} />
          <BoldText>{senderName}</BoldText>
        </View>
        <View style={styles.status}>{statusColor()}</View>
      </View>
      <BoldText style={styles.amount}>{currencySymbol + amount}</BoldText>
      {/* <BoldText style={styles.reference}>{destinationBank}</BoldText> */}
      <BoldText style={styles.reference}>{paystackReference}</BoldText>
      {status === 'pending' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Input OTP"
            inputMode="numeric"
            onChangeText={text => setOtpCode(text)}
            maxLength={6}
          />
          <Pressable style={styles.decline} onPress={handleBlock}>
            <BoldText style={styles.declineText}>Decline</BoldText>
          </Pressable>
          <Pressable style={styles.button} onPress={handleVerify}>
            <BoldText style={styles.buttonText}>Finalize</BoldText>
          </Pressable>
        </View>
      )}
    </View>
  );
};
