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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="LoopayTag"
          component={LoopayTag}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="AccountDetails"
          component={AccountDetails}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />

        <Stack.Screen
          name="AddMoneyFromHome"
          component={AddMoney}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="SwapFunds"
          component={SwapFunds}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddMoneyConfirm"
          component={AddMoneyConfirm}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="AddMoneyDetails"
          component={AddMoneyDetails}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="AddNewCard"
          component={AddNewCard}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="SendMoneyNavigatorFromHome"
          component={SendMoneyNavigator}
        />
        <Stack.Screen name="SwapFundsFromHome" component={SwapFunds} />
        <Stack.Screen
          name="BuyAirtime"
          component={BuyAirtime}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="BuyData"
          component={BuyData}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="RequestFund"
          component={RequestFund}
          options={({ navigation, route }) => ({
            ...screenHeader(navigation, route),
            animation: 'none',
          })}
        />
        <Stack.Screen
          name="RequestConfirm"
          component={RequestConfirm}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen name="RequestSuccess" component={RequestSuccess} />
        <Stack.Screen
          name="TransferAirtime"
          component={TransferAirtime}
          options={{
            animation: 'none',
          }}
        />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="TransactionHistoryDetails"
          component={TransactionHistoryParams}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="PendingRequest"
          component={PendingRequest}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="PendingRequestConfirm"
          component={PendingRequestConfirm}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen name="RequestStatus" component={RequestStatus} />
        <Stack.Screen
          name="Biometric"
          component={Biometric}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="SendLoopay"
          component={SendLoopay}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="Withdraw"
          component={Withdraw}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="PayABill"
          component={PayABill}
          options={({ navigation, route }) => screenHeader(navigation, route)}
        />
        <Stack.Screen
          name="TransactionPin"
          component={TransactionPin}
          options={{
            animation: 'none',
          }}
        />
      </Stack.Navigator>
    </NotificationsContextComponent>
  );
};

export default HomeNavigator;
