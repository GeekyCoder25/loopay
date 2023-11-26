import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Back from '../components/Back';
import AirtimeTopUp from '../pages/SendMenuPages/AirtimeTopUp';
import BuyAirtime from '../pages/SendMenuPages/AirtimeTopUp/BuyAirtime';
import BuyData from '../pages/SendMenuPages/AirtimeTopUp/BuyData';
import TransferAirtime from '../pages/SendMenuPages/AirtimeTopUp/TransferAirtime';
import AccStatement from '../pages/SendMenuPages/AccStatement';
import AirtimeTopUpInternational from '../pages/SendMenuPages/AirtimeTopUp/AirtimeTopUpInternational';

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
        name="AirtimeTopUpInternational"
        component={AirtimeTopUpInternational}
      />
      <Stack.Screen
        name="TransferAirtime"
        component={TransferAirtime}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="AirtimeHistory" component={AccStatement} />
    </Stack.Navigator>
  );
};

export default AirtimeTopUpNavigator;
