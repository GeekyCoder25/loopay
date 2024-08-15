import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { AppContext } from './src/components/AppContext';
import { useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { allCurrencies } from './src/database/data';
import AppStart from './src/components/AppStart';
import LoadingModal from './src/components/LoadingModal';
import {
  getCurrencyCode,
  getDefaultCurrency,
  getShake,
  getShowBalance,
} from './utils/storage';
import { RootSiblingParent } from 'react-native-root-siblings';
import FaIcon from '@expo/vector-icons/FontAwesome';
import BoldText from './src/components/fonts/BoldText';
import { timeForInactivityInSecond } from './src/config/config';
import { CurrencyFullDetails } from './utils/allCountries';
import * as LocalAuthentication from 'expo-local-authentication';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState(
    allCurrencies.find(currency => currency.currency === 'dollar'),
  );
  const [verified, setVerified] = useState(false);
  const [showTabBar, setShowTabBar] = useState(true);
  const [internetStatus, setInternetStatus] = useState('true');
  const [isChecking, setIsChecking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appData, setAppData] = useState({ pin: false });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModalBg, setLoadingModalBg] = useState(null);
  const [walletRefresh, setWalletRefresh] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canChangeRole, setCanChangeRole] = useState(false);
  const [noReload, setNoReload] = useState(false);
  const [isSessionTimedOut, setIsSessionTimedOut] = useState(true);
  const [showConnected, setShowConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState({
    forLock: false,
    forPin: false,
  });
  const [enableShake, setEnableShake] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpClosed, setPopUpClosed] = useState(0);
  const [showAmount, setShowAmount] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [openShake, setOpenShake] = useState(false);
  const [hasFaceID, setHasFaceID] = useState(false);
  const [refetchTransactions, setRefetchTransactions] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const isAndroid = Platform.OS === 'android';
  const vw = Dimensions.get('screen').width;
  const vh = Dimensions.get('screen').height;
  const timerId = useRef(false);
  const timerIdTotal = useRef(false);

  const contextValue = {
    vw,
    vh,
    timerId,
    timerIdTotal,
    selectedCurrency,
    setSelectedCurrency,
    verified,
    setVerified,
    showTabBar,
    setShowTabBar,
    internetStatus,
    setInternetStatus,
    isChecking,
    setIsChecking,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    setIsLoading,
    appData,
    setAppData,
    loadingModalBg,
    setLoadingModalBg,
    walletRefresh,
    setWalletRefresh,
    isAdmin,
    setIsAdmin,
    canChangeRole,
    setCanChangeRole,
    noReload,
    setNoReload,
    isSessionTimedOut,
    setIsSessionTimedOut,
    showConnected,
    setShowConnected,
    refreshing,
    setRefreshing,
    isBiometricSupported,
    setIsBiometricSupported,
    enableBiometric,
    setEnableBiometric,
    enableShake,
    setEnableShake,
    showPopUp,
    setShowPopUp,
    showAmount,
    setShowAmount,
    popUpClosed,
    setPopUpClosed,
    isShaking,
    setIsShaking,
    openShake,
    setOpenShake,
    hasFaceID,
    setHasFaceID,
    refetchTransactions,
    setRefetchTransactions,
    isUpdateAvailable,
    setIsUpdateAvailable,
    isAndroid,
  };

  useEffect(() => {
    getCurrencyCode().then(currencyCode => {
      if (currencyCode) {
        const localCurrency = CurrencyFullDetails[currencyCode];
        const checkCurrency = allCurrencies.filter(
          index => index.acronym === currencyCode,
        );
        if (!checkCurrency.length && localCurrency && isLoggedIn) {
          allCurrencies.unshift({
            currency: localCurrency.name.split(' ').pop().toLowerCase(),
            fullName: localCurrency.name,
            acronym: localCurrency.code,
            symbol: localCurrency.symbol_native,
            minimumAmountToAdd: 1,
            isLocal: true,
          });
        }
      }
    });
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      getDefaultCurrency().then(defaultCurrency => {
        if (!defaultCurrency) {
          return setSelectedCurrency(
            allCurrencies.find(currency => currency.isLocal),
          );
        }
        const defaultCurrencyObject = allCurrencies.find(
          currency => currency.currency === defaultCurrency,
        );
        setSelectedCurrency(defaultCurrencyObject);
      });
      getShowBalance().then(result => setShowAmount(result));
      getShake().then(result => setEnableShake(result));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    isLoggedIn &&
      appData.popUps?.length &&
      popUpClosed < 3 &&
      setShowPopUp(true);
  }, [appData.popUps?.length, isLoggedIn, popUpClosed]);

  useEffect(() => {
    LocalAuthentication.supportedAuthenticationTypesAsync().then(result =>
      setHasFaceID(result[0] === 2),
    );
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
      },
    }),
  ).current;

  const resetInactivityTimeout = () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      setIsSessionTimedOut(true);
    }, timeForInactivityInSecond * 1000);
  };

  useEffect(() => {
    if (isLoggedIn) {
      clearTimeout(timerIdTotal.current);
      timerIdTotal.current = setTimeout(() => {
        setIsSessionTimedOut(true);
      }, 1200 * 1000);
    }
  }, [isLoggedIn, isSessionTimedOut]);

  // const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <AppContext.Provider value={contextValue}>
      <StatusBar style="auto" translucent={false} backgroundColor="#f5f5f5" />
      <RootSiblingParent>
        <SafeAreaView
          style={
            Platform.OS === 'web' ? styles.webContainer : styles.appContainer
          }
          {...panResponder.panHandlers}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
            touchSoundDisabled={true}>
            {/* <Container
              style={styles.appContainer}
              behavior={'padding'}
              keyboardVerticalOffset={0}> */}
            <>
              {showConnected && (
                <View style={styles.connected}>
                  <FaIcon name="wifi" color="#fff" size={20} />
                  <BoldText style={styles.connectedText}>Connected</BoldText>
                </View>
              )}
              <AppStart />
            </>
            {/* </Container> */}
          </TouchableWithoutFeedback>
          <LoadingModal isLoading={isLoading} />
        </SafeAreaView>
      </RootSiblingParent>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    maxWidth: 800,
    marginHorizontal: 'auto',
  },
  connected: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    position: Platform.OS === 'android' ? 'absolute' : 'absolute',
    zIndex: 1,
    top: SafeAreaView.length ? SafeAreaView.length * 3 : 0,
    width: 100 + '%',
  },
  connectedText: { color: '#fff' },
});
