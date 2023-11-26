import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '../components/TabBar';
import SendMenuNavigator from './SendMenuNavigator';
import MenuNavigator from './MenuNavigator';
import { useContext, useEffect } from 'react';
import { AppContext } from '../components/AppContext';
import HomeNavigator from './HomeNavigator';
import WalletContextComponent from '../context/WalletContext';
import BeneficiaryContextComponent from '../context/BeneficiariesContext';
import RequestFundsContextComponent from '../context/RequestContext';
import { allCurrencies } from '../database/data';

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
    <WalletContextComponent key={allCurrencies.length}>
      <BeneficiaryContextComponent>
        <RequestFundsContextComponent>
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
        </RequestFundsContextComponent>
      </BeneficiaryContextComponent>
    </WalletContextComponent>
  );
};

export default BottomTabs;
