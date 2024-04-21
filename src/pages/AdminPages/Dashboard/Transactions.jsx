/* eslint-disable react-native/no-inline-styles */
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import UserIcon from '../../../components/UserIcon';
import BoldText from '../../../components/fonts/BoldText';
import { allCurrencies } from '../../../database/data';
import { AppContext } from '../../../components/AppContext';
import ToastMessage from '../../../components/ToastMessage';
import { useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../../../assets/images/backArrow.svg';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import RegularText from '../../../components/fonts/RegularText';
import { addingDecimal } from '../../../../utils/AddingZero';
import { groupTransactionsByDate } from '../../../../utils/groupTransactions';
import TransactionHistoryParams from '../../MenuPages/TransactionHistoryParams';
import Back from '../../../components/Back';
import { networkProvidersIcon } from '../../SendMenuPages/AirtimeTopUp/BuyAirtime';
import { billIcon } from '../../MenuPages/TransactionHistory';
import FilterModal from '../../../components/FilterModal';
import IonIcon from '@expo/vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import useFetchData from '../../../../utils/fetchAPI';

const Transactions = ({ navigation, route }) => {
  const { getFetchData } = useFetchData();
  const { selectedCurrency, vh } = useContext(AppContext);
  const [status, setStatus] = useState('');
  const [transactionState, setTransactionState] = useState(transactions);
  const [selectedTransaction, setSelectedTransaction] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [label2, setLabel2] = useState('');
  const [modalData, setModalData] = useState(null);
  const [transactionsModal, setTransactionsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [totalTransactionsLength, setTotalTransactionsLength] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const limit = Math.round(vh / 50);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setIsLocalLoading(true);
        const selectedStatus = status || route.params.transactionStatus;
        const response = await getFetchData(
          `admin/transactions?currency=${selectedCurrency.currency},${selectedCurrency.acronym}&status=${selectedStatus}&limit=${limit}&page=${1}`,
        );

        if (response.status === 200) {
          const swapLength = response.data.data.filter(
            transaction => transaction.transactionType === 'swap',
          ).length;
          setTotalTransactionsLength(response.data.total - swapLength);
          setTransactions(
            response.data.data.filter(
              transaction => transaction.transactionType !== 'swap',
            ),
          );
        }
      } finally {
        setIsLocalLoading(false);
      }
    };
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, route.params.transactionStatus, selectedCurrency, status]);

  useFocusEffect(
    useCallback(() => {
      let histories;
      const selectedStatus = status || route.params.transactionStatus;
      if (selectedStatus === 'success') {
        histories = transactions.filter(
          transaction => transaction.status === 'success',
        );
        setSelectedTransaction(groupTransactionsByDate(histories));
        setTransactionState(histories);
      }
      if (selectedStatus === 'pending') {
        histories = transactions.filter(
          transaction => transaction.status === 'pending',
        );
        setSelectedTransaction(groupTransactionsByDate(histories));
        setTransactionState(histories);
      }
      if (selectedStatus === 'blocked') {
        histories = transactions.filter(
          transaction => transaction.status === 'blocked',
        );
        setSelectedTransaction(groupTransactionsByDate(histories));
        setTransactionState(histories);
      }
    }, [route.params.transactionStatus, status, transactions]),
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
    option => option.status === route.params.transactionStatus,
  ).label;

  const handleModal = selected => {
    setTotalTransactionsLength(0);
    setReload(prev => !prev);
    setModalOpen(false);
    setSelectedLabel(selected.label);
    setLabel2(selected.label2);
    setPage(1);
    setIsSearching(false);
    if (selected.status) {
      setStatus(selected.status);
      const histories = transactions.filter(
        transaction => transaction.status === selected.status,
      );
      setSelectedTransaction(groupTransactionsByDate(histories));
      setTransactionState(histories);
    } else {
      setSelectedTransaction(groupTransactionsByDate(transactions));
      setTransactionState(transactions);
    }
  };

  const handleScrollMore = async () => {
    try {
      setReloading(true);
      const selectedStatus = status || route.params.transactionStatus;
      const response = await getFetchData(
        `admin/transactions?currency=${selectedCurrency.currency},${
          selectedCurrency.acronym
        }&status=${selectedStatus}&limit=${limit}&page=${page + 1}`,
      );

      if (response.status === 200) {
        const swapLength = response.data.data.filter(
          transaction => transaction.transactionType === 'swap',
        ).length;
        setTotalTransactionsLength(totalTransactionsLength - swapLength);
        const result = response.data.data.filter(
          transaction => transaction.transactionType !== 'swap',
        );
        setPage(page + 1);
        const uniqueIds = new Set();

        setTransactions(
          [...transactions, ...result].filter(obj => {
            if (!uniqueIds.has(obj.id)) {
              uniqueIds.add(obj.id);
              return true;
            }
            return false;
          }),
        );
        setSelectedTransaction(
          isSearching
            ? transactionState
            : groupTransactionsByDate(transactionState),
        );
      }
    } finally {
      setReloading(false);
    }
  };
  return (
    <>
      <View key={reload} style={{ flex: 1 }}>
        <FilterModal
          showModal={showFilterModal}
          setShowModal={setShowFilterModal}
          setTransactionHistory={setSelectedTransaction}
          transactions={transactions}
          setActiveTransactions={setTransactionState}
          setTotalTransactionsLength={setTotalTransactionsLength}
          setIsFiltered={setIsFiltered}
        />
        {isSearching ? (
          <View style={styles.searchList}>
            <FlatList
              data={searchHistory}
              renderItem={({ item }) => (
                <Transaction
                  transaction={item}
                  navigation={navigation}
                  setTransactions={setSelectedTransaction}
                  setTransactionsModal={setTransactionsModal}
                  setModalData={setModalData}
                />
              )}
              keyExtractor={({ _id, transactionType }) => transactionType + _id}
              ListHeaderComponent={
                <Header
                  setIsSearching={setIsSearching}
                  setSearchHistory={setSearchHistory}
                  setIsLocalLoading={setIsLocalLoading}
                  setShowFilterModal={setShowFilterModal}
                  searchTransactions={transactionState}
                  navigation={navigation}
                  setModalOpen={setModalOpen}
                  label={label}
                  selectedLabel={selectedLabel}
                />
              }
              ListFooterComponent={
                transactions.length &&
                (transactions.length >= totalTransactionsLength ? (
                  <View style={styles.complete}>
                    <BoldText>That&apos;s all for now</BoldText>
                  </View>
                ) : (
                  reloading && <ActivityIndicator color={'#1e1e1e'} />
                ))
              }
              onEndReachedThreshold={0.5}
              onEndReached={
                !isFiltered &&
                !reloading &&
                transactions.length &&
                transactions.length < totalTransactionsLength
                  ? handleScrollMore
                  : undefined
              }
              bounces={false}
              removeClippedSubviews
            />
          </View>
        ) : !isLocalLoading ? (
          <View style={styles.transactions}>
            {selectedTransaction.length ? (
              <FlatList
                keyExtractor={({ date }) => date}
                data={selectedTransaction}
                renderItem={({ item: dayHistory }) => (
                  <View key={dayHistory.date} style={styles.dateHistory}>
                    <RegularText style={styles.date}>
                      {dayHistory.date}
                    </RegularText>
                    <FlatList
                      data={dayHistory.histories}
                      renderItem={({ item }) => (
                        <Transaction
                          transaction={item}
                          navigation={navigation}
                          setTransactions={setSelectedTransaction}
                          setTransactionsModal={setTransactionsModal}
                          setModalData={setModalData}
                        />
                      )}
                      keyExtractor={({ _id, transactionType }) =>
                        transactionType + _id
                      }
                      bounces={false}
                      removeClippedSubviews
                    />
                  </View>
                )}
                ListHeaderComponent={
                  <Header
                    setIsSearching={setIsSearching}
                    setSearchHistory={setSearchHistory}
                    setIsLocalLoading={setIsLocalLoading}
                    setShowFilterModal={setShowFilterModal}
                    searchTransactions={transactionState}
                    navigation={navigation}
                    setModalOpen={setModalOpen}
                    label={label}
                    selectedLabel={selectedLabel}
                  />
                }
                ListFooterComponent={
                  transactions.length &&
                  (transactions.length >= totalTransactionsLength ? (
                    <View style={styles.complete}>
                      <BoldText>That&apos;s all for now</BoldText>
                    </View>
                  ) : (
                    reloading && <ActivityIndicator color={'#1e1e1e'} />
                  ))
                }
                onEndReachedThreshold={0.5}
                onEndReached={
                  !isFiltered &&
                  !reloading &&
                  transactions.length &&
                  transactions.length < totalTransactionsLength
                    ? handleScrollMore
                    : undefined
                }
                bounces={false}
                removeClippedSubviews
              />
            ) : (
              <>
                <Header
                  setIsSearching={setIsSearching}
                  setSearchHistory={setSearchHistory}
                  setIsLocalLoading={setIsLocalLoading}
                  setShowFilterModal={setShowFilterModal}
                  searchTransactions={transactionState}
                  navigation={navigation}
                  setModalOpen={setModalOpen}
                  label={label}
                  selectedLabel={selectedLabel}
                />
                <View style={styles.empty}>
                  <BoldText>
                    No current {label2 || route.params.transactionStatus}{' '}
                    transactions{' '}
                  </BoldText>
                </View>
              </>
            )}
          </View>
        ) : (
          <>
            <Header
              setIsSearching={setIsSearching}
              setSearchHistory={setSearchHistory}
              setIsLocalLoading={setIsLocalLoading}
              setShowFilterModal={setShowFilterModal}
              searchTransactions={transactionState}
              navigation={navigation}
              setModalOpen={setModalOpen}
              label={label}
              selectedLabel={selectedLabel}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: -50 + '%',
              }}>
              <ActivityIndicator
                size={'large'}
                color={'#1e1e1e'}
                style={styles.loading}
              />
            </View>
          </>
        )}
        <Modal
          visible={transactionsModal}
          animationType="fade"
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
        <Modal
          visible={modalOpen}
          animationType="slide"
          transparent
          style={{ zIndex: 999 }}
          onRequestClose={() => setModalOpen(prev => !prev)}>
          <View style={styles.overlay} />
          <Pressable
            style={styles.modalContainer}
            onPress={() => setModalOpen(prev => !prev)}>
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
          </Pressable>
        </Modal>
      </View>
    </>
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
  modalContainer: {
    width: 100 + '%',
    height: 100 + '%',
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 3 + '%',
  },
  subHeader: {
    paddingHorizontal: 3 + '%',
    marginVertical: 20,
  },
  textInputContainer: {
    paddingHorizontal: 3 + '%',
    marginBottom: 30,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    marginTop: 20,
    borderRadius: 5,
    height: 35,
    fontFamily: 'OpenSans-400',
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
    marginVertical: 5,
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5 + '%',
    flex: 1,
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
  complete: {
    alignItems: 'center',
    marginVertical: 10,
  },
});
export default Transactions;

