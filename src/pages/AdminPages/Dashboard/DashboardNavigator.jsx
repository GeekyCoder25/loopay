import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Header from '../components/Header';

const DashboardNavigator = () => {
  const Stack = createNativeStackNavigator();
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
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
