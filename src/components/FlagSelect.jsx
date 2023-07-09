import React from 'react';
import { Image, StyleSheet } from 'react-native';

const FlagSelect = ({ country, style }) => {
  const selectFlag = () => {
    switch (country) {
      case 'Naira':
        return (
          <Image
            source={require('../../assets/images/flag-ng.png')}
            style={style}
          />
        );
      case 'Dollar':
        return (
          <Image
            source={require('../../assets/images/flag-us.png')}
            style={style}
          />
        );
      case 'Euro':
        return (
          <Image
            source={require('../../assets/images/flag-eu.png')}
            style={style}
          />
        );
      case 'Pound':
        return (
          <Image
            source={require('../../assets/images/flag-gp.png')}
            style={style}
          />
        );

      default:
        return '';
    }
  };
  return selectFlag();
};

const styles = StyleSheet.create({});

export default FlagSelect;
