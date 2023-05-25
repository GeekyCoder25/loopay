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
import Splash from './src/components/Splash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './src/pages/Auth/Signup';
import Signin from './src/pages/Auth/Signin';
import AccountType from './src/pages/Auth/AccountType';
import ForgotPassword from './src/pages/Auth/ForgotPassword';
import BottomTabs from './src/navigators/BottomTabs';
import { AppContext } from './src/components/AppContext';
import { useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [selectedCurrency, setSelectedCurrency] = useState('Dollar');
  const [verified, setVerified] = useState(false);
  const vw = useWindowDimensions().width;
  const vh = useWindowDimensions().height;

  const contextValue = {
    selectedCurrency,
    setSelectedCurrency,
    verified,
    vw,
    vh,
  };
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
      <StatusBar style="auto" />
      <SafeAreaView style={styles.appContainer} onLayout={onLayoutRootView}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          touchSoundDisabled={true}>
          <View style={styles.appContainer}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Signin" component={Signin} />
                <Stack.Screen name="AccountType" component={AccountType} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
                <Stack.Screen name="BottomTabs" component={BottomTabs} />
              </Stack.Navigator>
            </NavigationContainer>
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
