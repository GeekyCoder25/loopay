import { useCallback, useContext, useEffect, useState } from 'react';
import { apiUrl } from '../../utils/fetchAPI';
import AppPagesNavigator from '../navigators/AppPagesNavigator';
import NoInternet from './NoInternet';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { AppContext } from './AppContext';
import { View } from 'react-native';
import LockScreen from '../pages/GlobalPages/LockScreen';
import AppUpdateModal from './AppUpdateModal';
import Toast from 'react-native-toast-message';

const AppStart = () => {
  const {
    internetStatus,
    setInternetStatus,
    isLoggedIn,
    isSessionTimedOut,
    isUpdateAvailable,
    setIsUpdateAvailable,
  } = useContext(AppContext);
  const [showLockScreen, setShowLockScreen] = useState(false);

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
  }, [setInternetStatus]);

  useEffect(() => {
    if (isSessionTimedOut && isLoggedIn) {
      setTimeout(() => {
        setShowLockScreen(true);
      }, 1500);
    } else {
      setShowLockScreen(false);
    }
  }, [isLoggedIn, isSessionTimedOut]);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setIsUpdateAvailable(true);
          setTimeout(() => {
            Updates.reloadAsync();
            setIsUpdateAvailable(false);
          }, 2000);
        }
      } catch (e) {}
    };
    checkUpdate();
  }, [setIsUpdateAvailable]);

  const [fontsLoaded] = useFonts({
    'OpenSans-300': require('../../assets/fonts/OpenSans-Light.ttf'),
    'OpenSans-400': require('../../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-500': require('../../assets/fonts/OpenSans-Medium.ttf'),
    'OpenSans-600': require('../../assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-700': require('../../assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-800': require('../../assets/fonts/OpenSans-ExtraBold.ttf'),
    'Karla-200': require('../../assets/fonts/Karla-ExtraLight.ttf'),
    'Karla-300': require('../../assets/fonts/Karla-Light.ttf'),
    'Karla-400': require('../../assets/fonts/Karla-Regular.ttf'),
    'Karla-500': require('../../assets/fonts/Karla-Medium.ttf'),
    'Karla-600': require('../../assets/fonts/Karla-SemiBold.ttf'),
    'Karla-700': require('../../assets/fonts/Karla-Bold.ttf'),
    'Karla-800': require('../../assets/fonts/Karla-ExtraBold.ttf'),
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
      {/* {showLockScreen && <LockScreen />} */}
      {isUpdateAvailable && <AppUpdateModal />}
      <NoInternet modalOpen={!internetStatus} />
      <Toast />
    </>
  );
};

export default AppStart;
