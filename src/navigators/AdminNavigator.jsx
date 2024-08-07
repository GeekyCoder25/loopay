/* eslint-disable react/no-unstable-nested-components */
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from '../pages/AdminPages/components/Header';
import CustomDrawer from '../pages/AdminPages/components/Drawer';
import AdminContextComponent from '../context/AdminContext';
import Accounts from '../pages/AdminPages/Accounts';
import AdminTransfer from '../pages/AdminPages/AdminTransfer';
import TransactionHistoryParams from '../pages/MenuPages/TransactionHistoryParams';
import Back from '../components/Back';
import History from '../pages/AdminPages/History';
import Statement from '../pages/AdminPages/Statement';
import Success from '../pages/SendMenuPages/Success';
import ActiveUsers from '../pages/AdminPages/ActiveUsers';
import AdminSelectCurrencyModal from '../pages/AdminPages/components/AdminSelectCurrency';
import Profile from '../pages/HomePages/Profile';
import Notifications from '../pages/AdminPages/Notifications';
import Rate from '../pages/AdminPages/Rate';
import Verifications from '../pages/AdminPages/Verifications';
import Verification from '../pages/AdminPages/components/Verification';
import Announcements from '../pages/AdminPages/Announcements';
import DashboardNavigator from '../pages/AdminPages/Dashboard/DashboardNavigator';
import UsersNavigator from '../pages/AdminPages/Users/UsersNavigator';
import ProofNavigator from '../pages/AdminPages/Proof/ProofNavigator';
import ServerAPIs from '../pages/AdminPages/ServerAPIs';
import ReportNavigator from '../pages/AdminPages/Reports/ReportNavigator';
import UserDetails from '../pages/AdminPages/Users/UserDetails';
import UserTransaction from '../pages/AdminPages/Users/UserTransaction';
import Internationals from '../pages/AdminPages/Internationals';
import { usePushNotification } from '../components/Notification';

const AdminNavigator = () => {
  const Drawer = createDrawerNavigator();
  usePushNotification();

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
    <AdminContextComponent>
      <Drawer.Navigator
        drawerContent={CustomDrawer}
        screenOptions={{
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}>
        <Drawer.Screen
          name="Dashboard"
          component={DashboardNavigator}
          options={{ headerShown: false }}
        />
        <Drawer.Screen name="Accounts" component={Accounts} />
        <Drawer.Screen
          name="Transfer"
          component={AdminTransfer}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Rate & Charges"
          component={Rate}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Users"
          component={UsersNavigator}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="UserTransaction"
          component={UserTransaction}
          options={{ headerShown: false }}
        />

        <Drawer.Screen name="History" component={History} />
        <Drawer.Screen name="Statement" component={Statement} />
        <Drawer.Screen
          name="Verifications"
          component={Verifications}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Announcements"
          component={Announcements}
          // options={({ navigation, route }) => BackHeader(navigation, route)}
        />
        <Drawer.Screen
          name="Notifications"
          component={Notifications}
          options={({ navigation, route }) => BackHeader(navigation, route)}
        />
        <Drawer.Screen
          name="Success"
          component={Success}
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
        <Drawer.Screen
          name="Verification"
          component={Verification}
          options={({ navigation, route }) => BackHeader(navigation, route)}
        />
        <Drawer.Screen
          name="Proofs"
          component={ProofNavigator}
          options={{ headerShown: false }}
        />
        <Drawer.Screen name="Internationals" component={Internationals} />
        <Drawer.Screen name="Reports" component={ReportNavigator} />
        <Drawer.Screen name="Server APIs" component={ServerAPIs} />
      </Drawer.Navigator>
      <AdminSelectCurrencyModal />
    </AdminContextComponent>
  );
};

export default AdminNavigator;
