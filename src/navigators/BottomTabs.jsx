import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/BottomTabPages/Home';
import TabBar from '../components/TabBar';
import SendMenuNavigator from './SendMenuNavigator';
import MenuNavigator from './MenuNavigator';
import { useContext, useEffect } from 'react';
import { AppContext } from '../components/AppContext';
import HomeNavigator from './HomeNavigator';
const BottomTabs = () => {
  const { showTabBar, setIsLoading, setLoadingModalBg, appData, setAppData } =
    useContext(AppContext);
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    setIsLoading(false);
    setLoadingModalBg(null);
    setAppData(prev => {
      return {
        ...prev,
        pin: JSON.parse(appData.pin),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      backBehavior="initialRoute"
      tabBar={showTabBar ? TabBar : () => null}>
      <Tab.Screen name="HomeNavigator" component={HomeNavigator} />
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
