import * as Device from 'expo-device';
import { randomUUID } from 'expo-crypto';

const saveSessionOptions = () => {
  return {
    deviceManufacturer: Device.manufacturer,
    deviceName: Device.deviceName,
    deviceID: randomUUID(),
    osName: Device.osName,
    osVersion: Device.osVersion,
    firstSignIn: new Date(),
    lastSeen: new Date(),
  };
};

export default saveSessionOptions;
