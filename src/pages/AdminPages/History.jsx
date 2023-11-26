/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import { useAdminDataContext } from '../../context/AdminContext';
import RegularText from '../../components/fonts/RegularText';
import { allCurrencies } from '../../database/data';
import { addingDecimal } from '../../../utils/AddingZero';
import UserIcon from '../../components/UserIcon';
import { groupTransactionsByDate } from '../../../utils/groupTransactions';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import { FlatList } from 'react-native-gesture-handler';
import FilterModal from '../../components/FilterModal';
import IonIcon from '@expo/vector-icons/Ionicons';

const History = ({ navigation }) => {
  const { adminData } = useAdminDataContext();
  const { transactions: allTransactions } = adminData;
  const [histories, setHistories] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [reloading, setReloading] = useState(false);

  const transactions = allTransactions.filter(
    transaction => transaction.transactionType !== 'swap',
  );

  const [activeHistories, setActiveHistories] = useState(transactions);

  useEffect(() => {
    const groupedTransactions = groupTransactionsByDate(
      activeHistories.slice(0, 10),
    );
    setHistories(groupedTransactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollMore = () => {
    setReloading(true);
    setPage(prev => prev + 1);
    setHistories(
      groupTransactionsByDate(activeHistories.slice(0, (page + 1) * 10)),
    );
    setReloading(false);
  };

  return (
    <View style={styles.body}>
      <FilterModal
        showModal={showFilterModal}
        setShowModal={setShowFilterModal}
        setTransactionHistory={setHistories}
        transactions={transactions}
        setActiveTransactions={setActiveHistories}
      />
      {isSearching ? (
        <View style={styles.searchList}>
          <FlatList
            data={searchHistory}
            renderItem={({ item }) => (
              <HistoryComp history={item} navigation={navigation} />
            )}
            keyExtractor={({ id, transactionType }) => transactionType + id}
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
                    navigation={navigation}
                    // accNoAsterisk={accNoAsterisk}
                  />
                )}
                keyExtractor={({ id, transactionType }) => transactionType + id}
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <Header
              setIsSearching={setIsSearching}
              setSearchHistory={setSearchHistory}
              setIsLocalLoading={setIsLocalLoading}
              setShowFilterModal={setShowFilterModal}
              transactions={transactions}
              setActiveHistories={setActiveHistories}
            />
          )}
          ListFooterComponent={() =>
            reloading && <ActivityIndicator color={'#1e1e1e'} />
          }
          onEndReachedThreshold={0.7}
          onEndReached={handleScrollMore}
        />
      ) : (
        <ActivityIndicator
          size={'large'}
          color={'#1e1e1e'}
          style={styles.loading}
        />
      )}
    </View>
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
  container: {
    paddingHorizontal: 5 + '%',
  },
  body: {
    marginTop: 30,
  },
  textInputContainer: {
    paddingHorizontal: 3 + '%',
  },
  textInput: {
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
  historyTitle: {
    textTransform: 'capitalize',
  },
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
});
export default History;

const HistoryComp = ({ history, navigation }) => {
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
  } = history;
  const [currencySymbol, setCurrencySymbol] = useState('');
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

  useEffect(() => {
    setCurrencySymbol(
      allCurrencies.find(id => currency === id.currency)?.symbol || '',
    );
  }, [currency]);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('TransactionHistoryDetails', {
          previousScreen: 'History',
          ...history,
        })
      }
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
    </Pressable>
  );
};

const Header = ({
  setIsSearching,
  setSearchHistory,
  setIsLocalLoading,
  setShowFilterModal,
  hideSearch,
  transactions,
  setActiveHistories,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = async () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // setIsSearching(false);
  };

  const handleSearch = async text => {
    try {
      setIsLocalLoading(true);

      const foundHistories = transactions.map(history =>
        Object.values(history)
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase())
          ? history
          : null,
      );
      text && foundHistories.length
        ? setIsSearching(true)
        : setIsSearching(false);

      foundHistories.length &&
        setSearchHistory(foundHistories) &&
        setActiveHistories(foundHistories);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  return (
    <View>
      <View style={styles.container}>
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
            placeholder={isSearchFocused ? '' : 'Search, e.g Beneficiary'}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChangeText={text => handleSearch(text)}
          />
        </View>
      )}
    </View>
  );
};
