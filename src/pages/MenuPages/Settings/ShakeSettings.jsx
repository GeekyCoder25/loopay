import { Pressable, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import MaIcon from '@expo/vector-icons/MaterialIcons';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import SwitchOn from '../../../../assets/images/switch.svg';
import SwitchOff from '../../../../assets/images/switchOff.svg';
import { AppContext } from '../../../components/AppContext';
import { setShake } from '../../../../utils/storage';

const ShakeSettings = () => {
  const { enableShake, setEnableShake } = useContext(AppContext);

  const handleSwitch = async () => {
    setEnableShake(prev => !prev);
    await setShake(!enableShake);
  };

  return (
    <PageContainer paddingTop={30} padding>
      <BoldText style={styles.headerText}>Shake Functionality</BoldText>
      <View style={styles.body}>
        <View style={styles.route}>
          <View style={styles.routeIcon}>
            <MaIcon name="screen-rotation" size={24} color={'#868585'} />
          </View>
          <View style={styles.routeTexts}>
            <BoldText style={styles.routeName}>
              Use shake device functionality
            </BoldText>
            <RegularText style={styles.routeDetails}>
              Enable/Disable shaking of device to open quick links pop up
            </RegularText>
          </View>
          <Pressable onPress={handleSwitch}>
            {enableShake ? (
              <SwitchOn width={40} height={40} />
            ) : (
              <SwitchOff width={40} height={40} />
            )}
          </Pressable>
        </View>
      </View>
    </PageContainer>
  );
};

export default ShakeSettings;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
  },
  body: {
    marginVertical: 50,
  },
  route: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingBottom: 10,
    paddingRight: 10,
  },
  routeIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  routeTexts: {
    flex: 1,
  },
  routeName: {
    fontFamily: 'Karla-600',
    color: '#585555',
    fontSize: 16,
  },
  routeDetails: {
    fontFamily: 'Karla-400',
    color: '#585555',
  },
});
