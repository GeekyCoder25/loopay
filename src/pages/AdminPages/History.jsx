/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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

const History = ({ navigation }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { adminData } = useAdminDataContext();
  const [histories, setHistories] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const { transactions } = adminData;
  useEffect(() => {
    const groupedTransactons = groupTransactionsByDate(transactions);
    setHistories(groupedTransactons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupTransactionsByDate = inputArray => {
    const groupedByDate = {};

    inputArray.forEach(transaction => {
      const dateObject = new Date(transaction.createdAt);
      const options = { month: 'short' };
      const date = `${dateObject.getDate()} ${dateObject.toLocaleString(
        'en-US',
        options,
      )} ${dateObject.getFullYear()}`;
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(transaction);
    });

    const resultArray = Object.keys(groupedByDate).map(date => {
      return {
        date,
        histories: groupedByDate[date],
      };
    });

    return resultArray;
  };
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

      foundHistories.length && setSearchHistory(foundHistories);
    } finally {
      setIsLocalLoading(false);
    }
  };
  return (
    <PageContainer>
      <ScrollView>
        <View style={styles.container}>
          <BalanceCard />
        </View>

        <View style={styles.body}>
          <View style={styles.container}>
            <BoldText>Transaction history</BoldText>
            <TextInput
              style={{
                ...styles.textInput,
                textAlign: isSearchFocused ? 'left' : 'center',
                paddingLeft: isSearchFocused ? 10 : 0,
              }}
              placeholder={isSearchFocused ? '' : 'Search, e.g Username'}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onChangeText={text => handleSearch(text)}
            />
          </View>
          {isSearching ? (
            <View style={styles.searchList}>
              {searchHistory.map(
                history =>
                  history && (
                    <HistoryComp
                      key={history._id}
                      history={history}
                      navigation={navigation}
                    />
                  ),
              )}
            </View>
          ) : !isLocalLoading ? (
            histories.map(dayHistory => (
              <View key={dayHistory.date} style={styles.dateHistory}>
                <RegularText style={styles.date}>{dayHistory.date}</RegularText>
                {dayHistory.histories.map(history => (
                  <HistoryComp
                    key={history._id}
                    history={history}
                    navigation={navigation}
                  />
                ))}
              </View>
            ))
          ) : (
            <ActivityIndicator
              size={'large'}
              color={'#1e1e1e'}
              style={styles.loading}
            />
          )}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
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

  let currencySymbol = allCurrencies.find(
    id => currency.toLowerCase() === id.acronym.toLowerCase(),
  );
  currencySymbol = currencySymbol.symbol;
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('TransactionHistoryDetails', {
          previousScreen: 'History',
          ...history,
        })
      }
      style={styles.history}>
      {transactionType?.toLowerCase() === 'credit' ? (
        <>
          <UserIcon uri={senderPhoto} />
          <View style={styles.historyContent}>
            <BoldText>{senderName}</BoldText>
            <RegularText>{historyTime}</RegularText>
          </View>
          <View style={styles.amount}>
            <BoldText style={styles.creditAmount}>
              +{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
            </BoldText>
          </View>
        </>
      ) : (
        <>
          <UserIcon uri={receiverPhoto} />
          <View style={styles.historyContent}>
            <BoldText>{receiverName}</BoldText>
            <RegularText>{historyTime}</RegularText>
          </View>
          <View style={styles.amount}>
            <BoldText style={styles.debitAmount}>
              -{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
            </BoldText>
          </View>
        </>
      )}
    </Pressable>
  );
};
