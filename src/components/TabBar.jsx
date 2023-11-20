import { StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../../assets/images/home.svg';
import SendIcon from '../../assets/images/send.svg';
import MenuIcon from '../../assets/images/menu.svg';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import BoldText from './fonts/BoldText';
const tabRoutes = [
  {
    route: 'HomeNavigator',
    label: 'Home',
  },
  {
    route: 'SendMenuNavigator',
    label: 'Send',
  },
  {
    route: 'MenuNavigator',
    label: 'Menu',
  },
];

const TabBar = ({ navigation, state }) => {
  return (
    <View style={styles.bottomTabs}>
      {tabRoutes.map((routePage, index) => (
        <TabRoute
          key={routePage.route}
          routePage={routePage}
          navigation={navigation}
          index={index}
          state={state}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    elevation: 30,
  },
  routeIcon: {
    paddingHorizontal: 25,
    alignItems: 'center',
    gap: 2,
  },
});
export default TabBar;

const TabRoute = ({ routePage, navigation, state, index }) => {
  const isFocused = state.index === index;
  const routeIcon = fill => {
    switch (routePage.route) {
      case 'HomeNavigator':
        return <HomeIcon fill={fill} />;
      case 'SendMenuNavigator':
        return <SendIcon fill={fill} />;
      case 'MenuNavigator':
        return <MenuIcon fill={fill} />;
      default:
        break;
    }
  };
  const fillColor = isFocused ? '#000' : '#bbb';

  const { setWalletRefresh } = useContext(AppContext);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(`${routePage.route}`);
        routePage.route === 'HomeNavigator' && setWalletRefresh(prev => !prev);
      }}
      style={styles.routeIcon}>
      <View>{routeIcon(fillColor)}</View>
      <BoldText style={{ color: fillColor }}>{routePage.label}</BoldText>
    </TouchableOpacity>
  );
};
