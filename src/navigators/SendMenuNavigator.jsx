import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddMoney from '../pages/SendMenuPages/AddMoney';
import SendMenu from '../pages/BottomTabPages/SendMenu';
import SwapFunds from '../pages/SendMenuPages/SwapFunds';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';
import AccInfo from '../pages/SendMenuPages/AccInfo';
import AccStatement from '../pages/SendMenuPages/AccStatement';
import SendMenuHeader from '../pages/SendMenuPages/Header';
import AddMoneyConfirm from '../pages/SendMenuPages/AddMoneyConfirm';
import SendMoney from '../pages/SendMenuPages/SendMoney';
import BuyAirtime from '../pages/SendMenuPages/BuyAirtime';
import PayABill from '../pages/SendMenuPages/PayABill';
import BillTv from '../pages/SendMenuPages/BillTv';

const SendMenuNavigator = () => {
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
        component={SendMenu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="AddMoney" component={AddMoney} />
      <Stack.Screen name="AddMoneyConfirm" component={AddMoneyConfirm} />
      <Stack.Screen name="SendMoney" component={SendMoney} />
      <Stack.Screen name="SwapFunds" component={SwapFunds} />
      <Stack.Screen name="BuyAirtime" component={BuyAirtime} />
      <Stack.Screen name="PayABill" component={PayABill} />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="billTV" component={BillTv} />
      <Stack.Screen name="billinternet" component={PayABill} />
      <Stack.Screen name="billschool" component={PayABill} />
      <Stack.Screen name="billelectricity" component={PayABill} />
      <Stack.Screen name="AccStatement" component={AccStatement} />
    </Stack.Navigator>
  );
};

export default SendMenuNavigator;
