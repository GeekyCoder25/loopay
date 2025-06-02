import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../src/components/Splash';
import SignUp from '../pages/Auth/Signup';
import SignIn from '../pages/Auth/Signin';
import AccountType from '../../src/pages/Auth/AccountType';
import ForgotPassword from '../../src/pages/Auth/ForgotPassword';
import { useContext, useState } from 'react';
import { AppContext } from '../components/AppContext';
import { getNotFirstTime } from '../../utils/storage';
import TransactionPin from '../pages/MenuPages/TransactionPin';
import AdminNavigator from './AdminNavigator';
import ChangePassword from '../pages/MenuPages/ChangePassword';
import Onboarding from '../pages/Auth/Onboarding';
import TabsNavigator from './TabsNavigator';
import VerificationNavigator from './VerificationNavigator';
import BusinessOnboarding from '../pages/Auth/BusinessOnboarding';

const AppPagesNavigator = () => {
  const { isLoggedIn, isAdmin, appData, verified } = useContext(AppContext);
  const [notFirstTime, setNotFirstTime] = useState(false);

  const Stack = createNativeStackNavigator();

  getNotFirstTime().then(result => setNotFirstTime(result));
  const hasSetPin = appData.pin ? JSON.parse(appData.pin) : false;

  const isVerified = verified === 'verified' || verified === 'pending';
  return (
    <NavigationContainer
      navigationInChildEnabled
      theme={{ ...DefaultTheme, colors: { background: '#fff', text: '#000' } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        {!isVerified && (
          <Stack.Screen
            name="FirstTimeVerifications"
            component={VerificationNavigator}
          />
        )}
        {!isLoggedIn ? (
          <Stack.Group>
            {notFirstTime ? (
              <>
                <Stack.Screen name="FirstPage" component={SignIn} />
              </>
            ) : (
              <>
                <Stack.Screen name="FirstPage" component={Onboarding} />
              </>
            )}
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            {!appData.accountType ? (
              <Stack.Screen name="FirstPage" component={AccountType} />
            ) : !hasSetPin ? (
              <Stack.Screen name="FirstPage" component={TransactionPin} />
            ) : isAdmin ? (
              <Stack.Screen name="FirstPage" component={AdminNavigator} />
            ) : (
              <Stack.Screen name="FirstPage" component={TabsNavigator} />
            )}
            <Stack.Screen
              name="BusinessOnboarding"
              component={BusinessOnboarding}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppPagesNavigator;
