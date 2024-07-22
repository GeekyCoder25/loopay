/* eslint-disable react-native/no-inline-styles */
import { useContext } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from './AppContext';
import { Audio } from 'expo-av';

const PageContainer = ({
  children,
  padding,
  paddingTop,
  justify,
  scroll,
  style,
  refreshFunc,
  avoidKeyboardPushup,
  avoidBounce,
}) => {
  const { setWalletRefresh, isLoggedIn, noReload, refreshing, setRefreshing } =
    useContext(AppContext);

  const handleRefresh = async () => {
    setWalletRefresh(prev => !prev);
    setRefreshing(true);
    refreshFunc && (await refreshFunc());
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/refresh.mp3'),
      );
      await sound.playAsync();
    };
    playSound();
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
      automaticallyAdjustKeyboardInsets={!avoidKeyboardPushup}
      refreshControl={
        isLoggedIn && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            enabled={!noReload}
          />
        )
      }
      bounces={!avoidBounce}>
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
