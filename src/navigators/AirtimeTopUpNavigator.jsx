import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Back from '../components/Back';
import AirtimeTopUp from '../pages/SendMenuPages/AirtimeTopUp';
import BuyAirtime from '../pages/SendMenuPages/AirtimeTopUp/BuyAirtime';
import BuyData from '../pages/SendMenuPages/AirtimeTopUp/BuyData';
import TransferAirtime from '../pages/SendMenuPages/AirtimeTopUp/TransferAirtime';
import AccStatement from '../pages/SendMenuPages/AccStatement';
import BuyAirtimeInternational from '../pages/SendMenuPages/AirtimeTopUp/BuyAirtimeInternational';
import TransactionPin from '../pages/MenuPages/TransactionPin';

const AirtimeTopUpNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route }) => (
          <Back goBack={navigation.goBack} route={route} />
        ),
      }}>
      <Stack.Screen name="AirtimeTopUp" component={AirtimeTopUp} />
      <Stack.Screen name="BuyAirtime" component={BuyAirtime} />
      <Stack.Screen name="BuyData" component={BuyData} />
      <Stack.Screen
        name="BuyAirtimeInternational"
        component={BuyAirtimeInternational}
      />
      <Stack.Screen
        name="TransferAirtime"
        component={TransferAirtime}
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="TransactionPin"
        component={TransactionPin}
        options={{
          animation: 'none',
        }}
      />
      <Stack.Screen name="AirtimeHistory" component={AccStatement} />
    </Stack.Navigator>
  );
};

export default AirtimeTopUpNavigator;
