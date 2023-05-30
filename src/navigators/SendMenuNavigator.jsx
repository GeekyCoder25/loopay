import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import AddMoney from '../pages/SendMenuPages/AddMoney';
import SendMenu from '../pages/SendMenu';
import SwapFunds from '../pages/SendMenuPages/SwapFunds';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';
import SendGift from '../pages/SendMenuPages/SendGift';
import AccInfo from '../pages/SendMenuPages/AccInfo';
import AccStatement from '../pages/SendMenuPages/AccStatement';
import SendMenuHeader from '../pages/SendMenuPages/Header';
import AddMoneyConfirm from '../pages/SendMenuPages/AddMoneyConfirm';

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
      <Stack.Screen name="SwapFunds" component={SwapFunds} />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="SendGift" component={SendGift} />
      <Stack.Screen name="AccInfo" component={AccInfo} />
      <Stack.Screen name="AccStatement" component={AccStatement} />
    </Stack.Navigator>
  );
};

export default SendMenuNavigator;
