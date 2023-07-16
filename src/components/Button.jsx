import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BoldText from './fonts/BoldText';

const Button = ({ text, onPress, Icon, disabled, flex, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.activeButton, ...style }}
      disabled={disabled || false}>
      <BoldText
        style={{
          ...styles.activeButtonText,
          flex,
          transform: [{ translateX: flex ? 10 : 0 }],
        }}>
        {text}
      </BoldText>
      <View>{Icon}</View>
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
  activeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Button;
