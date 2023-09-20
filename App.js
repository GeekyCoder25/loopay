import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';

import { AppContext } from './src/components/AppContext';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { allCurrencies } from './src/database/data';
import AppStart from './src/components/AppStart';
import LoadingModal from './src/components/LoadingModal';
import { getDefaultCurrency } from './utils/storage';
import { RootSiblingParent } from 'react-native-root-siblings';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [verified, setVerified] = useState(false);
  const [showTabBar, setShowTabBar] = useState(true);
  const [internetStatus, setInternetStatus] = useState('true');
  const [isChecking, setIsChecking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appData, setAppData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModalBg, setLoadingModalBg] = useState(null);
  const [walletRefresh, setWalletRefresh] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canChangeRole, setCanChangeRole] = useState(false);
  const [noReload, setNoReload] = useState(false);
  const [isSessionTimedOut, setIsSessionTimedOut] = useState(true);
  const vw = useWindowDimensions().width;
  const vh = useWindowDimensions().height;

  const contextValue = {
    vw,
    vh,
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
  };

  useEffect(() => {
    getDefaultCurrency().then(defaultCurrency => {
      if (!defaultCurrency) {
        return setSelectedCurrency(
          allCurrencies.find(currency => currency.currency === 'naira'),
        );
      }
      const defaultCurrencyObject = allCurrencies.find(
        currency => currency.currency === defaultCurrency,
      );
      setSelectedCurrency(defaultCurrencyObject);
    });
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      <StatusBar style="auto" translucent={false} backgroundColor="#f5f5f5" />
      <RootSiblingParent>
        <SafeAreaView style={styles.appContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
            touchSoundDisabled={true}>
            <View style={styles.appContainer}>
              <AppStart />
              <LoadingModal isLoading={isLoading} />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </RootSiblingParent>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});
