import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageKeys = {
  USER: 'USER',
  NOT_FIRST_TIME: 'NOT_FIRST_TIME',
  LOGGED_IN: 'LOGGED_IN',
  TOKEN: 'TOKEN',
  SESSION: 'SESSION',
  SHOW_BALANCE: 'SHOW_BALANCE',
  DEFAULT_CURRENCY: 'DEFAULT_CURRENCY',
  ROLE: 'ROLE',
  BIOMETRIC: 'BIOMETRIC',
  BIOMETRIC_PIN: 'BIOMETRIC_PIN',
  LOCAL_CURRENCY: 'LOCAL_CURRENCY',
  INVALID_PIN: 'INVALID_PIN',
  EMAIL: 'EMAIL',
  SHAKE: 'SHAKE',
};

export const loginUser = async (data, session) => {
  const showBalance = JSON.stringify(await getShowBalance());
  await AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(data));
  await AsyncStorage.setItem(StorageKeys.NOT_FIRST_TIME, 'true');
  await AsyncStorage.setItem(StorageKeys.LOGGED_IN, 'true');
  await AsyncStorage.setItem(StorageKeys.SHOW_BALANCE, showBalance || 'true');
  await AsyncStorage.setItem(StorageKeys.TOKEN, data.token + '...' + session);
  await AsyncStorage.setItem(StorageKeys.SESSION, session);
  await AsyncStorage.setItem(StorageKeys.ROLE, data.role);
  await AsyncStorage.setItem(StorageKeys.EMAIL, data.email);
  await AsyncStorage.setItem(StorageKeys.SHAKE, 'true');
  await AsyncStorage.setItem(
    StorageKeys.LOCAL_CURRENCY,
    data.localCurrencyCode,
  );
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(StorageKeys.USER);
  await AsyncStorage.removeItem(StorageKeys.TOKEN);
  await AsyncStorage.removeItem(StorageKeys.SESSION);
  await AsyncStorage.removeItem(StorageKeys.ROLE);
  await AsyncStorage.removeItem(StorageKeys.LOCAL_CURRENCY);
  await AsyncStorage.removeItem(StorageKeys.DEFAULT_CURRENCY);
  await AsyncStorage.removeItem(StorageKeys.INVALID_PIN);
  // await AsyncStorage.removeItem(StorageKeys.BIOMETRIC);
  await AsyncStorage.setItem(StorageKeys.LOGGED_IN, 'false');
};

export const getUser = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.USER);
  return JSON.parse(stringifiedState);
};

export const getIsLoggedIn = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.LOGGED_IN);
  return JSON.parse(stringifiedState);
};

export const getNotFirstTime = async () => {
  const stringifiedState = await AsyncStorage.getItem(
    StorageKeys.NOT_FIRST_TIME,
  );
  return JSON.parse(stringifiedState);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(StorageKeys.TOKEN);
};

export const getEmail = async () => {
  return await AsyncStorage.getItem(StorageKeys.EMAIL);
};

export const getSessionID = async () => {
  return await AsyncStorage.getItem(StorageKeys.SESSION);
};

export const getCurrency = async () => {
  return await AsyncStorage.getItem(StorageKeys.LOCAL_CURRENCY);
};

export const setShowBalance = async prev => {
  return await AsyncStorage.setItem(StorageKeys.SHOW_BALANCE, `${prev}`);
};

export const getShowBalance = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.SHOW_BALANCE);
  return JSON.parse(stringifiedState);
};

export const setDefaultCurrency = async currency => {
  return await AsyncStorage.setItem(StorageKeys.DEFAULT_CURRENCY, currency);
};

export const getDefaultCurrency = async () => {
  return await AsyncStorage.getItem(StorageKeys.DEFAULT_CURRENCY);
};

export const setBiometric = async state => {
  return await AsyncStorage.setItem(StorageKeys.BIOMETRIC, `${state}`);
};
export const getBiometric = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.BIOMETRIC);
  return JSON.parse(stringifiedState);
};
export const setBiometricPin = async state => {
  return await AsyncStorage.setItem(StorageKeys.BIOMETRIC_PIN, `${state}`);
};
export const getBiometricPin = async () => {
  const stringifiedState = await AsyncStorage.getItem(
    StorageKeys.BIOMETRIC_PIN,
  );
  return JSON.parse(stringifiedState);
};
export const getShake = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.SHAKE);
  return JSON.parse(stringifiedState);
};
export const setShake = async state => {
  return await AsyncStorage.setItem(StorageKeys.SHAKE, `${state}`);
};
export const getCurrencyCode = async () => {
  const stringifiedState = await AsyncStorage.getItem(
    StorageKeys.LOCAL_CURRENCY,
  );
  return stringifiedState;
};
export const setInvalidPinStatus = async state => {
  const stringifiedState = await AsyncStorage.setItem(
    StorageKeys.INVALID_PIN,
    `${state}`,
  );
  return stringifiedState;
};
export const getInvalidPinStatus = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.INVALID_PIN);
  return JSON.parse(stringifiedState);
};

const getAllKeys = async () => {
  const data = await AsyncStorage.getAllKeys();
  console.log(data);
};
const clearAllKeys = async () => {
  await AsyncStorage.clear();
};
const getStorage = async key => {
  const data = await AsyncStorage.getItem(key);
  console.log(data);
};
const deleteStorage = async key => {
  await AsyncStorage.removeItem(key);
};
// getAllKeys();
// clearAllKeys();
// deleteStorage('USER');
// getStorage(StorageKeys.SHAKE);
