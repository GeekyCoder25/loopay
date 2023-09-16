/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';
import UserIconSVG from '../../../assets/images/userMenu.svg';
import HistoryIcon from '../../../assets/images/history.svg';
import CardIcon from '../../../assets/images/cardMenu.svg';
import ShieldIcon from '../../../assets/images/shield.svg';
import LockIcon from '../../../assets/images/lockMenu.svg';
import DevicesIcon from '../../../assets/images/devices.svg';
import KeyIcon from '../../../assets/images/key.svg';
import DualUSerIcon from '../../../assets/images/dualUser.svg';
import LogOut from '../../../assets/images/logOut.svg';
import { AppContext } from '../../components/AppContext';
import Button from '../../components/Button';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { getSessionID, logoutUser } from '../../../utils/storage';
import UserIcon from '../../components/UserIcon';
import { deleteFetchData } from '../../../utils/fetchAPI';
import { menuRoutes } from '../../database/data';
import { useFocusEffect } from '@react-navigation/native';
import ToastMessage from '../../components/ToastMessage';

const Menu = ({ navigation }) => {
  const {
    setIsLoading,
    setIsLoggedIn,
    vh,
    appData,
    setAppData,
    setShowTabBar,
    setCanChangeRole,
  } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const sessionID = await getSessionID();
      await deleteFetchData(`user/session/${sessionID}`);
      logoutUser();
      setIsLoggedIn(false);
      setAppData({});
      setCanChangeRole(false);
      ToastMessage('Logged Out successfully');
    } finally {
      setIsLoading(false);
    }
  };

  const transactionPin = menuRoutes.find(
    route => route.routeNavigate === 'TransactionPin',
  );
  transactionPin.routeName = `${
    appData.pin ? 'Change' : 'Create'
  } Transaction Pin`;

  useFocusEffect(
    React.useCallback(() => {
      setShowTabBar(true);
    }, [setShowTabBar]),
  );
  return (
    <>
      <View style={styles.header}>
        <BoldText style={styles.headerText}>My details</BoldText>
        <Pressable onPress={() => navigation.navigate('ProfileNavigator')}>
          <UserIcon />
        </Pressable>
      </View>
      <PageContainer paddingTop={0} scroll>
        <View style={{ ...styles.routesContainer, minHeight: vh * 0.7 }}>
          {menuRoutes.map(route => (
            <RouteLink
              key={route.routeName}
              route={route}
              navigation={navigation}
            />
          ))}
        </View>
        <View style={styles.button}>
          <Button
            text={'Log Out'}
            Icon={<LogOut />}
            flex={1}
            onPress={handleLogout}
          />
        </View>
      </PageContainer>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
  },
  routesContainer: {
    gap: 20,
    paddingHorizontal: 3 + '%',
    paddingVertical: 10,
  },
  route: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  routeIcon: {
    borderColor: '#1e1e1e',
    borderWidth: 0.5,
    width: 50,
    height: 50,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  routeTexts: {
    flex: 1,
  },
  verified: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  verifiedText: {
    color: '#fff',
  },
  button: {
    paddingBottom: 30,
  },
});

const RouteLink = ({ route, navigation }) => {
  const { verified } = useContext(AppContext);
  const routeIcon = () => {
    switch (route.routeIcon) {
      case 'user':
        return <UserIconSVG />;
      case 'history':
        return <HistoryIcon />;
      case 'card':
        return <CardIcon />;
      case 'shield':
        return <ShieldIcon />;
      case 'lock':
        return <LockIcon />;
      case 'devices':
        return <DevicesIcon />;
      case 'key':
        return <KeyIcon />;
      case 'dualUser':
        return <DualUSerIcon />;
      default:
        break;
    }
  };
  const handleNavigate = () => {
    navigation.navigate(route.routeNavigate);
  };
  return (
    <Pressable onPress={handleNavigate} style={styles.route}>
      <View style={styles.routeIcon}>{routeIcon()}</View>
      <View style={styles.routeTexts}>
        <RegularText>{route.routeName}</RegularText>
      </View>
      {route.routeEnd && (
        <View
          style={{
            ...styles.verified,
            backgroundColor: verified ? '#a2f247' : 'red',
          }}>
          {verified ? (
            <BoldText style={styles.verifiedText}>Verified</BoldText>
          ) : (
            <BoldText style={styles.verifiedText}>Not Verified</BoldText>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default Menu;
