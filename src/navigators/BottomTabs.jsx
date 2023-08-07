import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '../components/TabBar';
import SendMenuNavigator from './SendMenuNavigator';
import MenuNavigator from './MenuNavigator';
import { useContext, useEffect } from 'react';
import { AppContext } from '../components/AppContext';
import HomeNavigator from './HomeNavigator';
import WalletContextProvider from '../../context/WalletContext';
import BeneficiaryProvider from '../../context/BenefiaciariesContext';
const BottomTabs = () => {
  const { showTabBar, appData, setAppData } = useContext(AppContext);
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    setAppData(prev => {
      return {
        ...prev,
        pin: JSON.parse(appData.pin),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <WalletContextProvider>
      <BeneficiaryProvider>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
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
      </BeneficiaryProvider>
    </WalletContextProvider>
  );
};

export default BottomTabs;
