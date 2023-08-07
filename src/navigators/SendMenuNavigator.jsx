import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddMoney from '../pages/SendMenuPages/AddMoney';
import SendMenu from '../pages/BottomTabPages/SendMenu';
import SwapFunds from '../pages/SendMenuPages/SwapFunds';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';
import AccInfo from '../pages/SendMenuPages/AccInfo';
import AccStatement from '../pages/SendMenuPages/AccStatement';
import SendMenuHeader from '../pages/SendMenuPages/Header';
import AddMoneyConfirm from '../pages/SendMenuPages/AddMoneyConfirm';
import BuyAirtime from '../pages/SendMenuPages/AirtimeTopUp/BuyAirtime';
import PayABill from '../pages/SendMenuPages/PayABill';
import BillTv from '../pages/SendMenuPages/BillTv';
import AirtimeTopUp from '../pages/SendMenuPages/AirtimeTopUp';
import BuyData from '../pages/SendMenuPages/AirtimeTopUp/BuyData';
import Success from '../pages/SendMenuPages/Success';
import SendMoneyNavigator from './SendMoneyNavigator';
import TransferFunds from '../pages/SendMenuPages/SendMoney/TransferFunds';

const SendMenuNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <SendMenuHeader goBack={navigation.goBack} route={route} />
        ),
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
      <Stack.Screen
        name="SendMoneyNavigator"
        component={SendMoneyNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TransferFunds"
        component={TransferFunds}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="SwapFunds" component={SwapFunds} />
      <Stack.Screen name="AirtimeTopup" component={AirtimeTopUp} />
      <Stack.Screen name="BuyAirtime" component={BuyAirtime} />
      <Stack.Screen name="BuyData" component={BuyData} />
      <Stack.Screen name="AirtimeHistory" component={AccStatement} />
      <Stack.Screen name="PayABill" component={PayABill} />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="billTV" component={BillTv} />
      <Stack.Screen name="billinternet" component={PayABill} />
      <Stack.Screen name="billschool" component={PayABill} />
      <Stack.Screen name="billelectricity" component={PayABill} />
      <Stack.Screen name="AccStatement" component={AccStatement} />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SendMenuNavigator;
