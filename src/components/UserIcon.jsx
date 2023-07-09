import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AppContext } from './AppContext';
import UserIconSVG from '../../assets/images/userMenu.svg';

const UserIcon = ({ style }) => {
  const { appData } = useContext(AppContext);
  return appData.photo ? (
    <Image
      src={appData.photoURL}
      loadingIndicatorSource={require('../../assets/images/user.jpg')}
      style={{ ...styles.userIconStyle, ...style }}
    />
  ) : (
    <View style={{ ...styles.nonUserIconStyle, ...style }}>
      <UserIconSVG
        width={style?.width / 2 || 25}
        height={style?.height / 2 || 25}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  userIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
  },
  nonUserIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default UserIcon;
