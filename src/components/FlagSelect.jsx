import { Image } from 'react-native';
import Dollar from '../../assets/images/flag-us.svg';
import Naira from '../../assets/images/flag-ng.svg';
import Euro from '../../assets/images/flag-eu.svg';
import Pound from '../../assets/images/flag-gp.svg';
import { useContext } from 'react';
import { AppContext } from './AppContext';

const FlagSelect = ({ country, style }) => {
  const { appData } = useContext(AppContext);
  switch (country) {
    case 'naira':
      return (
        <Naira
          style={style}
          width={style?.width || 30}
          height={style?.height || 30}
        />
      );
    case 'dollar':
      return (
        <Dollar
          style={style}
          width={style?.width || 30}
          height={style?.height || 30}
        />
      );
    case 'euro':
      return (
        <Euro
          style={style}
          width={style?.width || 30}
          height={style?.height || 30}
        />
      );
    case 'pound':
      return (
        <Pound
          style={style}
          width={style?.width || 30}
          height={style?.height || 30}
        />
      );

    default:
      return (
        <Image
          source={{
            uri: `https://flagcdn.com/w160/${appData.country.code?.toLowerCase()}.png`,
          }}
          width={30}
          height={30}
          resizeMode="contain"
          style={{ borderRadius: 15 }}
        />
      );
  }
};

export default FlagSelect;
