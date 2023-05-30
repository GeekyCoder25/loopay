import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import TabBar from '../components/TabBar';
import SendMenuNavigator from './SendMenuNavigator';
import MenuNavigator from './MenuNavigator';
import { useContext } from 'react';
import { AppContext } from '../components/AppContext';
const BottomTabs = () => {
  const { showTabBar } = useContext(AppContext);
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      backBehavior="initialRoute"
      tabBar={showTabBar ? TabBar : () => null}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="SendMenuNavigator"
        component={SendMenuNavigator}
        options={{ tabBarStyle: null }}
      />
      <Tab.Screen name="MenuNavigator" component={MenuNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
