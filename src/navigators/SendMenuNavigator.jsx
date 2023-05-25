import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddMoney from '../pages/SendMenuPages/AddMoney';
import SendMenu from '../pages/SendMenu';
import SwapFunds from '../pages/SendMenuPages/SwapFunds';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';
import SendGift from '../pages/SendMenuPages/SendGift';
import AccInfo from '../pages/SendMenuPages/AccInfo';
import AccStatement from '../pages/SendMenuPages/AccStatement';

const SendMenuNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerTitle: 'Back' }}>
      <Stack.Screen
        name="SendMenu"
        component={SendMenu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="AddMoney" component={AddMoney} />
      <Stack.Screen name="SwapFunds" component={SwapFunds} />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="SendGift" component={SendGift} />
      <Stack.Screen name="AccInfo" component={AccInfo} />
      <Stack.Screen name="AccStatement" component={AccStatement} />
    </Stack.Navigator>
  );
};

export default SendMenuNavigator;
