import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import { Pressable, StyleSheet, View } from 'react-native';
import FaceIDIcon from '../../../assets/images/face-id.svg';
import BiometricIcon from '../../../assets/images/biometric.svg';
import RegularText from '../../components/fonts/RegularText';
import SwitchOn from '../../../assets/images/switch.svg';
import SwitchOff from '../../../assets/images/switchOff.svg';
import { AppContext } from '../../components/AppContext';
import { setBiometric, setBiometricPin } from '../../../utils/storage';
import * as LocalAuthentication from 'expo-local-authentication';
import ToastMessage from '../../components/ToastMessage';

const Biometric = () => {
  const { enableBiometric, setEnableBiometric, hasFaceID } =
    useContext(AppContext);

  const handleSwitchBiometric = async () => {
    if (!enableBiometric.forLock) {
      const options = {
        promptMessage: 'Setup login with Biometrics',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      };
      const { success } = await LocalAuthentication.authenticateAsync(options);
      if (success) {
        setEnableBiometric(prev => {
          return { ...prev, forLock: !prev.forLock };
        });
        return await setBiometric(!enableBiometric.forLock);
      } else {
        await LocalAuthentication.cancelAuthenticate();
        return ToastMessage("Couldn't authenticate user");
      }
    }
    await setBiometric(!enableBiometric);
    setEnableBiometric(prev => {
      return { ...prev, forLock: !prev.forLock };
    });
  };
  const handleSwitchBiometricForPin = async () => {
    if (!enableBiometric.forPin) {
      const options = {
        promptMessage: 'Setup Transaction Pin with Biometrics',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      };
      const { success } = await LocalAuthentication.authenticateAsync(options);
      if (success) {
        setEnableBiometric(prev => {
          return { ...prev, forPin: !prev.forPin };
        });
        return await setBiometricPin(!enableBiometric.forPin);
      } else {
        await LocalAuthentication.cancelAuthenticate();
        return ToastMessage("Couldn't authenticate user");
      }
    }
    await setBiometricPin(!enableBiometric.forPin);
    setEnableBiometric(prev => {
      return { ...prev, forPin: !prev.forPin };
    });
  };

  return (
    <PageContainer paddingTop={30} padding>
      <BoldText style={styles.headerText}>Biometric Authentication</BoldText>
      <View style={styles.body}>
        <View style={styles.route}>
          <View style={styles.routeTexts}>
            <BoldText style={styles.routeName}>Use biometric</BoldText>
            <RegularText style={styles.routeDetails}>
              Enable/Disable biometric authentication method to sign in to app
              and complete transactions
            </RegularText>
          </View>
        </View>
      </View>
      <View style={styles.route}>
        <View style={styles.routeIcon}>
          {hasFaceID ? (
            <FaceIDIcon width={40} height={40} />
          ) : (
            <BiometricIcon />
          )}
        </View>
        <View style={styles.routeTexts}>
          <BoldText style={styles.routeName}>
            Use {hasFaceID ? 'Face ID' : 'Biometric'}
          </BoldText>
          <RegularText style={styles.routeDetails}>For password</RegularText>
        </View>
        <Pressable onPress={handleSwitchBiometric}>
          {enableBiometric?.forLock ? (
            <SwitchOn width={40} height={40} />
          ) : (
            <SwitchOff width={40} height={40} />
          )}
        </Pressable>
      </View>
      <View style={styles.route}>
        <View style={styles.routeIcon}>
          {hasFaceID ? (
            <FaceIDIcon width={40} height={40} />
          ) : (
            <BiometricIcon />
          )}
        </View>
        <View style={styles.routeTexts}>
          <BoldText style={styles.routeName}>
            Use {hasFaceID ? 'Face ID' : 'Biometric'}
          </BoldText>
          <RegularText style={styles.routeDetails}>
            For transaction pin
          </RegularText>
        </View>
        <Pressable onPress={handleSwitchBiometricForPin}>
          {enableBiometric?.forPin ? (
            <SwitchOn width={40} height={40} />
          ) : (
            <SwitchOff width={40} height={40} />
          )}
        </Pressable>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
  },
  body: {
    marginVertical: 20,
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
export default Biometric;
