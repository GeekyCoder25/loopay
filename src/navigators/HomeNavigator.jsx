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
          name="SendMoneyNavigatorFromHome"
          component={SendMoneyNavigator}
        />
        <Stack.Screen name="Success" component={Success} />
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
      </Stack.Navigator>
    </NotificationsContextComponent>
  );
};

export default HomeNavigator;
