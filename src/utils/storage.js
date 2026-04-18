import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: 'medicare_user',
  APPOINTMENTS: 'medicare_appointments',
  RECORDS: 'medicare_records',
  NOTIFICATIONS: 'medicare_notifications',
  SETTINGS: 'medicare_settings',
  AUTH: 'medicare_auth',
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = async () => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveAppointments = async (appointments) => {
  await AsyncStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const getAppointments = async () => {
  const data = await AsyncStorage.getItem(KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : [];
};

export const saveRecords = async (records) => {
  await AsyncStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
};

export const getRecords = async () => {
  const data = await AsyncStorage.getItem(KEYS.RECORDS);
  return data ? JSON.parse(data) : [];
};

export const saveNotifications = async (notifications) => {
  await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const getNotifications = async () => {
  const data = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
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
