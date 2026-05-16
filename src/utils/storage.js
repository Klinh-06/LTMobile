import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: 'medicare_user',
  SETTINGS: 'medicare_settings',
  AUTH: 'medicare_auth',
};

const apptKey = (userId) => `medicare_appointments_${userId}`;
const recordsKey = (userId) => `medicare_records_${userId}`;
const notifKey = (userId) => `medicare_notifications_${userId}`;
const passcodeKey = (userId) => `medicare_passcode_${userId}`;

export const saveUser = async (user) => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = async () => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveAppointments = async (userId, appointments) => {
  if (!userId) return;
  await AsyncStorage.setItem(apptKey(userId), JSON.stringify(appointments));
};

export const getAppointments = async (userId) => {
  if (!userId) return [];
  const data = await AsyncStorage.getItem(apptKey(userId));
  return data ? JSON.parse(data) : [];
};

export const saveRecords = async (userId, records) => {
  if (!userId) return;
  await AsyncStorage.setItem(recordsKey(userId), JSON.stringify(records));
};

export const getRecords = async (userId) => {
  if (!userId) return [];
  const data = await AsyncStorage.getItem(recordsKey(userId));
  return data ? JSON.parse(data) : [];
};

export const saveNotifications = async (userId, notifications) => {
  if (!userId) return;
  await AsyncStorage.setItem(notifKey(userId), JSON.stringify(notifications));
};

export const getNotifications = async (userId) => {
  if (!userId) return [];
  const data = await AsyncStorage.getItem(notifKey(userId));
  return data ? JSON.parse(data) : [];
};

export const saveSettings = async (settings) => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = async () => {
  const data = await AsyncStorage.getItem(KEYS.SETTINGS);
  return data
    ? JSON.parse(data)
    : { pushNotifications: true, emailNotifications: false, language: 'Tiếng Việt' };
};

export const setAuthState = async (isLoggedIn) => {
  await AsyncStorage.setItem(KEYS.AUTH, JSON.stringify(isLoggedIn));
};

export const getAuthState = async () => {
  const data = await AsyncStorage.getItem(KEYS.AUTH);
  return data ? JSON.parse(data) : false;
};

export const saveRegisteredUsers = async (users) => {
  await AsyncStorage.setItem('medicare_reg_users', JSON.stringify(users));
};

export const getRegisteredUsers = async () => {
  const data = await AsyncStorage.getItem('medicare_reg_users');
  return data ? JSON.parse(data) : [];
};

export const clearAll = async () => {
  await AsyncStorage.multiRemove(Object.values(KEYS));
};

export const saveLastUserId = async (id) => {
  await AsyncStorage.setItem('medicare_last_user_id', String(id));
};

export const getLastUserId = async () => {
  return await AsyncStorage.getItem('medicare_last_user_id');
};

export const saveGlobalBookings = async (bookings) => {
  await AsyncStorage.setItem('medicare_global_bookings', JSON.stringify(bookings));
};

export const getGlobalBookings = async () => {
  const data = await AsyncStorage.getItem('medicare_global_bookings');
  return data ? JSON.parse(data) : [];
};

export const savePasscode = async (userId, code) => {
  if (!userId) return;
  if (code === null) {
    await AsyncStorage.removeItem(passcodeKey(userId));
  } else {
    await AsyncStorage.setItem(passcodeKey(userId), code);
  }
};

export const getPasscode = async (userId) => {
  if (!userId) return null;
  return await AsyncStorage.getItem(passcodeKey(userId));
};
