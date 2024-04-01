import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { settingsRoutes } from '../../database/data';
import RegularText from '../../components/fonts/RegularText';
import UserIconSVG from '../../../assets/images/user-grey.svg';
import HistoryIcon from '../../../assets/images/history.svg';
import CardIcon from '../../../assets/images/cardMenu.svg';
import ShieldIcon from '../../../assets/images/shield.svg';
import LockIcon from '../../../assets/images/lockMenu.svg';
import DevicesIcon from '../../../assets/images/devices.svg';
import KeyIcon from '../../../assets/images/key.svg';
import DualUserIcon from '../../../assets/images/dualUser.svg';
import FaceIDIcon from '../../../assets/images/face-id.svg';
import BiometricIcon from '../../../assets/images/biometric.svg';
import BoldText from '../../components/fonts/BoldText';
import MaIcon from '@expo/vector-icons/MaterialIcons';
import { AppContext } from '../../components/AppContext';

const Settings = ({ navigation }) => {
  return (
    <PageContainer paddingTop={0} padding scroll>
      <View>
        <BoldText style={styles.headerText}>Settings</BoldText>
      </View>
      <View style={{ ...styles.routesContainer }}>
        {settingsRoutes.map(route => (
          <RouteLink
            key={route.routeName}
            route={route}
            navigation={navigation}
          />
        ))}
      </View>
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
    fontSize: 25,
    marginBottom: 20,
  },
  routesContainer: {
    gap: 20,
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
});

const RouteLink = ({ route, navigation }) => {
  const { hasFaceID } = useContext(AppContext);
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
        return <DualUserIcon />;
      case 'biometric':
        return hasFaceID ? <FaceIDIcon fill={'#868585'} /> : <BiometricIcon />;
      case 'shake':
        return <MaIcon name="screen-rotation" size={24} color={'#868585'} />;
      case 'support':
        return <MaIcon name="support-agent" size={24} color={'#868585'} />;
      case 'trash':
        return <MaIcon name="delete" size={24} color={'#868585'} />;
      case 'star':
        return <MaIcon name="star" size={24} color={'#868585'} />;
      default:
        break;
    }
  };

  const handleNavigate = () => {
    route.routeNavigate !== 'Rate'
      ? navigation.navigate(route.routeNavigate)
      : Linking.openURL(
          'https://play.google.com/store/apps/loopay/details?id=com.loopay.hmghomes',
        );
  };

  return (
    <Pressable onPress={handleNavigate} style={styles.route}>
      <View style={styles.routeIcon}>{routeIcon()}</View>
      <View style={styles.routeTexts}>
        <RegularText>{route.routeName}</RegularText>
      </View>
    </Pressable>
  );
};
export default Settings;
