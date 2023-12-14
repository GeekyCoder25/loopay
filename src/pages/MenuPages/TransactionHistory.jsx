/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext, useEffect, useState } from 'react';
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
import { getFetchData } from '../../../utils/fetchAPI';
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

const TransactionHistory = ({ navigation }) => {
  const { transactions, wallet } = useWalletContext();
  const [activeTransactions, setActiveTransactions] = useState(transactions);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [accNoAsterisk, setAccNoAsterisk] = useState([]);
  // const [page, setPage] = useState(1);
  const [reloading, setReloading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  // const totalTransactionsLength = transactions.length;
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    setTransactionHistory(groupTransactionsByDate(activeTransactions));
    setIsLocalLoading(false);
    setReloading(false);
  }, [activeTransactions]);

  // const handleScrollMore = () => {
  //   setReloading(true);
  //   setPage(prev => prev + 1);
  //   setTransactionHistory(
  //     groupTransactionsByDate(activeTransactions.slice(0, (page + 1) * 10)),
  //   );
  //   setReloading(false);
  // };

  useEffect(() => {
    setAccNoAsterisk([]);
    for (let i = 0; i < wallet.loopayAccNo.length - 3; i++) {
      setAccNoAsterisk(prev => [...prev, '*']);
    }
  }, [wallet.loopayAccNo.length]);

  return (
    <>
      <FilterModal
        showModal={showFilterModal}
        setShowModal={setShowFilterModal}
        setTransactionHistory={setTransactionHistory}
        transactions={transactions}
        propTransactions={transactions}
        setActiveTransactions={setActiveTransactions}
        setIsFiltered={setIsFiltered}
      />
      {transactionHistory.length ? (
        !isLocalLoading ? (
          <View style={styles.body}>
            {isSearching ? (
              <View style={styles.searchList}>
                {searchHistory.map(
                  history =>
                    history && (
                      <History
                        key={history.id}
                        history={history}
                        accNoAsterisk={accNoAsterisk}
                      />
                    ),
                )}
              </View>
            ) : (
              <FlatList
                keyExtractor={({ date }) => date}
                data={transactionHistory}
                renderItem={({ item: dayHistory }) => (
                  <View key={dayHistory.date} style={styles.dateHistory}>
                    <RegularText style={styles.date}>
                      {dayHistory.date}
                    </RegularText>

                    <FlatList
                      data={dayHistory.histories}
                      renderItem={({ item }) => (
                        <History
                          history={item}
                          navigation={navigation}
                          accNoAsterisk={accNoAsterisk}
                        />
                      )}
                      keyExtractor={({ _id, transactionType }) =>
                        transactionType + _id
                      }
                    />
                  </View>
                )}
                ListHeaderComponent={() => (
                  <Header
                    setIsLocalLoading={setIsLocalLoading}
                    setIsSearching={setIsSearching}
                    setSearchHistory={setSearchHistory}
                    setShowFilterModal={setShowFilterModal}
                  />
                )}
                ListFooterComponent={() =>
                  reloading && <ActivityIndicator color={'#1e1e1e'} />
                }
                // onEndReachedThreshold={0.5}
                // onEndReached={
                //   !isFiltered &&
                //   !reloading &&
                //   transactions.length &&
                //   transactions.length < totalTransactionsLength
                //     ? handleScrollMore
                //     : undefined
                // }
                bounces={false}
              />
            )}
          </View>
        ) : (
          <ActivityIndicator
            size={'large'}
            color={'#1e1e1e'}
            style={styles.loading}
          />
        )
      ) : (
        <PageContainer justify={true}>
          <Header
            setIsLocalLoading={setIsLocalLoading}
            setIsSearching={setIsSearching}
            setSearchHistory={setSearchHistory}
            setShowFilterModal={setShowFilterModal}
            hideSearch
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
};

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
    alignItems: 'center',
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
});
export default TransactionHistory;

