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

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  const screenHeader = (navigation, route) => {
    return {
      headerShown: true,
      header: () => <Back goBack={navigation.goBack} route={route} />,
    };
  };

  return (
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
        name="SendMoneyNavigatorFromHome"
        component={SendMoneyNavigator}
      />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen
        name="TransactionHistoryDetails"
        component={TransactionHistoryParams}
        options={({ navigation, route }) => screenHeader(navigation, route)}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
