import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Users from './Users';
import UserDetails from './UserDetails';
import UserTransaction from './UserTransaction';

const UsersNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Users} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="UserTransaction" component={UserTransaction} />
    </Stack.Navigator>
  );
};

export default UsersNavigator;
