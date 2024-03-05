/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import Home from '../pages/BottomTabPages/Home';
import NotificationsContextComponent from '../context/NotificationContext';
import TabBar from '../components/TabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SendMenu from '../pages/BottomTabPages/SendMenu';
import Menu from '../pages/BottomTabPages/Menu';

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NotificationsContextComponent>
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="SendMenuNavigator" component={SendMenu} />
        <Tab.Screen name="MenuNavigator" component={Menu} />
      </Tab.Navigator>
    </NotificationsContextComponent>
  );
};

export default BottomTabs;
