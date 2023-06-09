import { StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../../assets/images/home.svg';
import SendIcon from '../../assets/images/send.svg';
import MenuIcon from '../../assets/images/menu.svg';
const tabRoutes = [
  {
    route: 'Home',
  },
  {
    route: 'SendMenuNavigator',
  },
  {
    route: 'MenuNavigator',
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
    padding: 15,
    elevation: 30,
  },
  routeIcon: {
    paddingHorizontal: 25,
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
      onPress={() => navigation.navigate(`${routePage.route}`)}
      style={styles.routeIcon}>
      <View>{routeIcon(fillColor)}</View>
    </TouchableOpacity>
  );
};
