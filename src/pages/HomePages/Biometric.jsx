import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import { Pressable, StyleSheet, View } from 'react-native';
import BiometricIcon from '../../../assets/images/biometric.svg';
import RegularText from '../../components/fonts/RegularText';
import SwitchOn from '../../../assets/images/switch.svg';
import SwitchOff from '../../../assets/images/switchOff.svg';
import { AppContext } from '../../components/AppContext';
import { setBiometric } from '../../../utils/storage';
import * as LocalAuthentication from 'expo-local-authentication';
import ToastMessage from '../../components/ToastMessage';

const Biometric = () => {
  const { enableBiometric, setEnableBiometric, isAndroid } =
    useContext(AppContext);

  const handleSwitchBiometric = async () => {
    if (!enableBiometric) {
      const options = {
        promptMessage: 'Setup login with Biometrics',
        cancelLabel: 'Cancel',
        disableDeviceFallback: !isAndroid,
      };
      const { success } = await LocalAuthentication.authenticateAsync(options);
      if (success) {
        setEnableBiometric(prev => !prev);
        return await setBiometric(!enableBiometric);
      } else {
        await LocalAuthentication.cancelAuthenticate();
        return ToastMessage("Couldn't authenticate user");
      }
    }
    await setBiometric(!enableBiometric);
    setEnableBiometric(prev => !prev);
  };

  return (
    <PageContainer paddingTop={30} padding>
      <BoldText style={styles.headerText}>Biometric Authentication</BoldText>
      <View style={styles.body}>
        <View style={styles.route}>
          <View style={styles.routeIcon}>
            <BiometricIcon />
          </View>
          <View style={styles.routeTexts}>
            <BoldText style={styles.routeName}>Use biometric</BoldText>
            <RegularText style={styles.routeDetails}>
              Enable/Disable biometric authentication method to sign in to app
              and complete transactions
            </RegularText>
          </View>
          <Pressable onPress={handleSwitchBiometric}>
            {enableBiometric ? (
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#c4c4c4',
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
export default Biometric;
