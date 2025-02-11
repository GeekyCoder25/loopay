import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BoldText from './fonts/BoldText';

const Button = ({
  text,
  onPress,
  leftIcon,
  Icon,
  disabled,
  flex,
  color,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.activeButton,
        backgroundColor: disabled
          ? styles.inActiveButton.backgroundColor
          : styles.activeButton.backgroundColor,
        ...style,
      }}
      disabled={disabled || false}>
      {leftIcon && <View>{leftIcon}</View>}
      <BoldText
        style={{
          ...styles.activeButtonText,
          flex,
          transform: [{ translateX: flex ? 10 : 0 }],
          color: color || '#fff',
        }}>
        {text}
      </BoldText>
      {Icon && <View>{Icon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: '#1E1E1E',
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    width: 90 + '%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  inActiveButton: {
    backgroundColor: 'rgba(28, 28, 28, 0.5)',
  },
  activeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'OpenSans-600',
  },
});

export default Button;
