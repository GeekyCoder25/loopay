import React, { useContext, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import TopBg from '../../assets/images/bg1.svg';
import { AppContext } from './AppContext';

const CustomBackground = ({ setDarkSplash }) => {
  const { vw, vh } = useContext(AppContext);

  const rotateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(rotateY, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateY, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(animate);
      setDarkSplash(prev => !prev);
    };
    animate();
  }, [rotateY, setDarkSplash]);

  const interpolatedRotateY = rotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={{ ...styles.bg, height: vh }}>
      <Animated.View
        style={{
          ...styles.top,
          transform: [{ rotateY: interpolatedRotateY }],
        }}>
        <TopBg width={`${vw}`} />
      </Animated.View>
      <Animated.View
        style={{
          ...styles.bottom,
          transform: [{ rotateY: interpolatedRotateY }],
        }}>
        <TopBg width={`${vw}`} />
      </Animated.View>
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
