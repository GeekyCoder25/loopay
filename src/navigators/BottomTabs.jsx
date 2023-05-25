import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import TabBar from '../components/TabBar';
import SendMenuNavigator from './SendMenuNavigator';
import MenuNavigator from './MenuNavigator';

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      backBehavior="none"
      tabBar={TabBar}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="SendMenuNavigator" component={SendMenuNavigator} />
      <Tab.Screen name="MenuNavigator" component={MenuNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
