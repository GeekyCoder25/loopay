/* eslint-disable react/no-unstable-nested-components */
import { useContext, useEffect, useState } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import DashboardIcon from '../../../../assets/images/dashboard.svg';
import AccountsIcon from '../../../../assets/images/accounts.svg';
import TransferIcon from '../../../../assets/images/transfer.svg';
import RateIcon from '../../../../assets/images/rate.svg';
import UsersIcon from '../../../../assets/images/users.svg';
import HistoryIcon from '../../../../assets/images/histories.svg';
import StatementIcon from '../../../../assets/images/statement.svg';
import SettingsIcon from '../../../../assets/images/settings.svg';
import Xmark from '../../../../assets/images/xmark.svg';
import Button from '../../../components/Button';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppContext } from '../../../components/AppContext';
import UserIcon from '../../../components/UserIcon';
import { getSessionID, logoutUser } from '../../../../utils/storage';
import RegularText from '../../../components/fonts/RegularText';
import ToastMessage from '../../../components/ToastMessage';
import IonIcon from '@expo/vector-icons/Ionicons';
import BoldText from '../../../components/fonts/BoldText';
import { useAdminDataContext } from '../../../context/AdminContext';
import useFetchData from '../../../../utils/fetchAPI';
import { FontAwesome } from '@expo/vector-icons';

const CustomDrawer = props => {
  const { deleteFetchData } = useFetchData();
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
    'Internationals',
    'Transfer',
    'Rate & Charges',
    'Users',
    'Verifications',
    'History',
    'Announcements',
    'Reports',
    'Statement',
    'Server APIs',
  ];
  const routeIcon = icon => {
    switch (icon) {
      case 'Dashboard':
        return <DashboardIcon />;
      case 'Accounts':
        return <AccountsIcon />;
      case 'Proofs':
        return <IonIcon name="cash-outline" color={'#868585'} size={24} />;
      case 'Internationals':
        return <FontAwesome name="globe" color={'#868585'} size={24} />;
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
      case 'Reports':
        return <StatementIcon />;
      case 'Server APIs':
        return <SettingsIcon fill={'#868585'} />;
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
              key={route}
              label={() => <RouteItem route={route} routeIcon={routeIcon} />}
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
    fontFamily: 'OpenSans-600',
    color: '#525252',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  routeIcon: {
    paddingBottom: 10,
  },
  routeText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#bbb',
    borderBottomWidth: 0.2,
    paddingBottom: 10,
  },
  routeCount: {
    backgroundColor: '#FBD5D5',
    width: 30,
    height: 30,
    borderRadius: 30,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
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

const RouteItem = ({ route, routeIcon }) => {
  const { adminData } = useAdminDataContext();
  const [routeCount, setRouteCount] = useState(0);
  const [hasRouteCount, setHasRouteCount] = useState(false);

  useEffect(() => {
    const drawerCount = adminData.drawerCount;
    if (drawerCount && drawerCount[route.toLowerCase()]) {
      setHasRouteCount(true);
      setRouteCount(drawerCount[route.toLowerCase()]);
    } else {
      setHasRouteCount(false);
      setRouteCount(0);
    }
  }, [adminData?.drawerCount, route]);

  return (
    <View style={styles.route}>
      <View style={styles.routeIcon}>{routeIcon(route)}</View>
      <View style={styles.routeText}>
        <RegularText>{route}</RegularText>
        {hasRouteCount && (
          <View style={styles.routeCount}>
            <BoldText color="#9B1C1C">{routeCount}</BoldText>
          </View>
        )}
      </View>
    </View>
  );
};
