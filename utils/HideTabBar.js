import { useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../src/components/AppContext';

const HideTabBar = async status => {
  const { setShowTabBar } = useContext(AppContext);
  useFocusEffect(
    useCallback(() => {
      setShowTabBar(status === false ? status : true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
};

export default HideTabBar;
