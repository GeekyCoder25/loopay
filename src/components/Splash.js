import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../../assets/images/logoDark.svg';
import CustomBackground from '../components/CustomBackground';
import RegularText from './fonts/RegularText';

const Splash = ({ navigation }) => {
  const vw = useWindowDimensions().width;
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Signup');
    }, 1000);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <CustomBackground />
      <View>
        <Logo width={`${vw}`} />
        <RegularText style={styles.subText}>
          ...your favorite midnight pay pal
        </RegularText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText: {
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'right',
    fontSize: 12,
    paddingRight: 25 + '%',
    paddingTop: 5,
  },
});
export default Splash;
