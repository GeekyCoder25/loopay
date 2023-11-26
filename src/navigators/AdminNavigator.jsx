/* eslint-disable react/no-unstable-nested-components */
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
import ActiveUsers from '../pages/AdminPages/ActiveUsers';
import AdminSelectCurrencyModal from '../pages/AdminPages/components/AdminSelectCurrency';
import Profile from '../pages/HomePages/Profile';
import Notifications from '../pages/AdminPages/Notifications';
import Rate from '../pages/AdminPages/Rate';
import { allCurrencies } from '../database/data';

const AdminNavigator = () => {
  const Drawer = createDrawerNavigator();

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
    <AdminContextComponent key={allCurrencies.length}>
      <Drawer.Navigator
        drawerContent={CustomDrawer}
        screenOptions={{
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Accounts" component={Accounts} />
        <Drawer.Screen name="Transfer" component={AdminTransfer} />
        <Drawer.Screen
          name="Rate & Charges"
          component={Rate}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Users"
          component={Users}
          options={{ headerShown: false }}
        />
        <Drawer.Screen name="History" component={History} />
        <Drawer.Screen name="Statement" component={Statement} />
        <Drawer.Screen
          name="Notifications"
          component={Notifications}
          options={({ navigation, route }) => BackHeader(navigation, route)}
        />
        <Drawer.Screen name="Success" component={Success} />
        <Drawer.Screen
          name="Transactions"
          component={Transactions}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="TransactionHistoryDetails"
          component={TransactionHistoryParams}
          options={({ navigation, route }) => BackHeader(navigation, route)}
        />
        <Drawer.Screen
          name="ActiveUsers"
          component={ActiveUsers}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="ProfileNavigator"
          component={Profile}
          options={({ navigation, route }) => BackHeader(navigation, route)}
        />
      </Drawer.Navigator>
      <AdminSelectCurrencyModal />
    </AdminContextComponent>
  );
};

export default AdminNavigator;
