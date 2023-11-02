/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  Clipboard,
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
import UpAndDownArrowWhite from '../../../assets/images/left-right.svg';
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
import { Audio } from 'expo-av';
import Phone from '../../../assets/images/airtime.svg';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';

const Home = ({ navigation }) => {
  const {
    selectedCurrency,
    appData,
    setWalletRefresh,
    setNoReload,
    setShowTabBar,
  } = useContext(AppContext);
  const { transactions, wallet } = useWalletContext();
  const { requestFunds: requests } = useRequestFundsContext();
  const [modalOpen, setModalOpen] = useState(false);
  const fullName = appData.userProfile.fullName;
  const [showAmount, setShowAmount] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [requestsLength, setRequestsLength] = useState(0);
  const { unread } = useNotificationsContext();

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

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/notify.mp3'),
      );
      await sound.playAsync();
    };
    requests.length > requestsLength && playSound();
    setRequestsLength(requests.length);
  }, [requests.length, requestsLength]);

  const refreshPage = () => {};

  const quickLinks = [
    {
      routeName: 'Buy airtime',
      routeDetails: 'Send Funds to Family and Friends',
      routeIcon: <Phone />,
      routeNavigate: 'BuyAirtime',
    },
    {
      routeName: 'Buy data',
      routeDetails: 'Convert your USD to another currency',
      routeIcon: <FaIcon name="wifi" size={20} />,
      routeNavigate: 'BuyData',
    },
    {
      routeName: 'Request money',
      routeDetails: 'Buy airtime via VTU',
      routeIcon: <FaIcon name="code-fork" size={28} />,
      routeNavigate: 'RequestFund',
    },
  ];

  const handleCopy = () => {
    Clipboard.setString(wallet.loopayAccNo);
    ToastMessage('Copied to clipboard');
  };
  return (
    <>
      <PageContainer refreshFunc={refreshPage}>
        <Pressable
          style={styles.headerContainer}
          onPress={() => setNoReload(false)}>
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
                    ? `You’ve ${requests.length} pending requests. Click to check requests`
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
                    <RegularText style={styles.currencyType}>
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
                <RegularText style={styles.currencyType}>
                  Account Details
                </RegularText>
              </Pressable>
              <Pressable onPress={handleCopy} style={styles.cardDetails}>
                <FaIcon name="copy" color="#ccc" size={24} />
                <RegularText style={styles.currencyType}>
                  {wallet?.loopayAccNo}
                </RegularText>
              </Pressable>
            </View>
          </ImageBackground>
        </Pressable>
        <ScrollView
          style={styles.quickLinks}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <Pressable
            style={styles.quickLink}
            onPress={() => navigation.navigate('AddMoney')}>
            <FaIcon name="plus-circle" color={'#fff'} size={24} />
            <BoldText style={styles.quickLinkText}>Add money</BoldText>
          </Pressable>
          <Pressable
            style={styles.quickLink}
            onPress={() => navigation.navigate('SendMoneyNavigatorFromHome')}>
            <FaIcon name="send" color={'#fff'} size={14} />
            <BoldText style={styles.quickLinkText}>Send money</BoldText>
          </Pressable>
          <Pressable
            style={styles.quickLink}
            onPress={() => navigation.navigate('SwapFunds')}>
            <View style={styles.swapIcon}>
              <UpAndDownArrowWhite />
            </View>
            <BoldText style={styles.quickLinkText}>Swap funds</BoldText>
          </Pressable>
        </ScrollView>
        <BoldText style={styles.shortcutsHeader}>Shortcuts</BoldText>
        <View style={styles.shortcuts}>
          {quickLinks.map(link => (
            <Pressable
              onPress={() => {
                navigation.navigate(link.routeNavigate);
              }}
              style={styles.route}
              key={link.routeNavigate}>
              <View style={styles.routeIcon}>{link.routeIcon}</View>
              <View style={styles.routeText}>
                <BoldText>{link.routeName}</BoldText>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={styles.body}>
          <View style={styles.historyHeader}>
            <RegularText style={styles.historyText}>History</RegularText>
            {transactions.length > 3 && (
              <Pressable
                onPress={() => navigation.navigate('TransactionHistory')}>
                <RegularText>
                  See more <FaIcon name="chevron-right" color="#656565" />
                </RegularText>
              </Pressable>
            )}
          </View>
          {transactions.length > 0 ? (
            <ScrollView
              style={styles.histories}
              onScroll={() => {
                setTimeout(() => {
                  setNoReload(false);
                }, 2000);
                return setNoReload(true);
              }}>
              {transactions.slice(0, 3).map(history => (
                <History
                  key={history.id}
                  history={history}
                  navigation={navigation}
                  showAmount={showAmount}
                  setShowAmount={setShowAmount}
                />
              ))}
            </ScrollView>
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
  currencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
  },
  chevronDown: {},
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickLinks: {
    paddingLeft: 3 + '%',
    maxHeight: 60,
  },
  quickLink: {
    backgroundColor: '#1e1e1e',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 10,
  },
  quickLinkText: {
    color: '#fff',
  },
  shortcutsHeader: {
    marginVertical: 10,
    fontSize: 20,
    paddingLeft: 3 + '%',
  },
  shortcuts: {
    flexDirection: 'row',
    paddingHorizontal: 5 + '%',
    paddingBottom: 20,
    gap: 15,
  },

  route: {
    gap: 10,
    alignItems: 'center',
  },
  routeIcon: {
    borderColor: '#1e1e1e',
    borderWidth: 0.5,
    width: 50,
    height: 50,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 3 + '%',
    alignItems: 'flex-end',
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
    fontSize: 16,
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

const History = ({ history, navigation, showAmount, setShowAmount }) => {
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
    networkProvider,
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
        setTransactionTypeTitle('Credit Transfer');
        break;
      case 'debit':
        setTransactionTypeIcon(<FaIcon name="send" size={18} />);
        setTransactionTypeTitle('Debit Transfer');
        break;
      case 'swap':
        setTransactionTypeIcon(<SwapIcon width={22} height={22} />);
        setTransactionTypeTitle('Swap');
        break;
      case 'airtime':
        setTransactionTypeIcon(networkProvidersIcon(networkProvider));
        setTransactionTypeTitle('Airtime Purchase');
        break;
      case 'data':
        setTransactionTypeIcon(networkProvidersIcon(networkProvider));
        setTransactionTypeTitle('Data Purchase');
        break;
    }
  }, [createdAt, networkProvider, transactionType]);

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
          <View style={styles.historyIconText}>{transactionTypeIcon}</View>
        )}
      </View>
      <View style={styles.historyTitle}>
        <BoldText>{transactionTypeTitle}</BoldText>
        <RegularText>{transactionDate}</RegularText>
      </View>
      {showAmount ? (
        <View>
          {transactionType?.toLowerCase() === 'credit' && (
            <Pressable onPress={() => setShowAmount(false)}>
              <BoldText
                style={{
                  ...styles.transactionAmountText,
                  ...styles.creditAmount,
                }}>
                {`+ ${currencySymbol}${addingDecimal(
                  Number(amount).toLocaleString(),
                )}`}
              </BoldText>
            </Pressable>
          )}
          {(transactionType?.toLowerCase() === 'debit' ||
            transactionType?.toLowerCase() === 'airtime' ||
            transactionType?.toLowerCase() === 'data') && (
            <Pressable onPress={() => setShowAmount(false)}>
              <BoldText
                style={{
                  ...styles.transactionAmountText,
                  ...styles.debitAmount,
                }}>
                {`- ${currencySymbol}${addingDecimal(
                  Number(amount).toLocaleString(),
                )}`}
              </BoldText>
            </Pressable>
          )}
          {transactionType === 'swap' && (
            <Pressable
              style={
                vw > 360
                  ? styles.transactionAmountTextRow
                  : styles.transactionAmountTextColumn
              }
              onPress={() => setShowAmount(false)}>
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
            </Pressable>
          )}
        </View>
      ) : (
        <Pressable onPress={() => setShowAmount(true)}>
          <BoldText
            style={
              transactionType === 'credit' ? styles.creditAmount : undefined
            }>
            ***
          </BoldText>
        </Pressable>
      )}
    </Pressable>
  );
};
