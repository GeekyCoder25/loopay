import React, { useContext } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import TopBg from '../../assets/images/bg1.svg';
import { AppContext } from './AppContext';

const CustomBackground = () => {
  const { vw, vh } = useContext(AppContext);
  return (
    <View style={{ ...styles.bg, height: vh }}>
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
    justifyContent: 'space-around',
  },
  top: {
    top: -100,
    transform: [{ scale: 1.1 }],
  },
  bottom: {
    bottom: -100,
    transform: [{ rotateZ: '135deg' }, { scale: 1.1 }],
  },
});
