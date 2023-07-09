import { useCallback, useContext, useEffect, useState } from 'react';
import { apiUrl } from '../../utils/fetchAPI';
import AppPagesNavigator from '../navigators/AppPagesNavigator';
import NoInternet from './NoInternet';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AppContext } from './AppContext';
import { View } from 'react-native';

const AppStart = () => {
  const { internetStatus, setInternetStatus } = useContext(AppContext);

  useEffect(() => {
    const getFetchData = async () => {
      const API_URL = `${apiUrl}/network`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await response.json();
        return data;
      } catch (err) {
        return "Couldn't connect to server";
      }
    };
    getFetchData().then(data => {
      setInternetStatus(data.network || false);
    });
  }, [internetStatus, setInternetStatus]);

  const [fontsLoaded] = useFonts({
    'OpenSans-300': require('../../assets/fonts/OpenSans-Light.ttf'),
    'OpenSans-400': require('../../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-500': require('../../assets/fonts/OpenSans-Medium.ttf'),
    'OpenSans-600': require('../../assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-700': require('../../assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-800': require('../../assets/fonts/OpenSans-ExtraBold.ttf'),
    'AlfaSlabOne-Regular': require('../../assets/fonts/AlfaSlabOne.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && (internetStatus === true || internetStatus === 'true')) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, internetStatus]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View onLayout={onLayoutRootView} />
      <AppPagesNavigator />
      <NoInternet modalOpen={!internetStatus} />
    </>
  );
};

export default AppStart;
