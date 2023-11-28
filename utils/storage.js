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
  LOCAL_CURRENCY: 'LOCAL_CURRENCY',
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
export const getCurrencyCode = async () => {
  const stringifiedState = await AsyncStorage.getItem(
    StorageKeys.LOCAL_CURRENCY,
  );
  return stringifiedState;
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
// getStorage(StorageKeys.DEFAULT_CURRENCY);
