import { useContext } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import DashboardIcon from '../../../../assets/images/dashboard.svg';
import AccountsIcon from '../../../../assets/images/accounts.svg';
import TransferIcon from '../../../../assets/images/transfer.svg';
import RateIcon from '../../../../assets/images/rate.svg';
import UsersIcon from '../../../../assets/images/users.svg';
import HistoryIcon from '../../../../assets/images/histories.svg';
import StatementIcon from '../../../../assets/images/statement.svg';
import Xmark from '../../../../assets/images/xmark.svg';
import Button from '../../../components/Button';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppContext } from '../../../components/AppContext';
import UserIcon from '../../../components/UserIcon';
import { deleteFetchData } from '../../../../utils/fetchAPI';
import { getSessionID, logoutUser } from '../../../../utils/storage';
import RegularText from '../../../components/fonts/RegularText';
import ToastMessage from '../../../components/ToastMessage';
import IonIcon from '@expo/vector-icons/Ionicons';

const CustomDrawer = props => {
  const { navigation } = props;
  const {
    vh,
    setIsLoading,
    setIsLoggedIn,
    setAppData,
    setIsAdmin,
    setCanChangeRole,
  } = useContext(AppContext);

  const adminRoutes = [
    'Dashboard',
    'Accounts',
    'Proofs',
    'Transfer',
    'Rate & Charges',
    'Users',
    'Verifications',
    'History',
    'Announcements',
    'Statement',
  ];
  const routeIcon = icon => {
    switch (icon) {
      case 'Dashboard':
        return <DashboardIcon />;
      case 'Accounts':
        return <AccountsIcon />;
      case 'Proofs':
        return <IonIcon name="cash-outline" color={'#868585'} size={24} />;
      case 'Transfer':
        return <TransferIcon />;
      case 'Rate & Charges':
        return <RateIcon />;
      case 'Users':
        return <UsersIcon />;
      case 'Verifications':
        return (
          <IonIcon
            name="checkmark-circle-outline"
            color={'#868585'}
            size={24}
          />
        );
      case 'Announcements':
        return (
          <IonIcon name="cloud-upload-outline" color={'#868585'} size={24} />
        );
      case 'History':
        return <HistoryIcon />;
      case 'Statement':
        return <StatementIcon />;
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const sessionID = await getSessionID();
      await deleteFetchData(`user/session/${sessionID}`);
      logoutUser();
      setIsLoggedIn(false);
      setIsAdmin(false);
      setCanChangeRole(false);
      ToastMessage('Logged Out successfully');
      setAppData({});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.closeBar}>
        <Pressable onPress={() => navigation.closeDrawer()}>
          <Xmark />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ProfileNavigator')}
          style={styles.userImageContainer}>
          <UserIcon />
        </Pressable>
      </View>
      <View style={{ ...styles.drawer, minHeight: vh * 0.73 }}>
        <View>
          {adminRoutes.map(route => (
            <DrawerItem
              icon={() => routeIcon(route)}
              key={route}
              label={route}
              labelStyle={styles.route}
              onPress={() => navigation.navigate(route)}
            />
          ))}
        </View>
        <View style={styles.buttons}>
          <Button
            text={'Log Out'}
            style={styles.button}
            onPress={handleLogout}
          />
          <Pressable style={styles.switch} onPress={() => setIsAdmin(false)}>
            <RegularText style={styles.switchText}>Switch to User</RegularText>
          </Pressable>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  closeBar: {
    backgroundColor: '#eee',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -5,
  },
  drawer: {
    justifyContent: 'space-between',
    paddingTop: 20 + '%',
  },
  route: {
    borderBottomWidth: 0.2,
    marginLeft: -10,
    borderBottomColor: '#bbb',
    paddingBottom: 10,
    fontFamily: 'OpenSans-600',
    color: '#525252',
  },
  buttons: {
    marginTop: 30,
    marginBottom: 50,
  },
  button: {
    borderRadius: 5,
  },
  switch: {
    marginTop: 25,
  },
  switchText: {
    textAlign: 'center',
  },
});

export default CustomDrawer;
