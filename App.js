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

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [verified, setVerified] = useState(false);
  const [showTabBar, setShowTabBar] = useState(true);
  const [internetStatus, setInternetStatus] = useState('true');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appData, setAppData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const vw = useWindowDimensions().width;
  const vh = useWindowDimensions().height;

  const contextValue = {
    selectedCurrency,
    setSelectedCurrency,
    verified,
    vw,
    vh,
    showTabBar,
    setShowTabBar,
    internetStatus,
    setInternetStatus,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    setIsLoading,
    appData,
    setAppData,
  };
  const defaultCurrency = allCurrencies.find(
    currency => currency.currency === 'Naira',
  );
  useEffect(() => {
    setSelectedCurrency(defaultCurrency);
  }, [defaultCurrency]);

  return (
    <AppContext.Provider value={contextValue}>
      <StatusBar style="auto" translucent={false} backgroundColor="#fff" />
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
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});
