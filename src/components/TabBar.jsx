import { StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../../assets/images/home.svg';
import SendIcon from '../../assets/images/send.svg';
import MenuIcon from '../../assets/images/menu.svg';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import BoldText from './fonts/BoldText';
const tabRoutes = [
  {
    route: 'Home',
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
  const { showTabBar } = useContext(AppContext);
  return showTabBar ? (
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
  ) : (
    <></>
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
    zIndex: 99,
  },
  hideBottomTabs: {
    height: 0,
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
      case 'Home':
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

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(`${routePage.route}`);
      }}
      style={styles.routeIcon}>
      <View>{routeIcon(fillColor)}</View>
      <BoldText style={{ color: fillColor }}>{routePage.label}</BoldText>
    </TouchableOpacity>
  );
};
