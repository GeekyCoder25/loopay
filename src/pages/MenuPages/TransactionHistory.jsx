/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import PageContainer from '../../components/PageContainer';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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

const TransactionHistory = ({ navigation }) => {
  const { vh } = useContext(AppContext);
  const [focused, setFocused] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [searchData, setSearchData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const getTransactions = async () => {
      const response = await getFetchData('user/transaction?date=true');
      if (response.status === 200) {
        setTransactionHistory(response.data);
      }
      setIsLocalLoading(false);
    };
    getTransactions();
  }, []);

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

      const foundHistories = searchData.map(history =>
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
    <PageContainer justify={true}>
      {transactionHistory.length ? (
        <ScrollView>
          <View
            style={{
              ...styles.container,
              minHeight: vh * 0.65,
            }}>
            <BoldText style={styles.historyHeader}>
              Transaction history
            </BoldText>
            <View
              style={{
                ...styles.textInputContainer,
              }}>
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
            {!isLocalLoading ? (
              <View style={styles.body}>
                {isSearching ? (
                  <View style={styles.searchList}>
                    {searchHistory.map(
                      history =>
                        history && (
                          <History key={history.id} history={history} />
                        ),
                    )}
                  </View>
                ) : (
                  transactionHistory.map(dayHistory => (
                    <View key={dayHistory.date} style={styles.dateHistory}>
                      <RegularText style={styles.date}>
                        {dayHistory.date}
                      </RegularText>
                      {dayHistory.histories.map(history => (
                        <History
                          key={history.id}
                          history={history}
                          navigation={navigation}
                        />
                      ))}
                    </View>
                  ))
                )}
              </View>
            ) : (
              <ActivityIndicator
                size={'large'}
                color={'#1e1e1e'}
                style={styles.loading}
              />
            )}
          </View>
        </ScrollView>
      ) : isLocalLoading ? (
        <ActivityIndicator
          size={'large'}
          color={'#1e1e1e'}
          style={styles.loadingPage}
        />
      ) : (
        <View style={styles.historyEmpty}>
          <BoldText style={styles.historyEmptyText}>
            Your transaction histories will appear here
          </BoldText>
        </View>
      )}
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  historyHeader: {
    paddingHorizontal: 3 + '%',
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
    marginTop: 50 + '%',
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

export const History = ({ history, navigation }) => {
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
          {console.log(history)}
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
    </Pressable>
  );
};
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
