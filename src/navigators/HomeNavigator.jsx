/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../pages/BottomTabPages/Home';
import Back from '../components/Back';
import LoopayTag from '../pages/HomePages/LoopayTag';
import SendMoneyNavigator from './SendMoneyNavigator';
import Notification from '../pages/HomePages/Notification';
import ProfileNavigator from './ProfileNavigator';
import Success from '../pages/SendMenuPages/Success';
import TransactionHistoryParams from '../pages/MenuPages/TransactionHistoryParams';
import PendingRequest from '../pages/SendMenuPages/RequestFunds/PendingRequest';
import PendingRequestConfirm from '../pages/SendMenuPages/RequestFunds/PendingRequestConfirm';
import RequestStatus from '../pages/SendMenuPages/RequestFunds/RequestStatus';
import AccountDetails from '../pages/HomePages/AccountDetails';
import NotificationsContextComponent from '../context/NotificationContext';
import SwapFunds from '../pages/SendMenuPages/SwapFunds';
import RequestFund from '../pages/SendMenuPages/RequestFund';
import BuyData from '../pages/SendMenuPages/AirtimeTopUp/BuyData';
import BuyAirtime from '../pages/SendMenuPages/AirtimeTopUp/BuyAirtime';
import TransferAirtime from '../pages/SendMenuPages/AirtimeTopUp/TransferAirtime';
import TransactionHistory from '../pages/MenuPages/TransactionHistory';
import RequestConfirm from '../pages/SendMenuPages/RequestFunds/RequestConfirm';
import RequestSuccess from '../pages/SendMenuPages/RequestFunds/RequestSuccess';
import AddMoney from '../pages/SendMenuPages/AddMoney';
import AddMoneyConfirm from '../pages/SendMenuPages/AddMoney/AddMoneyConfirm';
import AddNewCard from '../pages/SendMenuPages/AddMoney/AddNewCard';
import Biometric from '../pages/HomePages/Biometric';
import TransactionPin from '../pages/MenuPages/TransactionPin';
import AddMoneyDetails from '../pages/SendMenuPages/AddMoney/AddMoneyDetails';
import SendLoopay from '../pages/SendMenuPages/SendMoney/SendLoopay';
import PayABill from '../pages/SendMenuPages/PayABill/PayABill';
import Withdraw from '../pages/HomePages/Withdraw';
import AirtimeTopUpNavigator from './AirtimeTopUpNavigator';
import PayABillParams from '../pages/SendMenuPages/PayABill/PayABillParams';
import TransferBill from '../pages/SendMenuPages/PayABill/TransferBill';
import TransferFunds from '../pages/SendMenuPages/SendMoney/TransferFunds';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  const screenHeader = (navigation, route) => {
    return {
      headerShown: true,
      header: () => <Back goBack={navigation.goBack} route={route} />,
    };
  };

  return (
    <NotificationsContextComponent>
      <Stack.Navigator
        screenOptions={({ navigation, route }) =>
          screenHeader(navigation, route)
        }>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileNavigator"
          component={ProfileNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="LoopayTag" component={LoopayTag} />
        <Stack.Screen name="AccountDetails" component={AccountDetails} />
        <Stack.Screen name="AddMoneyFromHome" component={AddMoney} />
        <Stack.Screen
          name="SwapFunds"
          component={SwapFunds}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddMoneyConfirm" component={AddMoneyConfirm} />
        <Stack.Screen name="AddMoneyDetails" component={AddMoneyDetails} />
        <Stack.Screen name="AddNewCard" component={AddNewCard} />
        <Stack.Screen
          name="SendMoneyNavigatorFromHome"
          component={SendMoneyNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SwapFundsFromHome" component={SwapFunds} />
        <Stack.Screen
          name="AirtimeTopUpNavigator"
          component={AirtimeTopUpNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BuyAirtime" component={BuyAirtime} />
        <Stack.Screen name="BuyData" component={BuyData} />
        <Stack.Screen
          name="RequestFund"
          component={RequestFund}
          options={({ navigation, route }) => ({
            ...screenHeader(navigation, route),
            animation: 'none',
          })}
        />
        <Stack.Screen name="RequestConfirm" component={RequestConfirm} />
        <Stack.Screen name="RequestSuccess" component={RequestSuccess} />
        <Stack.Screen
          name="TransferAirtime"
          component={TransferAirtime}
          options={{
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="Success"
          component={Success}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
        />
        <Stack.Screen
          name="TransactionHistoryDetails"
          component={TransactionHistoryParams}
        />
        <Stack.Screen name="PendingRequest" component={PendingRequest} />
        <Stack.Screen
          name="PendingRequestConfirm"
          component={PendingRequestConfirm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RequestStatus"
          component={RequestStatus}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Biometric" component={Biometric} />
        <Stack.Screen name="SendLoopay" component={SendLoopay} />
        <Stack.Screen name="Withdraw" component={Withdraw} />
        <Stack.Screen name="PayABill" component={PayABill} />
        <Stack.Screen
          name="TransactionPin"
          component={TransactionPin}
          options={{
            animation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen name="PayABillParams" component={PayABillParams} />
        <Stack.Screen
          name="TransferFunds"
          component={TransferFunds}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransferBill"
          component={TransferBill}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
      </Stack.Navigator>
    </NotificationsContextComponent>
  );
};

export default HomeNavigator;
