/* eslint-disable react-native/no-inline-styles */
import { useContext, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from './AppContext';
import { useAdminDataContext } from '../context/AdminContext';

const PageContainer = ({
  children,
  padding,
  paddingTop,
  justify,
  scroll,
  style,
  refreshFunc,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { setWalletRefresh, isAdmin, isLoggedIn, noReload } =
    useContext(AppContext);
  const adminContext = useAdminDataContext();

  const handleRefresh = async () => {
    setRefreshing(true);
    setWalletRefresh(prev => !prev);
    refreshFunc && (await refreshFunc());
    isAdmin && adminContext.setRefetch(prev => !prev);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        ...styles.container,
        paddingTop: paddingTop !== undefined ? paddingTop : 10,
        paddingHorizontal: padding ? 3 + '%' : undefined,
        justifyContent: justify ? 'space-between' : 'flex-start',
        flex: scroll ? undefined : 1,
        ...style,
      }}
      refreshControl={
        isLoggedIn && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            enabled={!noReload}
          />
        )
      }>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default PageContainer;
