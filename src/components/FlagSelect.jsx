import { Image, StyleSheet } from 'react-native';
import Dollar from '../../assets/images/flag-us.svg';
import Naira from '../../assets/images/flag-ng.svg';
import Euro from '../../assets/images/flag-eu.svg';
import Pound from '../../assets/images/flag-gp.svg';

const FlagSelect = ({ country, style }) => {
  const selectFlag = () => {
    switch (country) {
      case 'Naira':
        return (
          <Naira
            style={style}
            width={style?.width || 30}
            height={style?.height || 30}
          />
        );
      case 'Dollar':
        return (
          <Dollar
            style={style}
            width={style?.width || 30}
            height={style?.height || 30}
          />
        );
      case 'Euro':
        return (
          <Euro
            style={style}
            width={style?.width || 30}
            height={style?.height || 30}
          />
        );
      case 'Pound':
        return (
          <Pound
            style={style}
            width={style?.width || 30}
            height={style?.height || 30}
          />
        );

      default:
        return '';
    }
  };
  return selectFlag();
};

export default FlagSelect;
