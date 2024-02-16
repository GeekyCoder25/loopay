import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddMoney from '../pages/SendMenuPages/AddMoney';
import SendMenu from '../pages/BottomTabPages/SendMenu';
import SwapFunds from '../pages/SendMenuPages/SwapFunds';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';
import AccStatement from '../pages/SendMenuPages/AccStatement';
import Back from '../components/Back';
import AddMoneyConfirm from '../pages/SendMenuPages/AddMoney/AddMoneyConfirm';
import PayABill from '../pages/SendMenuPages/PayABill/PayABill';
import PayABillParams from '../pages/SendMenuPages/PayABill/PayABillParams';
import Success from '../pages/SendMenuPages/Success';
import SendMoneyNavigator from './SendMoneyNavigator';
import TransferFunds from '../pages/SendMenuPages/SendMoney/TransferFunds';
import VirtualCardDetails from '../pages/SendMenuPages/VirtualCardDetails';
import TransactionPin from '../pages/MenuPages/TransactionPin';
import RequestFund from '../pages/SendMenuPages/RequestFund';
import RequestConfirm from '../pages/SendMenuPages/RequestFunds/RequestConfirm';
import RequestSuccess from '../pages/SendMenuPages/RequestFunds/RequestSuccess';
import AddNewCard from '../pages/SendMenuPages/AddMoney/AddNewCard';
import AirtimeTopUpNavigator from './AirtimeTopUpNavigator';
import TransferBill from '../pages/SendMenuPages/PayABill/TransferBill';

const SendMenuNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route }) => (
          <Back goBack={navigation.goBack} route={route} />
        ),
      }}>
      <Stack.Screen
        name="SendMenu"
        component={SendMenu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="AddMoney" component={AddMoney} />
      <Stack.Screen name="AddMoneyConfirm" component={AddMoneyConfirm} />
      <Stack.Screen name="AddNewCard" component={AddNewCard} />
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
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SwapFunds"
        component={SwapFunds}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="RequestFund" component={RequestFund} />
      <Stack.Screen
        name="RequestConfirm"
        component={RequestConfirm}
        options={{
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="RequestSuccess"
        component={RequestSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AirtimeTopUpNavigator"
        component={AirtimeTopUpNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PayABill" component={PayABill} />
      <Stack.Screen
        name="TransferBill"
        component={TransferBill}
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="VirtualCardDetails" component={VirtualCardDetails} />
      <Stack.Screen name="PayABillParams" component={PayABillParams} />
      <Stack.Screen name="AccStatement" component={AccStatement} />
      <Stack.Screen
        name="TransactionPin"
        component={TransactionPin}
        options={{
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
};

export default SendMenuNavigator;
