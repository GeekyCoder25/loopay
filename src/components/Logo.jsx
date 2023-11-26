import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.logo}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logoImage}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    minHeight: 70,
    maxWidth: 100 + '%',
  },
  logoImage: { height: 40, width: 250 },
});
export default Logo;
