import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { AppContext } from './AppContext';

const CustomBackground = ({ setDarkSplash }) => {
  const { vh } = useContext(AppContext);

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
        <Image
          source={require('../../assets/images/bg1.png')}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={{
          ...styles.bottom,
          transform: [{ rotateY: interpolatedRotateY }],
        }}>
        <Image
          source={require('../../assets/images/bg2.png')}
          resizeMode="contain"
        />
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
    top: -80,
  },
  bottom: {
    bottom: -80,
  },
});
