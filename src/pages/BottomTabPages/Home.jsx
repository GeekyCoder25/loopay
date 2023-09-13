/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Bell from '../../../assets/images/bell.svg';
import BellActive from '../../../assets/images/bellActive.svg';
import ChevronDown from '../../../assets/images/chevron-down.svg';
import Wallet from '../../../assets/images/wallet.svg';
import UpAndDownArrow from '../../../assets/images/up-down-arrow.svg';
import SwapIcon from '../../../assets/images/swap.svg';
import Bg from '../../../assets/images/bg1.svg';
import { AppContext } from '../../components/AppContext';
import SelectCurrencyModal from '../../components/SelectCurrencyModal';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import FlagSelect from '../../components/FlagSelect';
import UserIcon from '../../components/UserIcon';
import WalletAmount from '../../components/WalletAmount';
import { useFocusEffect } from '@react-navigation/native';
import ToastMessage from '../../components/ToastMessage';
import { addingDecimal } from '../../../utils/AddingZero';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { allCurrencies } from '../../database/data';
import { useRequestFundsContext } from '../../context/RequestContext';
import { useWalletContext } from '../../context/WalletContext';
import { useNotificationsContext } from '../../context/NotificationContext';

const Home = ({ navigation }) => {
  const {
    selectedCurrency,
    appData,
    setWalletRefresh,
    setNoReload,
    setShowTabBar,
  } = useContext(AppContext);
  const { transactions } = useWalletContext();
  const { requestFunds: requests } = useRequestFundsContext();
  const [modalOpen, setModalOpen] = useState(false);
  const fullName = appData.userProfile.fullName;
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showAmount, setShowAmount] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { unread } = useNotificationsContext();

  useEffect(() => {
    setTransactionHistory(transactions);
  }, [transactions]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const getHistories = async () => {
  //       const response = await getFetchData('user/transaction?swap=true');
  //       if (response.status >= 400) {
  //         return setTransactionHistory("Couldn't connect to server");
  //       } else if (response.status === 204) return;
  //       if (response.status === 200) {
  //         return setTransactionHistory(response.data.transactions);
  //       }
  //     };
  //     getHistories();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [setShowTabBar, walletRefresh]),
  // );

  useFocusEffect(
    React.useCallback(() => {
      setShowTabBar(true);
      const onBackPress = () => {
        if (isExiting) {
          return false;
        } else {
          ToastMessage('Press back again to exit app');
          setIsExiting(true);
          return true;
        }
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => {
        subscription.remove();
        setTimeout(() => {
          setIsExiting(false);
        }, 3000);
      };
    }, [isExiting, setShowTabBar]),
  );

  const refreshPage = () => {};

  return (
    <>
      <PageContainer refreshFunc={refreshPage}>
        <View style={styles.headerContainer}>
          <View style={styles.bgContainer}>
            <Bg />
          </View>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.navigate('ProfileNavigator')}
              style={styles.userImageContainer}>
              <UserIcon />
              <RegularText>{fullName}</RegularText>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Notification')}>
              {unread.length ? <BellActive /> : <Bell />}
            </Pressable>
          </View>
          {requests.length > 0 && (
            <Pressable
              style={styles.request}
              onPress={() => navigation.navigate('PendingRequest')}>
              <View style={styles.requestBell}>
                <BoldText>🔔 </BoldText>
                <BoldText style={styles.requestText}>
                  {requests.length > 1
                    ? 'You’ve pending requests. Click to check requests'
                    : 'You’ve a pending request. Click to check request'}
                </BoldText>
              </View>
            </Pressable>
          )}
          <ImageBackground
            source={require('../../../assets/images/cardBg.png')}
            resizeMode="contain"
            style={{
              ...styles.card,
              height: requests.length ? 150 : 200,
              marginTop: requests.length ? 20 : 30,
            }}>
            <View style={styles.cardHeader}>
              <View style={styles.amountContainer}>
                <View style={styles.symbolContainer}>
                  <Text style={styles.symbol}>{selectedCurrency.symbol}</Text>
                </View>
                <View>
                  <WalletAmount
                    showAmount={showAmount}
                    setShowAmount={setShowAmount}
                  />
                  <View style={styles.flagContainer}>
                    <RegularText style={styles.currrencyType}>
                      {selectedCurrency.acronym}
                    </RegularText>
                    <FlagSelect country={selectedCurrency.currency} />
                  </View>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  setWalletRefresh(prev => !prev);
                  setModalOpen(true);
                }}
                style={styles.chevronDown}>
                <ChevronDown />
              </Pressable>
            </View>

            <View style={styles.cardHeader}>
              <Pressable
                style={styles.cardDetails}
                onPress={() => navigation.navigate('AccountDetails')}>
                <Wallet />
                <RegularText style={styles.currrencyType}>
                  Account Details
                </RegularText>
              </Pressable>
              <Pressable
                style={styles.cardDetails}
                onPress={() =>
                  navigation.navigate('SendMoneyNavigatorFromHome')
                }>
                <UpAndDownArrow />
                <RegularText style={styles.currrencyType}>
                  Send Money
                </RegularText>
              </Pressable>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.body}>
          <RegularText style={styles.historyText}>History</RegularText>
          {transactionHistory.length > 0 ? (
            typeof transactionHistory === 'string' ? (
              <View style={styles.historyEmpty}>
                <BoldText style={styles.historyEmptyText}>
                  {transactionHistory}
                </BoldText>
              </View>
            ) : (
              <ScrollView
                style={styles.histories}
                onScroll={() => {
                  setTimeout(() => {
                    setNoReload(false);
                  }, 2000);
                  return setNoReload(true);
                }}>
                {transactionHistory.map(history => (
                  <History
                    key={history.id}
                    history={history}
                    navigation={navigation}
                    showAmount={showAmount}
                  />
                ))}
              </ScrollView>
            )
          ) : (
            <View style={styles.historyEmpty}>
              <BoldText style={styles.historyEmptyText}>
                Your transaction histories will appear here
              </BoldText>
            </View>
          )}
        </View>
      </PageContainer>
      <SelectCurrencyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 300,
    paddingHorizontal: 3 + '%',
  },
  bgContainer: {
    flex: 1,
    transform: [
      { rotateZ: '-60deg' },
      { scale: 0.9 },
      { translateX: -220 },
      { translateY: -180 },
    ],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  userImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  request: {
    backgroundColor: '#1e1e1e',
    width: 106 + '%',
    marginLeft: -3 + '%',
    padding: 15,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestBell: {
    flexDirection: 'row',
  },
  requestText: {
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  card: {
    backgroundColor: '#000',
    height: 200,
    marginVertical: 30,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  symbolContainer: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  symbol: {
    fontSize: 28,
    fontFamily: 'AlfaSlabOne-Regular',
    transform: [{ translateY: -3.5 }, { translateX: -0.5 }],
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: -5,
  },
  currrencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
  },
  chevronDown: {},
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    paddingLeft: 3 + '%',
    fontSize: 18,
  },
  body: {
    flex: 1,
  },
  histories: {
    flex: 1,
    backgroundColor: '#eee',
    borderColor: '#0e153a',
    borderWidth: 0.5,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  historyEmpty: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15 + '%',
  },
  historyEmptyText: {
    textAlign: 'center',
  },
  history: {
    paddingHorizontal: 2.5 + '%',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0e153a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyIcon: {
    alignItems: 'center',
    justifyContent: 'center',
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
  historyTitle: {
    flex: 1,
  },
  transactionAmountTextRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  transactionAmountTextColumn: {
    alignItems: 'center',
  },
  transactionAmountText: {
    fontSize: 20,
  },
  creditAmount: {
    color: '#006E53',
  },
  debitAmount: {
    color: 'red',
  },
  swapIcon: {
    transform: [{ rotateZ: '90deg' }],
  },
  swap: {},
});
export default Home;

const History = ({ history, navigation, showAmount }) => {
  const { vw } = useContext(AppContext);
  const [transactionTypeIcon, setTransactionTypeIcon] = useState('');
  const [transactionTypeTitle, setTransactionTypeTitle] = useState('');
  const [transactionDate, setTransactionDate] = useState('');

  const {
    amount,
    createdAt,
    currency,
    transactionType,
    swapFrom,
    swapTo,
    swapFromAmount,
    swapToAmount,
  } = history;

  useEffect(() => {
    const date = new Date(createdAt);

    setTransactionDate(
      `${date.toDateString()} ${
        date.getHours().toString().length === 1
          ? '0' + date.getHours()
          : date.getHours()
      }:${
        date.getMinutes().toString().length === 1
          ? '0' + date.getMinutes()
          : date.getMinutes()
      }`,
    );

    switch (transactionType?.toLowerCase()) {
      case 'credit':
        setTransactionTypeIcon(<FaIcon name="download" size={18} />);
        setTransactionTypeTitle('Received');
        break;
      case 'debit':
        setTransactionTypeIcon(<FaIcon name="send" size={18} />);
        setTransactionTypeTitle('Sent Out');
        break;
      case 'swap':
        setTransactionTypeIcon(<SwapIcon width={22} height={22} />);
        setTransactionTypeTitle('Swap Fund');
        break;
      default:
        setTransactionTypeIcon();
        break;
    }
  }, [createdAt, transactionType]);

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
      <View style={styles.historyIcon}>
        {transactionType === 'swap' ? (
          <View style={styles.historyIconText}>{transactionTypeIcon}</View>
        ) : (
          <Text style={styles.historyIconText}>{transactionTypeIcon}</Text>
        )}
      </View>
      <View style={styles.historyTitle}>
        <BoldText>{transactionTypeTitle}</BoldText>
        <RegularText>{transactionDate}</RegularText>
      </View>
      {showAmount ? (
        <View>
          {transactionType?.toLowerCase() === 'credit' && (
            <BoldText
              style={{
                ...styles.transactionAmountText,
                ...styles.creditAmount,
              }}>
              {`+ ${currencySymbol}${addingDecimal(
                Number(amount).toLocaleString(),
              )}`}
            </BoldText>
          )}
          {transactionType?.toLowerCase() === 'debit' && (
            <BoldText
              style={{
                ...styles.transactionAmountText,
                ...styles.debitAmount,
              }}>
              {`- ${currencySymbol}${addingDecimal(
                Number(amount).toLocaleString(),
              )}`}
            </BoldText>
          )}
          {transactionType === 'swap' && (
            <View
              style={
                vw > 360
                  ? styles.transactionAmountTextRow
                  : styles.transactionAmountTextColumn
              }>
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
                width={17}
                height={17}
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
          )}
        </View>
      ) : (
        <BoldText>****</BoldText>
      )}
    </Pressable>
  );
};
