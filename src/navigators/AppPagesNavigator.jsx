import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../src/components/Splash';
import Signup from '../../src/pages/Auth/Signup';
import Signin from '../../src/pages/Auth/Signin';
import AccountType from '../../src/pages/Auth/AccountType';
import ForgotPassword from '../../src/pages/Auth/ForgotPassword';
import BottomTabs from '../../src/navigators/BottomTabs';

const AppPagesNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="ADD" component={VirtualCard} /> */}
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="AccountType" component={AccountType} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppPagesNavigator;
