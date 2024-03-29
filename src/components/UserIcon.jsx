import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AppContext } from './AppContext';
import UserIconSVG from '../../assets/images/userMenu.svg';

const UserIcon = props => {
  const { appData, vw } = useContext(AppContext);

  return Object.keys(props).includes('uri') ? (
    props.uri ? (
      props.uri === 'loopay' ? (
        <Image
          source={require('../../assets/images/icon.png')}
          style={{ ...styles.userIconStyle, ...props.style }}
        />
      ) : (
        <Image
          src={props.uri.replace(
            '/image/upload',
            `/image/upload/w_${Math.round(vw)},q_auto,f_auto`,
          )}
          loadingIndicatorSource={require('../../assets/images/user.jpg')}
          style={{ ...styles.userIconStyle, ...props.style }}
        />
      )
    ) : (
      <View style={{ ...styles.nonUserIconStyle, ...props.style }}>
        <UserIconSVG
          width={props.style?.width || 60}
          height={props.style?.height || 60}
        />
      </View>
    )
  ) : appData?.photoURL ? (
    <Image
      src={appData.photoURL.replace(
        '/image/upload',
        `/image/upload/w_${Math.round(vw)},q_auto,f_auto`,
      )}
      loadingIndicatorSource={require('../../assets/images/user.jpg')}
      style={{ ...styles.userIconStyle, ...props.style }}
    />
  ) : (
    <View style={{ ...styles.nonUserIconStyle, ...props.style }}>
      <UserIconSVG
        width={props.style?.width || 60}
        height={props.style?.height || 60}
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
    overflow: 'hidden',
  },
});
export default UserIcon;
