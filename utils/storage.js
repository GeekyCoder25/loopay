import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageKeys = {
  USER: 'USER',
  NOT_FIRST_TIME: 'NOT_FIRST_TIME',
  LOGGED_IN: 'LOGGED_IN',
  TOKEN: 'TOKEN',
  SESSION: 'SESSION',
};

export const loginUser = async (data, session) => {
  await AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(data));
  await AsyncStorage.setItem(StorageKeys.NOT_FIRST_TIME, 'true');
  await AsyncStorage.setItem(StorageKeys.LOGGED_IN, 'true');
  await AsyncStorage.setItem(StorageKeys.TOKEN, data.token);
  await AsyncStorage.setItem(StorageKeys.SESSION, session);
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(StorageKeys.USER);
  await AsyncStorage.removeItem(StorageKeys.TOKEN);
  await AsyncStorage.removeItem(StorageKeys.SESSION);
  await AsyncStorage.setItem(StorageKeys.LOGGED_IN, 'false');
};

export const getUser = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.USER);
  return JSON.parse(stringifiedState);
};

export const getIsLoggedIn = async () => {
  return await AsyncStorage.getItem(StorageKeys.LOGGED_IN);
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
// getStorage(StorageKeys.SESSION);
