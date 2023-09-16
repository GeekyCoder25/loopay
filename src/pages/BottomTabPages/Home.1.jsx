import React, { useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Bell from '../../../assets/images/bell.svg';
import BellActive from '../../../assets/images/bellActive.svg';
import ChevronDown from '../../../assets/images/chevron-down.svg';
import Wallet from '../../../assets/images/wallet.svg';
import UpAndDownArrow from '../../../assets/images/up-down-arrow.svg';
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
import { useRequestFundsContext } from '../../context/RequestContext';
import { useWalletContext } from '../../context/WalletContext';
import { useNotificationsContext } from '../../context/NotificationContext';
import { Audio } from 'expo-av';
import { styles, History } from './Home';

export const Home = ({ navigation }) => {
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

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/notify.mp3'),
      );
      await sound.playAsync();
    };
    !requests.length && playSound();
  }, []);
  const refreshPage = () => {};

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
        </Pressable>
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
