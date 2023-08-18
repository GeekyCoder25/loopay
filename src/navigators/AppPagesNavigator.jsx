import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../src/components/Splash';
import Signup from '../../src/pages/Auth/Signup';
import Signin from '../../src/pages/Auth/Signin';
import AccountType from '../../src/pages/Auth/AccountType';
import ForgotPassword from '../../src/pages/Auth/ForgotPassword';
import BottomTabs from '../../src/navigators/BottomTabs';
import { useContext, useState } from 'react';
import { AppContext } from '../components/AppContext';
import { getNotFirstTime } from '../../utils/storage';

const AppPagesNavigator = () => {
  const { isLoggedIn, appData } = useContext(AppContext);
  const [notFirstTime, setNotFirstTime] = useState(false);
  const Stack = createNativeStackNavigator();

  getNotFirstTime().then(result => setNotFirstTime(result));

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Ssplash" component={BuyData} /> */}
        <Stack.Screen name="Splash" component={Splash} />
        {!isLoggedIn ? (
          <Stack.Group>
            {notFirstTime ? (
              <>
                <Stack.Screen name="FirstPage" component={Signin} />
              </>
            ) : (
              <>
                <Stack.Screen name="FirstPage" component={Signup} />
              </>
            )}
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="AccountType" component={AccountType} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            {!appData?.accountType || appData?.accountType === '' ? (
              <Stack.Screen name="FirstPage" component={AccountType} />
            ) : (
              <Stack.Screen name="FirstPage" component={BottomTabs} />
            )}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppPagesNavigator;