const Transaction = memo(
  ({ transaction, setTransactions, setTransactionsModal, setModalData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
      amount,
      currency,
      transferCode,
      reference,
      senderName,
      senderPhoto,
      status,
      transactionType,
      receiverPhoto,
      receiverName,
      receiverAccount,
      senderAccount,
      networkProvider,
      debitAccount,
      dataPlan,
      billType,
      billName,
    } = transaction;

    const currencySymbol = allCurrencies.find(
      id => currency === id.currency || currency === id.acronym,
    )?.symbol;

    const accountDebited =
      transactionType === 'credit'
        ? receiverAccount
        : transactionType === 'debit'
          ? senderAccount
          : debitAccount;

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
                <RegularText>Transfer</RegularText>
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
                  <RegularText>{accountDebited}</RegularText>
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
                <RegularText>Transfer</RegularText>
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
                  <RegularText>{accountDebited}</RegularText>
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
                  {networkProvider} - {transaction.rechargePhoneNo}
                </BoldText>
                <RegularText>Airtime Recharge</RegularText>
              </View>
              <View style={styles.amount}>
                <BoldText style={styles.debitAmount}>
                  -
                  {currencySymbol +
                    addingDecimal(Number(amount).toLocaleString())}
                </BoldText>
                <RegularText> {accountDebited}</RegularText>
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
                  {networkProvider} - {transaction.rechargePhoneNo}
                </BoldText>
                <RegularText>Data Recharge - {dataPlan.value}</RegularText>
              </View>
              <View style={styles.amount}>
                <BoldText style={styles.debitAmount}>
                  -
                  {currencySymbol +
                    addingDecimal(Number(amount).toLocaleString())}
                </BoldText>
                <RegularText> {accountDebited}</RegularText>
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
                <RegularText> {accountDebited}</RegularText>
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
  },
);

