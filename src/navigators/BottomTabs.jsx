/* eslint-disable react/no-unstable-nested-components */
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
import Popup from '../components/Popup';
import useShakeEvent from '../components/Shake';
import ShakeModal from '../components/ShakeModal';

const BottomTabs = () => {
  const {
    showTabBar,
    appData,
    setAppData,
    showPopUp,
    isSessionTimedOut,
    setIsShaking,
    setOpenShake,
  } = useContext(AppContext);
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

  const handleShake = () => {
    setIsShaking(false);
    setOpenShake(true);
  };
  useShakeEvent(handleShake);

  return (
    <WalletContextComponent>
      <BeneficiaryContextComponent>
        <RequestFundsContextComponent>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' },
            }}
            backBehavior="initialRoute"
            tabBar={showTabBar ? props => <TabBar {...props} /> : () => null}>
            <Tab.Screen name="HomeNavigator" component={HomeNavigator} />
            <Tab.Screen
              name="SendMenuNavigator"
              component={SendMenuNavigator}
              options={{ tabBarStyle: null }}
            />
            <Tab.Screen name="MenuNavigator" component={MenuNavigator} />
          </Tab.Navigator>
          {showPopUp && !isSessionTimedOut && <Popup />}
          {<ShakeModal />}
        </RequestFundsContextComponent>
      </BeneficiaryContextComponent>
    </WalletContextComponent>
  );
};

export default BottomTabs;
