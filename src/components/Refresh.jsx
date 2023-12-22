import { useContext } from 'react';
import { RefreshControl } from 'react-native';
import { AppContext } from './AppContext';

const Refresh = ({ refreshFunc }) => {
  const { setWalletRefresh, noReload, refreshing, setRefreshing } =
    useContext(AppContext);

  const handleRefresh = async () => {
    setWalletRefresh(prev => !prev);
    setRefreshing(true);
    refreshFunc && (await refreshFunc());
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      enabled={!noReload}
    />
  );
};

export default Refresh;
