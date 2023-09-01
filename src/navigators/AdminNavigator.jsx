import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../pages/AdminPages/Dashboard';
import Header from '../pages/AdminPages/components/Header';
import CustomDrawer from '../pages/AdminPages/components/Drawer';
import AdminContextComponent from '../context/AdminContext';
import Accounts from '../pages/AdminPages/Accounts';
import AdminTransfer from '../pages/AdminPages/AdminTransfer';
import Users from '../pages/AdminPages/Users';
import TransactionHistoryParams from '../pages/MenuPages/TransactionHistoryParams';
import Back from '../components/Back';
import History from '../pages/AdminPages/History';
import Statement from '../pages/AdminPages/Statement';
import Success from '../pages/SendMenuPages/Success';
import Transactions from '../pages/AdminPages/Transactions';

const AdminNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <AdminContextComponent>
      <Drawer.Navigator
        drawerContent={CustomDrawer}
        screenOptions={{
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Accounts" component={Accounts} />
        <Drawer.Screen name="Transfer" component={AdminTransfer} />
        <Drawer.Screen name="Users" component={Users} />
        <Drawer.Screen name="History" component={History} />
        <Drawer.Screen name="Statement" component={Statement} />
        <Drawer.Screen name="Success" component={Success} />
        <Drawer.Screen
          name="Transactions"
          component={Transactions}
          options={{
            header: ({ navigation, route }) => (
              <Back
                onPress={() => navigation.navigate(route.params.previousScreen)}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="TransactionHistoryDetails"
          component={TransactionHistoryParams}
          options={{
            header: ({ navigation, route }) => (
              <Back
                onPress={() => navigation.navigate(route.params.previousScreen)}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </AdminContextComponent>
  );
};

export default AdminNavigator;
