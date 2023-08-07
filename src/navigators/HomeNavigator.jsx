import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../pages/BottomTabPages/Home';
import SendMenuHeader from '../pages/SendMenuPages/Header';
import Profile from '../pages/HomePages/Profile';
import LoopayTag from '../pages/HomePages/LoopayTag';
import SendMoneyNavigator from './SendMoneyNavigator';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  const screenHeader = (navigation, route) => {
    return {
      headerShown: true,
      header: () => <SendMenuHeader goBack={navigation.goBack} route={route} />,
    };
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Profile"
        component={Profile}
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
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
