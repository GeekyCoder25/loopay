import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from '../pages/BottomTabPages/Menu';
import ChangePassword from '../pages/MenuPages/ChangePassword';
import SendMenuHeader from '../pages/SendMenuPages/Header';
import MyInfo from '../pages/MenuPages/MyInfo';
import VerificationStatus from '../pages/MenuPages/VerificationStatus';
import TransactionHistory from '../pages/MenuPages/TransactionHistory';
import DevicesAndSessions from '../pages/MenuPages/DevicesAndSessions';
import TransactionPin from '../pages/MenuPages/TransactionPin';
import Referrals from '../pages/MenuPages/Referrals';
import Support from '../pages/MenuPages/Support';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';

const MenuNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerTitle: () => <SendMenuHeader {...navigation} route={route} />,
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      })}>
      <Stack.Screen
        name="SendMenu"
        component={Menu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="MyInfo" component={MyInfo} />
      <Stack.Screen name="VerificationStatus" component={VerificationStatus} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="DevicesAndSessions" component={DevicesAndSessions} />
      <Stack.Screen name="TransactionPin" component={TransactionPin} />
      <Stack.Screen name="Referrals" component={Referrals} />
      <Stack.Screen name="Support" component={Support} />
    </Stack.Navigator>
  );
};

export default MenuNavigator;
