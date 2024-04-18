/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Reports from './Reports';
import TransactionHistoryParams from '../../MenuPages/TransactionHistoryParams';
import Back from '../../../components/Back';

const ReportNavigator = () => {
  const Stack = createNativeStackNavigator();

  const BackHeader = (navigation, route) => {
    const previousScreen = route?.params?.previousScreen;
    return {
      header: () => (
        <Back
          goBack={navigation.goBack}
          onPress={
            previousScreen ? () => navigation.navigate(previousScreen) : null
          }
          route={route}
        />
      ),
    };
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReportDashboard"
        component={Reports}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportIndex"
        component={TransactionHistoryParams}
        options={({ navigation, route }) => BackHeader(navigation, route)}
      />
    </Stack.Navigator>
  );
};

export default ReportNavigator;