const ExpandedInput = ({
  reference,
  transferCode,
  transaction,
  setTransactions,
}) => {
  const { postFetchData } = useFetchData();
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

const Header = memo(
  ({
    setIsSearching,
    setSearchHistory,
    setIsLocalLoading,
    setShowFilterModal,
    hideSearch,
    searchTransactions,
    navigation,
    setModalOpen,
    label,
    selectedLabel,
  }) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleSearchFocus = async () => {
      setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
      !searchText && setIsSearchFocused(false);
    };

    const handleSearch = async text => {
      try {
        setIsLocalLoading(true);
        setSearchText(text);
        const foundHistories = searchTransactions.filter(history => {
          return Object.values(history)
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase());
        });
        text ? setIsSearching(true) : setIsSearching(false);

        setSearchHistory(foundHistories);
      } finally {
        setIsLocalLoading(false);
      }
    };

    const handleFilter = () => {
      setIsSearching(false);
      setShowFilterModal(true);
    };

    return (
      <View>
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <BackIcon />
            <BoldText style={styles.headerText}>Transactions</BoldText>
          </Pressable>
        </View>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => setModalOpen(true)} style={styles.input}>
            <BoldText style={styles.inputText}>
              {selectedLabel || label}
            </BoldText>
            <ChevronDown />
          </Pressable>
          <Pressable onPress={handleFilter}>
            <IonIcon name="filter-sharp" size={20} />
          </Pressable>
        </View>
        <View style={styles.container}>{/* <BalanceCard /> */}</View>
        {!hideSearch && (
          <View style={styles.textInputContainer}>
            <TextInput
              style={{
                ...styles.textInput,
                textAlign: isSearchFocused ? 'left' : 'center',
                paddingLeft: isSearchFocused ? 10 : 0,
              }}
              placeholder={isSearchFocused ? '' : 'Search'}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onChangeText={text => handleSearch(text)}
            />
          </View>
        )}
      </View>
    );
  },
);