export const History = memo(({ history, navigation, accNoAsterisk }) => {
  const { vw } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const {
    senderName,
    receiverName,
    senderPhoto,
    receiverPhoto,
    amount,
    transactionType,
    createdAt,
    currency,
    networkProvider,
    dataPlan,
    billType,
    billName,
    swapFrom,
    swapTo,
    swapFromAmount,
    swapToAmount,
  } = history;
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

  const currencySymbol = allCurrencies.find(
    id => currency === id.currency,
  )?.symbol;

  const swapFromSymbol = allCurrencies.find(
    id => swapFrom === id.currency,
  )?.symbol;

  const swapToSymbol = allCurrencies.find(id => swapTo === id.currency)?.symbol;

  return (
    <Pressable
      onPress={() => navigation.navigate('TransactionHistoryDetails', history)}
      style={styles.history}>
      {transactionType?.toLowerCase() === 'credit' && (
        <>
          <UserIcon uri={senderPhoto} />
          <View style={styles.historyContent}>
            <BoldText>{senderName}</BoldText>
            <RegularText>Transfer</RegularText>
          </View>
          <View style={styles.amount}>
            <BoldText style={styles.creditAmount}>
              +{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
            </BoldText>
            <RegularText>{historyTime}</RegularText>
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
            <BoldText style={styles.debitAmount}>
              -{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
            </BoldText>
            <RegularText> {historyTime}</RegularText>
          </View>
        </>
      )}
      {transactionType?.toLowerCase() === 'airtime' && (
        <>
          {networkProvidersIcon(networkProvider)}
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>
              {networkProvider} - {history.phoneNo}
            </BoldText>
            <RegularText>Airtime Recharge</RegularText>
          </View>
          <View style={styles.amount}>
            <BoldText style={styles.debitAmount}>
              -{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
            </BoldText>
            <RegularText> {historyTime}</RegularText>
          </View>
        </>
      )}
      {transactionType?.toLowerCase() === 'data' && (
        <>
          {networkProvidersIcon(networkProvider)}
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>
              {networkProvider} - {history.phoneNo}
            </BoldText>
            <RegularText>Data Recharge - {dataPlan.value}</RegularText>
          </View>
          <View style={styles.amount}>
            <BoldText style={styles.debitAmount}>
              -{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
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
              -{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
            </BoldText>
            <RegularText> {historyTime}</RegularText>
          </View>
        </>
      )}
      {transactionType === 'swap' && (
        <>
          <View style={styles.historyIconText}>
            <FlagSelect country={currency} style={{ width: 40, height: 40 }} />
          </View>
          <View style={styles.historyContent}>
            <BoldText style={styles.historyTitle}>Swap</BoldText>
            <RegularText style={styles.historyTitle}>
              {accNoAsterisk}
              {wallet.loopayAccNo.slice(
                wallet.loopayAccNo.length - 3,
                wallet.loopayAccNo.length,
              )}
            </RegularText>
          </View>
          <BoldText
            style={{
              ...styles.transactionAmountText,
              ...styles.debitAmount,
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
    setIsSearching,
    setSearchHistory,
    setIsLocalLoading,
    setShowFilterModal,
    hideSearch,
  }) => {
    const [searchData, setSearchData] = useState(null);
    const [focused, setFocused] = useState(false);

    const handleSearchFocus = async () => {
      setFocused(true);
      if (!searchData) {
        const response = await getFetchData('user/transaction');
        if (response.status === 200) {
          return setSearchData(response.data.transactions);
        }
        return setSearchData([]);
      }
    };

    const handleSearchBlur = () => {
      setFocused(false);
      setIsSearching(false);
    };

    const handleSearch = async text => {
      try {
        setIsLocalLoading(true);

        const foundHistories = searchData.filter(history =>
          Object.values(history)
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase()),
        );
        text && foundHistories.length
          ? setIsSearching(true)
          : setIsSearching(false);

        foundHistories.length && setSearchHistory(foundHistories);
      } finally {
        setIsLocalLoading(false);
      }
    };

    const handleFilter = () => {
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
                textAlign: focused ? 'left' : 'center',
                paddingLeft: focused ? 10 : 0,
              }}
              placeholder={focused ? '' : 'Search, e.g Beneficiary'}
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
