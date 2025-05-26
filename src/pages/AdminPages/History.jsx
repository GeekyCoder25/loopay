/* eslint-disable react-native/no-inline-styles */
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { allCurrencies } from '../../database/data';
import { addingDecimal } from '../../../utils/AddingZero';
import UserIcon from '../../components/UserIcon';
import { groupTransactionsByDate } from '../../../utils/groupTransactions';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import FilterModal from '../../components/FilterModal';
import IonIcon from '@expo/vector-icons/Ionicons';
import { billIcon } from '../MenuPages/TransactionHistory';
import { AppContext } from '../../components/AppContext';
import Back from '../../components/Back';
import TransactionHistoryParams from '../MenuPages/TransactionHistoryParams';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BalanceCard from './components/BalanceCard';
import useFetchData from '../../../utils/fetchAPI';

const History = () => {
  const { getFetchData } = useFetchData();
  const { refetchTransactions, selectedCurrency, vh } = useContext(AppContext);
  const [histories, setHistories] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [activeHistories, setActiveHistories] = useState(transactions);
  const [totalTransactionsLength, setTotalTransactionsLength] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [transactionModal, setTransactionModal] = useState(null);
  const limit = Math.round(vh / 50);

  useFocusEffect(
    useCallback(() => {
      const getTransactions = async () => {
        try {
          setIsLocalLoading(true);
          const response = await getFetchData(
            `admin/transactions?currency=${selectedCurrency.currency},${selectedCurrency.acronym}&limit=${limit}&page=${1}`,
          );

          if (response.status === 200) {
            const swapLength = response.data?.data?.filter(
              transaction => transaction.transactionType === 'swap',
            ).length;
            setTotalTransactionsLength(response.data?.total - swapLength);
            const result = response.data.data.filter(
              transaction => transaction.transactionType !== 'swap',
            );
            setTransactions(result);
            setActiveHistories(result);
            const groupedTransactions = groupTransactionsByDate(result);
            setHistories(groupedTransactions);
          }
        } finally {
          setIsLocalLoading(false);
        }
      };
      getTransactions();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, selectedCurrency, refetchTransactions]),
  );

  const handleScrollMore = async () => {
    try {
      setReloading(true);
      const response = await getFetchData(
        `admin/transactions?currency=${selectedCurrency.currency},${
          selectedCurrency.acronym
        }&limit=${limit}&page=${page + 1}`,
      );
      if (response.status === 200 && response.data.pageSize) {
        const swapLength = response.data?.data?.filter(
          transaction => transaction.transactionType === 'swap',
        ).length;
        setTotalTransactionsLength(totalTransactionsLength - swapLength);
        const result = response.data?.data?.filter(
          transaction => transaction.transactionType !== 'swap',
        );
        const uniqueIds = new Set();
        const uniqueIds2 = new Set();
        const uniqueIds3 = new Set();

        setPage(page + 1);
        setTransactions(
          [...transactions, ...result].filter(obj => {
            if (!uniqueIds.has(obj.id)) {
              uniqueIds.add(obj.id);
              return true;
            }
            return false;
          }),
        );
        setActiveHistories(
          [...activeHistories, ...result].filter(obj => {
            if (!uniqueIds2.has(obj.id)) {
              uniqueIds.add(obj.id);
              return true;
            }
            return false;
          }),
        );
        setHistories(
          groupTransactionsByDate(
            [...transactions, ...result].filter(obj => {
              if (!uniqueIds3.has(obj.id)) {
                uniqueIds.add(obj.id);
                return true;
              }
              return false;
            }),
          ),
        );
      }
    } finally {
      setReloading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsSearching(false);
        setSearchHistory([]);
      };
    }, []),
  );

  return (
    <View>
      <FilterModal
        showModal={showFilterModal}
        setShowModal={setShowFilterModal}
        setTransactionHistory={setHistories}
        transactions={transactions}
        setActiveTransactions={setActiveHistories}
        setTotalTransactionsLength={setTotalTransactionsLength}
        setIsFiltered={setIsFiltered}
      />

      {isSearching ? (
        <View style={styles.searchList}>
          <FlatList
            data={searchHistory}
            renderItem={({ item }) => (
              <HistoryComp
                history={item}
                setTransactionModal={setTransactionModal}
              />
            )}
            keyExtractor={({ _id, transactionType }) => transactionType + _id}
            ListHeaderComponent={
              <Header
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                setSearchHistory={setSearchHistory}
                setIsLocalLoading={setIsLocalLoading}
                setShowFilterModal={setShowFilterModal}
                searchTransactions={activeHistories}
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
            ListEmptyComponent={
              <View style={styles.empty}>
                <BoldText>No Result found</BoldText>
              </View>
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
        <FlatList
          keyExtractor={({ date }) => date}
          data={histories}
          renderItem={({ item: dayHistory }) => (
            <View key={dayHistory.date} style={styles.dateHistory}>
              <RegularText style={styles.date}>{dayHistory.date}</RegularText>

              <FlatList
                data={dayHistory.histories}
                renderItem={({ item }) => (
                  <HistoryComp
                    history={item}
                    setTransactionModal={setTransactionModal}
                  />
                )}
                keyExtractor={({ _id, transactionType, email }) =>
                  transactionType + _id + email
                }
              />
            </View>
          )}
          ListHeaderComponent={
            <Header
              setIsSearching={setIsSearching}
              setSearchHistory={setSearchHistory}
              setIsLocalLoading={setIsLocalLoading}
              setShowFilterModal={setShowFilterModal}
              searchTransactions={activeHistories}
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
          ListEmptyComponent={
            <View style={styles.empty}>
              <BoldText>No Result found</BoldText>
            </View>
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
          <Header setShowFilterModal={setShowFilterModal} hideSearch />
          <ActivityIndicator
            size={'large'}
            color={'#1e1e1e'}
            style={styles.loading}
          />
        </>
      )}
      <Modal
        visible={transactionModal && true}
        animationType="fade"
        onRequestClose={() => {
          setTransactionModal(false);
        }}>
        <Back
          onPress={() => {
            setTransactionModal(false);
          }}
        />
        <TransactionHistoryParams route={{ params: transactionModal }} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    paddingHorizontal: 3 + '%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 3 + '%',
    marginTop: 20,
  },
  historyHeader: {
    fontSize: 17,
    fontFamily: 'OpenSans-600',
  },
  container: {
    paddingHorizontal: 5 + '%',
  },
  body: {},
  textInputContainer: {
    paddingHorizontal: 3 + '%',
    paddingBottom: 10,
  },
  textInput: {
    color: '#000000',
    borderWidth: 1,
    borderColor: '#bbb',
    marginTop: 20,
    borderRadius: 5,
    height: 35,
    fontFamily: 'OpenSans-400',
  },
  dateHistory: {
    borderBottomColor: '#868585',
    borderBottomWidth: 0.2,
  },
  date: {
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 3 + '%',
    color: '#979797',
  },
  history: {
    backgroundColor: '#eee',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopColor: '#868585',
    borderTopWidth: 0.2,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
  },
  historyContent: {
    flex: 1,
    gap: 3,
  },
  historyTitle: {},
  creditAmount: {
    color: '#006E53',
    fontSize: 16,
    marginRight: 5,
  },
  debitAmount: {
    color: 'red',
    fontSize: 16,
    marginRight: 5,
  },
  amount: {
    alignItems: 'center',
  },
  loading: {
    marginTop: 15 + '%',
  },
  searchList: {
    marginTop: 20,
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
    marginHorizontal: 5,
  },
  complete: {
    alignItems: 'center',
    marginVertical: 10,
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 100 + '%',
  },
});
export default History;

const HistoryComp = memo(({ history, setTransactionModal }) => {
  const { showAmount, setShowAmount } = useContext(AppContext);

  const {
    senderName,
    receiverName,
    senderPhoto,
    receiverPhoto,
    amount,
    transactionType,
    currency,
    networkProvider,
    billType,
    billName,
    debitAccount,
    senderAccount,
    receiverAccount,
    method,
  } = history;
  const [currencySymbol, setCurrencySymbol] = useState('');
  const navigation = useNavigation();

  const accountDebited =
    transactionType === 'credit'
      ? receiverAccount
      : transactionType === 'debit'
        ? senderAccount
        : debitAccount;

  useEffect(() => {
    setCurrencySymbol(
      allCurrencies.find(
        id => currency === id.currency || currency === id.acronym,
      )?.symbol || '',
    );
  }, [currency]);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('TransactionHistoryDetails', {
          ...history,
          previousScreen: 'History',
        })
      }
      style={styles.history}>
      {transactionType?.toLowerCase() === 'credit' && (
        <>
          <UserIcon uri={senderPhoto} />
          <View style={styles.historyContent}>
            {method ? (
              <>
                <BoldText>{receiverName}</BoldText>
                <RegularText>
                  {method === 'card' ? 'Card Deposit' : 'Transfer Deposit'}
                </RegularText>
              </>
            ) : (
              <>
                <BoldText>{senderName}</BoldText>
                <RegularText>Transfer</RegularText>
              </>
            )}
          </View>
          {showAmount ? (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.creditAmount}>
                +
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText>{accountDebited}</RegularText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.creditAmount}>***</BoldText>
            </Pressable>
          )}
        </>
      )}
      {transactionType?.toLowerCase() === 'debit' && (
        <>
          <UserIcon uri={receiverPhoto} />
          <View style={styles.historyContent}>
            <BoldText>{receiverName}</BoldText>
            <RegularText>Transfer</RegularText>
          </View>
          {showAmount ? (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>
                -
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText> {accountDebited}</RegularText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>***</BoldText>
            </Pressable>
          )}
        </>
      )}
      {transactionType?.toLowerCase() === 'airtime' && (
        <>
          {networkProvidersIcon(networkProvider)}
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>
              {networkProvider.toUpperCase()} - {history.rechargePhoneNo}
            </BoldText>
            <RegularText>Airtime</RegularText>
          </View>
          {showAmount ? (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>
                -
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText> {accountDebited}</RegularText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>***</BoldText>
            </Pressable>
          )}
        </>
      )}
      {transactionType?.toLowerCase() === 'data' && (
        <>
          {networkProvidersIcon(networkProvider)}
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>
              {networkProvider.toUpperCase()} - {history.rechargePhoneNo}
            </BoldText>
            <RegularText>Data </RegularText>
          </View>
          {showAmount ? (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>
                -
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText> {accountDebited}</RegularText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>***</BoldText>
            </Pressable>
          )}
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
          {showAmount ? (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>
                -
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>
              <RegularText> {accountDebited}</RegularText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowAmount(prev => !prev);
              }}
              style={styles.amount}>
              <BoldText style={styles.debitAmount}>***</BoldText>
            </Pressable>
          )}
        </>
      )}
    </Pressable>
  );
});

const Header = memo(
  ({
    setIsSearching,
    setSearchHistory,
    setIsLocalLoading,
    setShowFilterModal,
    hideSearch,
    searchTransactions,
    isSearching,
  }) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchText, setSearchText] = useState('');
    const searchRef = useRef();

    useEffect(() => {
      isSearching && searchRef.current.focus();
    }, [isSearching]);

    const handleSearchFocus = async () => {
      setIsSearching(true);
      setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
      if (!searchText) {
        setIsSearchFocused(false);
        setIsSearching(false);
        setSearchHistory([]);
      }
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
        <View style={styles.balanceCard}>
          <BalanceCard />
        </View>
        <View style={styles.headerContainer}>
          <BoldText style={styles.historyHeader}>Transaction history</BoldText>
          <Pressable onPress={handleFilter}>
            <IonIcon name="filter-sharp" size={20} />
          </Pressable>
        </View>
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
              autoFocus={isSearchFocused}
              ref={searchRef}
            />
          </View>
        )}
      </View>
    );
  },
);
