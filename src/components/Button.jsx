import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = ({ text, handlePress, Icon }) => {
  return (
    <TouchableOpacity onPress={handlePress} style={styles.activeButton}>
      <Text style={styles.activeButtonText}>{text}</Text>
      {Icon}
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
  },
  activeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Button;
