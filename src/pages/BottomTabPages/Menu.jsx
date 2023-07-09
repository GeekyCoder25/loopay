/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import { logoutUser } from '../../../utils/storage';
import UserIcon from '../../components/UserIcon';

const Menu = ({ navigation }) => {
  const { setIsLoggedIn, vh, setAppData } = useContext(AppContext);
  const menuRoutes = [
    {
      routeName: 'My Info',
      routeNavigate: 'MyInfo',
      routeIcon: 'user',
    },
    {
      routeName: 'Verification Status',
      routeNavigate: 'VerificationStatus',
      routeIcon: 'user',
      routeEnd: true,
    },
    {
      routeName: 'Transaction History',
      routeNavigate: 'TransactionHistory',
      routeIcon: 'history',
    },
    {
      routeName: 'Virtual Card',
      routeNavigate: 'VirtualCard',
      routeIcon: 'card',
    },
    // {
    //   routeName: 'Two-Factor Authentication',
    //   routeNavigate: 'TwoAuth',
    //   routeIcon: 'shield',
    // },
    {
      routeName: 'Change Password',
      routeNavigate: 'ChangePassword',
      routeIcon: 'lock',
    },
    {
      routeName: 'Devices and Session',
      routeNavigate: 'DevicesAndSessions',
      routeIcon: 'devices',
    },
    {
      routeName: 'Change Transaction Pin',
      routeNavigate: 'TransactionPin',
      routeIcon: 'key',
    },
    {
      routeName: 'Referrals',
      routeNavigate: 'Referrals',
      routeIcon: 'dualUser',
    },
    {
      routeName: 'Support',
      routeNavigate: 'Support',
      routeIcon: 'dualUser',
    },
  ];
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setAppData({});
  };
  return (
    <PageContainer paddingTop={0}>
      <View style={styles.header}>
        <BoldText style={styles.headerText}>My details</BoldText>
        <Pressable
          onPress={() =>
            setAppData(prev => {
              return { ...prev, pin: prev.pin ? undefined : 1578 };
            })
          }>
          <UserIcon />
        </Pressable>
      </View>
      <ScrollView>
        <View style={{ ...styles.routesContainer, minHeight: vh * 0.7 }}>
          {menuRoutes.map(routePage => (
            <RoutePage
              key={routePage.routeName}
              routePage={routePage}
              navigation={navigation}
            />
          ))}
        </View>
        <View style={styles.button}>
          <Button
            text={'Log Out'}
            Icon={<LogOut />}
            flex={1}
            handlePress={handleLogout}
          />
        </View>
      </ScrollView>
    </PageContainer>
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

const RoutePage = ({ routePage, navigation }) => {
  const { verified } = useContext(AppContext);
  const routeIcon = () => {
    switch (routePage.routeIcon) {
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
    console.log(routePage.routeNavigate);
    navigation.navigate(routePage.routeNavigate);
  };
  return (
    <Pressable onPress={handleNavigate} style={styles.route}>
      <View style={styles.routeIcon}>{routeIcon()}</View>
      <View style={styles.routeTexts}>
        <RegularText>{routePage.routeName}</RegularText>
      </View>
      {routePage.routeEnd && (
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
