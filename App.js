import { StatusBar } from 'expo-status-bar';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Splash from './src/components/Splash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './src/pages/Auth/Signup';
import Signin from './src/pages/Auth/Signin';
import AccountType from './src/pages/AccountType';
import ForgotPassword from './src/pages/ForgotPassword';
import Home from './src/pages/Home';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.appContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            console.log('swdl');
            Keyboard.dismiss();
          }}
          touchSoundDisabled={true}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={Splash} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Signin" component={Signin} />
              <Stack.Screen name="AccountType" component={AccountType} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
          </NavigationContainer>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});
