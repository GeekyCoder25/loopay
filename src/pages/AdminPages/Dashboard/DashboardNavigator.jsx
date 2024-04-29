/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Header from '../components/Header';
import TransactionHistoryParams from '../../MenuPages/TransactionHistoryParams';
import Back from '../../../components/Back';

const DashboardNavigator = () => {
  const Stack = createNativeStackNavigator();

  const backHeader = (navigation, route) => {
    return {
      headerShown: true,
      header: () => <Back goBack={navigation.goBack} route={route} />,
    };
  };
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation }) => <Header navigation={navigation} />,
      }}>
      <Stack.Screen name="Home" component={Dashboard} />
      <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TransactionHistoryParams"
        component={TransactionHistoryParams}
        options={({ navigation, route }) => backHeader(navigation, route)}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
