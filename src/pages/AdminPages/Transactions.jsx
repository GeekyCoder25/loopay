import { useCallback, useContext, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import UserIcon from '../../components/UserIcon';
import BoldText from '../../components/fonts/BoldText';
import { allCurrencies } from '../../database/data';
import { AppContext } from '../../components/AppContext';
import { postFetchData } from '../../../utils/fetchAPI';
import ToastMessage from '../../components/ToastMessage';
import { useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../../assets/images/backArrow.svg';
import { useAdminDataContext } from '../../context/AdminContext';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import RegularText from '../../components/fonts/RegularText';
import { addingDecimal } from '../../../utils/AddingZero';
import { groupTransactionsByDate } from '../../../utils/groupTransactions';
import TransactionHistoryParams from '../MenuPages/TransactionHistoryParams';
import Back from '../../components/Back';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import { billIcon } from '../MenuPages/TransactionHistory';

const Transactions = ({ navigation, route }) => {
  const { selectedCurrency } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const { transactions: allTransactions } = adminData;
  // const selectedIds = new Set();
  const transactions = allTransactions.filter(
    transaction =>
      transaction.currency === selectedCurrency.currency &&
      transaction.transactionType !== 'swap',
  );
  const { transactionStatus } = route.params;
  const [selectedTransaction, setSelectedTransaction] = useState(transactions);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [label2, setLabel2] = useState('');
  const [modalData, setModalData] = useState(null);
  const [transactionsModal, setTransactionsModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      transactionStatus === 'success' &&
        setSelectedTransaction(
          transactions.filter(transaction => transaction.status === 'success'),
        );
      transactionStatus === 'pending' &&
        setSelectedTransaction(
          transactions.filter(transaction => transaction.status === 'pending'),
        );
      transactionStatus === 'blocked' &&
        setSelectedTransaction(
          transactions.filter(transaction => transaction.status === 'blocked'),
        );

      return () => {
        setSelectedLabel('');
        setLabel2('');
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params]),
  );

  const selectOptions = [
    {
      label: 'All Transactions',
      label2: '',
      status: '',
    },
    {
      label: 'Successful Transactions',
      label2: 'successful',
      status: 'success',
    },
    {
      label: 'Pending Transactions',
      label2: 'pending',
      status: 'pending',
    },
    {
      label: 'Blocked Transactions',
      label2: 'blocked',
      status: 'blocked',
    },
  ];
  const label = selectOptions.find(
    option => option.status === transactionStatus,
  ).label;

  const handleModal = selected => {
    setModalOpen(false);
    setSelectedLabel(selected.label);
    setLabel2(selected.label2);
    selected.status
      ? setSelectedTransaction(
          transactions.filter(
            transaction => transaction.status === selected.status,
          ),
        )
      : setSelectedTransaction(transactions);
  };

  return (
    <PageContainer scroll>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <BackIcon />
          <BoldText style={styles.headerText}>Transactions</BoldText>
        </Pressable>
      </View>
      <Pressable onPress={() => setModalOpen(true)} style={styles.input}>
        <BoldText style={styles.inputText}>{selectedLabel || label}</BoldText>
        <ChevronDown />
      </Pressable>
      <View style={styles.transactions}>
        {selectedTransaction.length ? (
          <>
            <BoldText style={styles.subHeader}>
              {selectedLabel || label}
            </BoldText>
            {groupTransactionsByDate(selectedTransaction).map(
              dayTransaction => (
                <View key={dayTransaction.date} style={styles.dateHistory}>
                  <RegularText style={styles.date}>
                    {dayTransaction.date}
                  </RegularText>
                  {dayTransaction.histories.map(transaction => (
                    <Transaction
                      key={transaction._id}
                      transaction={transaction}
                      setTransactions={setSelectedTransaction}
                      setTransactionsModal={setTransactionsModal}
                      setModalData={setModalData}
                    />
                  ))}
                </View>
              ),
            )}
          </>
        ) : (
          <View style={styles.empty}>
            <BoldText>
              No current {label2 || transactionStatus} transactions{' '}
            </BoldText>
          </View>
        )}
        <Modal
          visible={transactionsModal}
          animationType="slide"
          onRequestClose={() => {
            setTransactionsModal(false);
            setModalData(null);
          }}>
          <Back
            onPress={() => {
              setTransactionsModal(false);
              setModalData(null);
            }}
          />
          <TransactionHistoryParams route={{ params: modalData }} />
        </Modal>
      </View>
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(prev => !prev)}>
        <Pressable
          style={styles.overlay}
          onPress={() => setModalOpen(prev => !prev)}>
          <View style={styles.modal}>
            <View style={styles.modal}>
              <View style={styles.modal}>
                {selectOptions.map(option => (
                  <Pressable
                    key={option.status}
                    style={styles.select}
                    onPress={() => handleModal(option)}>
                    <RegularText>{option.label}</RegularText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 5 + '%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerText: {
    fontSize: 18,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 100 + '%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    zIndex: 9,
  },
  select: {
    width: 95 + '%',
    padding: 20,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  subHeader: {
    paddingHorizontal: 3 + '%',
    marginVertical: 20,
  },
  transaction: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expanded: {
    backgroundColor: '#eee',
    borderTopColor: '#868585',
    // paddingVertical: 10,
    borderTopWidth: 0.2,
    paddingHorizontal: 10,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
  },
  historyIconText: {
    backgroundColor: '#ccc',
    fontSize: 18,
    fontFamily: 'OpenSans-800',
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  historyContent: {
    flex: 1,
    gap: 3,
  },
  creditAmount: {
    color: '#006E53',
    fontSize: 16,
  },
  debitAmount: {
    color: '#ED4C5C',
    fontSize: 16,
  },
  dateHistory: {
    borderBottomColor: '#868585',
    borderBottomWidth: 0.2,
  },
  date: {
    marginBottom: 5,
    paddingHorizontal: 3 + '%',
    color: '#979797',
  },
  transactions: {
    gap: 10,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  amount: {
    alignItems: 'flex-end',
    textAlign: 'center',
    fontSize: 24,
  },
  success: {
    color: '#006E53',
  },
  pending: {
    color: '#AD5300',
    fontStyle: 'italic',
  },
  blocked: {
    color: '#ED4C5C',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginHorizontal: 5 + '%',
    marginVertical: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5 + '%',
  },
  inputText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    alignItems: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 15,
    marginVertical: 10,
    height: 40,
    flex: 2,
    fontFamily: 'OpenSans-500',
  },
  decline: {
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
  empty: {
    alignItems: 'center',
    paddingHorizontal: 5 + '%',
    paddingVertical: 50,
  },
  historyTitle: {
    textTransform: 'capitalize',
  },
});
export default Transactions;

const Transaction = ({
  transaction,
  setTransactions,
  setTransactionsModal,
  setModalData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    amount,
    currency,
    transferCode,
    reference,
    senderName,
    senderPhoto,
    status,
    createdAt,
    transactionType,
    receiverPhoto,
    receiverName,
    networkProvider,
    dataPlan,
    billType,
    billName,
  } = transaction;

  const currencySymbol = allCurrencies.find(
    id => currency === id.currency,
  )?.symbol;

  const date = new Date(createdAt);
  const historyTime = convertTo12HourFormat(
    `${date.getHours()}:${date.getMinutes()}`,
  );

  function convertTo12HourFormat(time24) {
    let [hours, minutes] = time24.split(':');
    let period = 'AM';

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    }

    if (hours === '00') {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  }

  const label = () => {
    switch (status) {
      case 'success':
        return <RegularText style={styles.success}>Successful</RegularText>;
      case 'pending':
        return <RegularText style={styles.pending}>Pending</RegularText>;
      case 'blocked':
        return <RegularText style={styles.blocked}>Blocked</RegularText>;
    }
  };

  return (
    <View style={styles.expanded}>
      <Pressable
        onPress={() => {
          setModalData(transaction);
          setTransactionsModal(true);
        }}
        style={styles.transaction}>
        {transactionType?.toLowerCase() === 'credit' && (
          <>
            <UserIcon uri={senderPhoto} />
            <View style={styles.historyContent}>
              <BoldText>{senderName}</BoldText>
              <RegularText>{historyTime}</RegularText>
            </View>
            <Pressable
              onPress={() => setIsExpanded(prev => !prev)}
              style={styles.pendingContainer}>
              <View style={styles.amount}>
                <BoldText style={styles.creditAmount}>
                  +
                  {currencySymbol +
                    addingDecimal(Number(amount).toLocaleString())}
                </BoldText>
                {label()}
              </View>
              {status === 'pending' && (
                <Pressable
                  onPress={() => setIsExpanded(prev => !prev)}
                  style={{
                    transform: [{ rotateZ: isExpanded ? '180deg' : '0deg' }],
                  }}>
                  <ChevronDown />
                </Pressable>
              )}
            </Pressable>
          </>
        )}
        {transactionType?.toLowerCase() === 'debit' && (
          <>
            <UserIcon uri={receiverPhoto} />
            <View style={styles.historyContent}>
              <BoldText>{receiverName}</BoldText>
              <RegularText>{historyTime}</RegularText>
            </View>
            <Pressable
              onPress={() => setIsExpanded(prev => !prev)}
              style={styles.pendingContainer}>
              <View style={styles.amount}>
                <BoldText style={styles.debitAmount}>
                  -
                  {currencySymbol +
                    addingDecimal(Number(amount).toLocaleString())}
                </BoldText>
                {label()}
              </View>
              {status === 'pending' && (
                <Pressable
                  onPress={() => setIsExpanded(prev => !prev)}
                  style={{
                    transform: [{ rotateZ: isExpanded ? '180deg' : '0deg' }],
                  }}>
                  <ChevronDown />
                </Pressable>
              )}
            </Pressable>
          </>
        )}
        {transactionType?.toLowerCase() === 'airtime' && (
          <>
            {networkProvidersIcon(networkProvider)}
            <View style={styles.historyContent}>
              <BoldText style={styles.historyTitle}>
                {networkProvider} - {transaction.phoneNo}
              </BoldText>
              <RegularText>Airtime Recharge</RegularText>
            </View>
            <View style={styles.amount}>
              <BoldText style={styles.debitAmount}>
                -
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText> {historyTime}</RegularText>
              {status === 'pending' && (
                <Pressable
                  onPress={() => setIsExpanded(prev => !prev)}
                  style={{
                    transform: [{ rotateZ: isExpanded ? '180deg' : '0deg' }],
                  }}>
                  <ChevronDown />
                </Pressable>
              )}
            </View>
          </>
        )}
        {transactionType?.toLowerCase() === 'data' && (
          <>
            {networkProvidersIcon(networkProvider)}
            <View style={styles.historyContent}>
              <BoldText style={styles.historyTitle}>
                {networkProvider} - {transaction.phoneNo}
              </BoldText>
              <RegularText>Data Recharge - {dataPlan.value}</RegularText>
            </View>
            <View style={styles.amount}>
              <BoldText style={styles.debitAmount}>
                -
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText> {historyTime}</RegularText>
            </View>
          </>
        )}

        {transactionType?.toLowerCase() === 'bill' && (
          <>
            <View style={styles.historyIconText}>{billIcon(billType)}</View>
            <View style={styles.historyContent}>
              <BoldText style={styles.historyTitle}>{billName} </BoldText>
              <RegularText style={styles.historyTitle}>
                {billType} bill
              </RegularText>
            </View>
            <View style={styles.amount}>
              <BoldText style={styles.debitAmount}>
                -
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText> {historyTime}</RegularText>
            </View>
          </>
        )}
      </Pressable>
      {isExpanded && status === 'pending' && (
        <ExpandedInput
          reference={reference}
          transferCode={transferCode}
          transaction={transaction}
          setTransactions={setTransactions}
        />
      )}
    </View>
  );
};

const ExpandedInput = ({
  reference,
  transferCode,
  transaction,
  setTransactions,
}) => {
  const { setIsLoading, setWalletRefresh } = useContext(AppContext);
  const [otpCode, setOtpCode] = useState('');
  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const response = await postFetchData('admin/finalize', {
        transfer_code: transferCode,
        otp: otpCode,
      });
      if (response.status !== 200) throw new Error(response.data);
      ToastMessage('Transaction Approved');
      setWalletRefresh(prev => !prev);
      setTransactions(prev =>
        prev.filter(
          transactionIndex => transactionIndex._id !== transaction._id,
        ),
      );
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
    <View>
      <RegularText>
        Reference: <BoldText> {reference}</BoldText>
      </RegularText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.otpInput}
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
    </View>
  );
};
