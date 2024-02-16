import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import UserDetails from '../Users/UserDetails';
import Proofs from './Proofs';
import UserTransaction from '../Users/UserTransaction';

const ProofNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Proof" component={Proofs} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="UserTransaction" component={UserTransaction} />
    </Stack.Navigator>
  );
};

export default ProofNavigator;
