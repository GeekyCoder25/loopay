import { StatusBar } from 'expo-status-bar';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { useFonts } from 'expo-font';

import { AppContext } from './src/components/AppContext';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { allCurrencies } from './src/database/data';
import AppPagesNavigator from './src/navigators/AppPagesNavigator';

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState('Dollar');
  const [verified, setVerified] = useState(false);
  const [showTabBar, setShowTabBar] = useState(true);
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
  };

  const defaultCurrency = allCurrencies.find(
    currency => currency.currency === 'Naira',
  );
  useEffect(() => {
    setSelectedCurrency(defaultCurrency);
  }, [defaultCurrency]);

  const [fontsLoaded] = useFonts({
    'OpenSans-300': require('./assets/fonts/OpenSans-Light.ttf'),
    'OpenSans-400': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-500': require('./assets/fonts/OpenSans-Medium.ttf'),
    'OpenSans-600': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-700': require('./assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-800': require('./assets/fonts/OpenSans-ExtraBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppContext.Provider value={contextValue}>
      <StatusBar style="auto" translucent={false} backgroundColor="#fff" />
      <SafeAreaView style={styles.appContainer} onLayout={onLayoutRootView}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          touchSoundDisabled={true}>
          <View style={styles.appContainer}>
            <AppPagesNavigator />
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
