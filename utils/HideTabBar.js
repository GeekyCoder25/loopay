import { useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../src/components/AppContext';

const HideTabBar = async status => {
  const { setShowTabBar } = useContext(AppContext);
  console.log(status);
  useFocusEffect(
    useCallback(() => {
      setShowTabBar(status === false ? status : true);
    }, [setShowTabBar, status]),
  );
};

export default HideTabBar;
