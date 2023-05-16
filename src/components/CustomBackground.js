import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import TopBg from '../../assets/images/bg1.svg';

const CustomBackground = () => {
  const vw = useWindowDimensions().width;
  return (
    <View style={styles.bg}>
      <View style={styles.top}>
        <TopBg width={`${vw}`} />
      </View>
      <View style={styles.bottom}>
        <TopBg width={`${vw}`} />
      </View>
    </View>
  );
};

export default CustomBackground;
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    position: 'absolute',
  },
  top: {
    transform: [{ scale: 1.1 }],
  },
  bottom: {
    transform: [{ rotateZ: '135deg' }, { scale: 1.1 }],
  },
});
