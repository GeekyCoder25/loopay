/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import PageContainer from '../../components/PageContainer';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppContext } from '../../components/AppContext';
import { allCurrencies } from '../../database/data';
import UserIcon from '../../components/UserIcon';
import { addingDecimal } from '../../../utils/AddingZero';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import FaIcon from '@expo/vector-icons/FontAwesome';
import IonIcon from '@expo/vector-icons/Ionicons';
import FilterModal from '../../components/FilterModal';
import { useWalletContext } from '../../context/WalletContext';
import { groupTransactionsByDate } from '../../../utils/groupTransactions';
import SwapIcon from '../../../assets/images/swap.svg';
import FlagSelect from '../../components/FlagSelect';
import { setShowBalance } from '../../../utils/storage';
import useFetchData from '../../../utils/fetchAPI';

const TransactionHistory = memo(({ navigation }) => {
  const { getFetchData } = useFetchData();
  const { selectedCurrency, vh } = useContext(AppContext);
  const { transactions: walletTransactions } = useWalletContext();
  const [activeTransactions, setActiveTransactions] =
    useState(walletTransactions);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [reloading, setReloading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactionsLength, setTotalTransactionsLength] = useState(0);
  const limit = Math.round(vh / 50);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setIsLocalLoading(true);
        const response = await getFetchData(
          `user/transaction?currency=${selectedCurrency.currency},${selectedCurrency.acronym}&limit=${limit}&page=${1}`,
        );

        if (response.status === 200) {
          setTotalTransactionsLength(response.data.total);
          const result = response.data.data;
          setTransactions(result);
          setActiveTransactions(result);
          const groupedTransactions = groupTransactionsByDate(result);
          setTransactionHistory(groupedTransactions);
        }
      } finally {
        setIsLocalLoading(false);
      }
    };
    getTransactions();
    setTransactionHistory(groupTransactionsByDate(activeTransactions));
    setReloading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollMore = async () => {
    try {
      setReloading(true);
      const response = await getFetchData(
        `user/transaction?currency=${selectedCurrency.currency},${
          selectedCurrency.acronym
        }&limit=${limit}&page=${page + 1}`,
      );

      if (response.status === 200 && response.data.pageSize) {
        const result = response.data.data;
        const uniqueIds = new Set();
        const uniqueIds2 = new Set();
        const uniqueIds3 = new Set();
        setPage(page + 1);
        setTransactions(
          [...transactions, ...result].filter(obj => {
            if (!uniqueIds.has(obj._id)) {
              uniqueIds.add(obj._id);
              return true;
            }
            return false;
          }),
        );
        setActiveTransactions(
          [...activeTransactions, ...result].filter(obj => {
            if (!uniqueIds2.has(obj._id)) {
              uniqueIds.add(obj._id);
              return true;
            }
            return false;
          }),
        );
        setTransactionHistory(
          groupTransactionsByDate(
            [...transactions, ...result].filter(obj => {
              if (!uniqueIds3.has(obj._id)) {
                uniqueIds.add(obj._id);
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

  return (
    <>
      <FilterModal
        showModal={showFilterModal}
        setShowModal={setShowFilterModal}
        setTransactionHistory={setTransactionHistory}
        transactions={transactions}
        setActiveTransactions={setActiveTransactions}
        setTotalTransactionsLength={setTotalTransactionsLength}
        setIsFiltered={setIsFiltered}
      />
      {transactionHistory.length ? (
        isSearching ? (
          <View style={styles.searchList}>
            <FlatList
              data={searchHistory}
              renderItem={({ item }) => (
                <History navigation={navigation} history={item} />
              )}
              keyExtractor={({ _id, transactionType }) => transactionType + _id}
              ListHeaderComponent={
                <Header
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                  setSearchHistory={setSearchHistory}
                  setIsLocalLoading={setIsLocalLoading}
                  setShowFilterModal={setShowFilterModal}
                  searchTransactions={activeTransactions}
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
            data={transactionHistory}
            renderItem={({ item: dayHistory }) => (
              <View key={dayHistory.date} style={styles.dateHistory}>
                <RegularText style={styles.date}>{dayHistory.date}</RegularText>

                <FlatList
                  data={dayHistory.histories}
                  renderItem={({ item }) => (
                    <History navigation={navigation} history={item} />
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
                searchTransactions={activeTransactions}
                hideSearch
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
        )
      ) : (
        <PageContainer justify={true}>
          <Header
            setIsLocalLoading={setIsLocalLoading}
            setIsSearching={setIsSearching}
            setSearchHistory={setSearchHistory}
            setShowFilterModal={setShowFilterModal}
            hideSearch={!isLocalLoading}
          />
          {isLocalLoading ? (
            <View style={styles.loadingPage}>
              <ActivityIndicator size={'large'} color={'#1e1e1e'} />
            </View>
          ) : (
            <View style={styles.historyEmpty}>
              <BoldText style={styles.historyEmptyText}>
                Your transaction histories will appear here
              </BoldText>
            </View>
          )}
        </PageContainer>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 3 + '%',
  },
  historyHeader: {
    marginTop: 10,
    fontSize: 17,
    fontFamily: 'OpenSans-600',
  },
  textInputContainer: {
    paddingHorizontal: 3 + '%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2F3F5',
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
  swapAmountContainer: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
    gap: 3,
  },
  historyTitle: {
    textTransform: 'capitalize',
  },
  creditAmount: {
    color: '#006E53',
    fontSize: 16,
    marginRight: 5,
  },
  amount: {
    alignItems: 'flex-end',
  },
  debitAmount: {
    color: 'red',
    fontSize: 16,
    marginRight: 5,
  },
  loading: {
    marginTop: 15 + '%',
  },
  loadingPage: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 50 + '%',
  },
  searchList: {
    marginTop: 20,
  },
  historyEmpty: {
    marginTop: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 100 + '%',
    paddingHorizontal: 15 + '%',
  },
  historyEmptyText: {
    textAlign: 'center',
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
export default TransactionHistory;

export const History = memo(({ history, navigation }) => {
  const { appData, vw, showAmount, setShowAmount } = useContext(AppContext);
  const { wallet } = useWalletContext();
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
    swapFrom,
    swapTo,
    swapFromAmount,
    swapToAmount,
    method,
  } = history;

  const currencySymbol = allCurrencies.find(
    id => currency === id.currency || currency === id.acronym,
  )?.symbol;

  const swapFromSymbol = allCurrencies.find(
    id => swapFrom === id.currency,
  )?.symbol;

  const swapToSymbol = allCurrencies.find(id => swapTo === id.currency)?.symbol;

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };
  return (
    <Pressable
      onPress={() => navigation.navigate('TransactionHistoryDetails', history)}
      style={styles.history}>
      {transactionType?.toLowerCase() === 'credit' && (
        <>
          <UserIcon uri={senderPhoto} />
          <View style={styles.historyContent}>
            {method ? (
              <>
                <BoldText>{receiverName}</BoldText>
                <RegularText>
                  {method === 'card' ? 'Card self' : 'Transfer self'}
                </RegularText>
              </>
            ) : (
              <>
                <BoldText>{senderName}</BoldText>
                <RegularText>Transfer</RegularText>
              </>
            )}
          </View>
          <View style={styles.amount}>
            <Pressable onPress={handleShow}>
              <BoldText style={styles.creditAmount}>
                {showAmount
                  ? `+ ${
                      currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())
                    }`
                  : '***'}{' '}
              </BoldText>
            </Pressable>
            <RegularText>
              To
              <BoldText> •</BoldText>{' '}
              {wallet.loopayAccNo.slice(
                wallet.loopayAccNo.length - 4,
                wallet.loopayAccNo.length,
              )}
            </RegularText>
          </View>
        </>
      )}
      {transactionType?.toLowerCase() === 'debit' && (
        <>
          <UserIcon uri={receiverPhoto} />
          <View style={styles.historyContent}>
            <BoldText>{receiverName}</BoldText>
            <RegularText>Transfer</RegularText>
          </View>
          <View style={styles.amount}>
            <Pressable onPress={handleShow}>
              <BoldText style={styles.debitAmount}>
                {showAmount
                  ? `- ${
                      currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())
                    }`
                  : '***'}{' '}
              </BoldText>
            </Pressable>
            <RegularText>
              From
              <BoldText> •</BoldText>{' '}
              {wallet.loopayAccNo.slice(
                wallet.loopayAccNo.length - 4,
                wallet.loopayAccNo.length,
              )}
            </RegularText>
          </View>
        </>
      )}
      {transactionType?.toLowerCase() === 'airtime' && (
        <>
          {networkProvidersIcon(networkProvider)}
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>
              {networkProvider.toUpperCase()}
            </BoldText>
            <RegularText>Airtime</RegularText>
          </View>
          <View style={styles.amount}>
            <Pressable onPress={handleShow}>
              <BoldText style={styles.debitAmount}>
                {showAmount
                  ? `- ${
                      currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())
                    }`
                  : '***'}{' '}
              </BoldText>
            </Pressable>
            <RegularText>
              From
              <BoldText> •</BoldText>{' '}
              {wallet.loopayAccNo.slice(
                wallet.loopayAccNo.length - 4,
                wallet.loopayAccNo.length,
              )}
            </RegularText>
          </View>
        </>
      )}
      {transactionType?.toLowerCase() === 'data' && (
        <>
          {networkProvidersIcon(networkProvider)}
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>
              {networkProvider.toUpperCase()}
            </BoldText>
            <RegularText>Data</RegularText>
          </View>
          <View style={styles.amount}>
            <Pressable onPress={handleShow}>
              <BoldText style={styles.debitAmount}>
                {showAmount
                  ? `- ${
                      currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())
                    }`
                  : '***'}{' '}
              </BoldText>
            </Pressable>
            <RegularText>
              From
              <BoldText> •</BoldText>{' '}
              {wallet.loopayAccNo.slice(
                wallet.loopayAccNo.length - 4,
                wallet.loopayAccNo.length,
              )}
            </RegularText>
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
            <Pressable onPress={handleShow}>
              <BoldText style={styles.debitAmount}>
                {showAmount
                  ? `- ${
                      currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())
                    }`
                  : '***'}{' '}
              </BoldText>
            </Pressable>
            <RegularText>
              From
              <BoldText> •</BoldText>{' '}
              {wallet.loopayAccNo.slice(
                wallet.loopayAccNo.length - 4,
                wallet.loopayAccNo.length,
              )}
            </RegularText>
          </View>
        </>
      )}
      {transactionType === 'swap' && (
        <>
          <View style={styles.historyIconText}>
            <FlagSelect country={currency} style={{ width: 40, height: 40 }} />
          </View>
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>
              {appData.userProfile.fullName}
            </BoldText>
            <RegularText style={styles.historyTitle}>swap</RegularText>
          </View>
          <View style={styles.amount}>
            <Pressable onPress={handleShow}>
              {showAmount ? (
                <View style={styles.swapAmountContainer}>
                  <BoldText
                    style={{
                      ...styles.transactionAmountText,
                      ...styles.debitAmount,
                      marginRight: 0,
                    }}>
                    {`${swapFromSymbol}${addingDecimal(
                      Number(swapFromAmount).toLocaleString(),
                    )}`}
                  </BoldText>
                  <SwapIcon
                    width={14}
                    height={14}
                    style={vw > 360 ? styles.swap : styles.swapIcon}
                  />
                  <BoldText
                    style={{
                      ...styles.transactionAmountText,
                      ...styles.creditAmount,
                    }}>
                    {`${swapToSymbol}${addingDecimal(
                      Number(swapToAmount).toLocaleString(),
                    )}`}
                  </BoldText>
                </View>
              ) : (
                <BoldText style={styles.transactionAmountText}>***</BoldText>
              )}
            </Pressable>
            <RegularText>
              From
              <BoldText> •</BoldText>{' '}
              {wallet.loopayAccNo.slice(
                wallet.loopayAccNo.length - 4,
                wallet.loopayAccNo.length,
              )}
            </RegularText>
          </View>
        </>
      )}
    </Pressable>
  );
});
export const billIcon = key => {
  switch (key) {
    case 'electricity':
      return <FaIcon name="bolt" size={18} />;
    case 'school':
      return <FaIcon name="graduation-cap" size={18} />;
    case 'tv':
      return <FaIcon name="tv" size={18} />;
    default:
      return <FaIcon name="send" size={18} />;
  }
};

const Header = memo(
  ({
    isSearching,
    setIsSearching,
    setSearchHistory,
    setIsLocalLoading,
    setShowFilterModal,
    hideSearch,
    searchTransactions,
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
