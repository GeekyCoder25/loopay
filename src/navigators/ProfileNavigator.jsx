/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SendMenuHeader from '../pages/SendMenuPages/Header';
import Profile from '../pages/HomePages/Profile';
import ChangePassword from '../pages/MenuPages/ChangePassword';
import TransactionPin from '../pages/MenuPages/TransactionPin';
import MyInfo from '../pages/MenuPages/MyInfo';
import Questions from '../pages/HomePages/Questions';
import Limit from '../pages/HomePages/Limit';
import Withdraw from '../pages/HomePages/Withdraw';
import AddWithdraw from '../pages/HomePages/AddWithdraw';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <SendMenuHeader goBack={navigation.goBack} route={route} />
        ),
      })}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Withdraw" component={Withdraw} />
      <Stack.Screen name="Password" component={ChangePassword} />
      <Stack.Screen name="Pin" component={TransactionPin} />
      <Stack.Screen name="Limit" component={Limit} />
      <Stack.Screen name="Questions" component={Questions} />
      <Stack.Screen name="Myinfo" component={MyInfo} />
      {/* <Stack.Screen name="Biometric" component={MyInfo} /> */}
      <Stack.Screen name="AddWithdraw" component={AddWithdraw} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
