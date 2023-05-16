import React from 'react';
import { StyleSheet, View } from 'react-native';
import LogoIcon from '../../assets/images/logoDark.svg';

const Logo = () => {
  return (
    <View style={styles.logo}>
      <LogoIcon width="150" />
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
export default Logo;
