import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getUser, saveUser, getAppointments, saveAppointments,
  getRecords, saveRecords, getNotifications, saveNotifications,
  getSettings, saveSettings, setAuthState, getAuthState, clearAll,
  saveRegisteredUsers, getRegisteredUsers, saveLastUserId, getLastUserId,
  saveGlobalBookings, getGlobalBookings,
} from '../utils/storage';
import { initialUser, sampleNotifications, getSampleAppointments, getSampleRecords } from '../data/mockData';
import { generateId, isDatePast } from '../utils/dateUtils';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({ pushNotifications: true, emailNotifications: false });
  const [globalBookings, setGlobalBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const auth = await getAuthState();
      const userData = await getUser();
      const appts = await getAppointments();
      const recs = await getRecords();
      const notifs = await getNotifications();
      const setts = await getSettings();
      const gBookings = await getGlobalBookings();

      const today = new Date().toISOString().split('T')[0];
      const isDemo = userData?.email === 'demo@medicare.vn';
      const rawAppts = appts.length > 0 ? appts : (isDemo ? getSampleAppointments() : []);
      const cleanedAppts = rawAppts.filter(a => !(a.status === 'upcoming' && a.date < today));

      setIsLoggedIn(auth);
      setUser(userData || initialUser);
      setAppointments(cleanedAppts);
      setRecords(recs.length > 0 ? recs : (isDemo ? getSampleRecords() : []));
      setNotifications(notifs.length > 0 ? notifs : []);
      setSettings(setts);
      setGlobalBookings(gBookings);
    } catch (e) {
      console.log('Load error', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    const registeredUsers = await getRegisteredUsers();
    const demoAccount = { ...initialUser, password: '123456' };
    const allUsers = [demoAccount, ...registeredUsers];
    const found = allUsers.find(u => u.phone === phone.trim() && u.password === password);
    if (!found) return false;
    const userData = { ...found };
    delete userData.password;

    const lastId = await getLastUserId();
    if (lastId !== String(userData.id)) {
      // Switching user — reset data for this account
      const isDemo = userData.email === 'demo@medicare.vn';
      const today = new Date().toISOString().split('T')[0];
      const newAppts = isDemo
        ? getSampleAppointments().filter(a => !(a.status === 'upcoming' && a.date < today))
        : [];
      const newRecs = isDemo ? getSampleRecords() : [];
      setAppointments(newAppts);
      setRecords(newRecs);
      setNotifications([]);
      await saveAppointments(newAppts);
      await saveRecords(newRecs);
      await saveNotifications([]);
      await saveLastUserId(userData.id);
    }

    setUser(userData);
    setIsLoggedIn(true);
    await saveUser(userData);
    await setAuthState(true);
    return true;
  };

  const register = async (data) => {
    const registeredUsers = await getRegisteredUsers();
    const exists = registeredUsers.find(u => u.phone === data.phone.trim());
    if (exists) return 'exists';
    const newId = 'u_' + Date.now();
    const userData = {
      id: newId,
      fullName: data.fullName,
      phone: data.phone.trim(),
      password: data.password,
      gender: '',
      bloodType: '',
      cccd: '',
      dateOfBirth: '',
      initials: data.fullName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      avatarColor: ['#2196F3','#4CAF50','#9C27B0','#FF9800','#F44336'][Math.floor(Math.random()*5)],
    };
    await saveRegisteredUsers([...registeredUsers, userData]);
    const savedUser = { ...userData };
    delete savedUser.password;
    // New account starts with empty data
    setAppointments([]);
    setRecords([]);
    setNotifications([]);
    await saveAppointments([]);
    await saveRecords([]);
    await saveNotifications([]);
    await saveLastUserId(newId);
    setUser(savedUser);
    setIsLoggedIn(true);
    await saveUser(savedUser);
    await setAuthState(true);
    return true;
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (user?.id === 'u1') {
      if (oldPassword !== '123456') return 'wrong';
      return 'demo';
    }
    const registeredUsers = await getRegisteredUsers();
    const found = registeredUsers.find(u => u.id === user?.id);
    if (!found || found.password !== oldPassword) return 'wrong';
    const updated = registeredUsers.map(u => u.id === user.id ? { ...u, password: newPassword } : u);
    await saveRegisteredUsers(updated);
    return true;
  };

  const resetPassword = async (phone, newPassword) => {
    const registeredUsers = await getRegisteredUsers();
    const found = registeredUsers.find(u => u.phone === phone.trim());
    if (!found) return false;
    const updated = registeredUsers.map(u => u.phone === phone.trim() ? { ...u, password: newPassword } : u);
    await saveRegisteredUsers(updated);
    return true;
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await setAuthState(false);
  };

  const updateUser = async (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    await saveUser(updated);
  };

  const bookAppointment = async (appointmentData) => {
    const newAppt = {
      id: generateId(),
      ...appointmentData,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    const updated = [...appointments, newAppt];
    setAppointments(updated);
    await saveAppointments(updated);

    const newBooking = { doctorId: appointmentData.doctorId, date: appointmentData.date, time: appointmentData.time, appointmentId: newAppt.id };
    const updatedGlobal = [...globalBookings, newBooking];
    setGlobalBookings(updatedGlobal);
    await saveGlobalBookings(updatedGlobal);

    // Add notification
    const notif = {
      id: generateId(),
      type: 'confirm',
      title: 'Đặt lịch thành công',
      message: `Lịch khám với ${appointmentData.doctorName} ngày ${appointmentData.date} lúc ${appointmentData.time} đã được xác nhận.`,
      time: 'Vừa xong',
      read: false,
      icon: 'check-circle',
      color: '#4CAF50',
    };
    await addNotification(notif);
    return newAppt;
  };

  const cancelAppointment = async (id) => {
    const updated = appointments.map(a =>
      a.id === id ? { ...a, status: 'cancelled' } : a
    );
    setAppointments(updated);
    await saveAppointments(updated);

    const updatedGlobal = globalBookings.filter(b => b.appointmentId !== id);
    setGlobalBookings(updatedGlobal);
    await saveGlobalBookings(updatedGlobal);

    const notif = {
      id: generateId(),
      type: 'cancel',
      title: 'Lịch khám đã hủy',
      message: 'Lịch khám của bạn đã được hủy thành công.',
      time: 'Vừa xong',
      read: false,
      icon: 'close-circle',
      color: '#F44336',
    };
    await addNotification(notif);
  };

  const rescheduleAppointment = async (id, newDate, newTime) => {
    const updated = appointments.map(a =>
      a.id === id ? { ...a, date: newDate, time: newTime } : a
    );
    setAppointments(updated);
    await saveAppointments(updated);

    const updatedGlobal = globalBookings.map(b =>
      b.appointmentId === id ? { ...b, date: newDate, time: newTime } : b
    );
    setGlobalBookings(updatedGlobal);
    await saveGlobalBookings(updatedGlobal);

    const notif = {
      id: generateId(),
      type: 'reminder',
      title: 'Đổi lịch thành công',
      message: `Lịch khám đã được dời sang ngày ${newDate} lúc ${newTime}.`,
      time: 'Vừa xong',
      read: false,
      icon: 'calendar-check',
      color: '#2196F3',
    };
    await addNotification(notif);
  };

  const completeAppointment = async (id) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;
    const updated = appointments.map(a =>
      a.id === id ? { ...a, status: 'completed' } : a
    );
    setAppointments(updated);
    await saveAppointments(updated);

    // Create medical record
    const record = {
      id: generateId(),
      appointmentId: id,
      doctorName: appt.doctorName,
      specialty: appt.specialty,
      date: appt.date,
      time: appt.time,
      diagnosis: 'Chưa cập nhật',
      prescription: 'Chưa cập nhật',
      notes: 'Chưa cập nhật',
      createdAt: new Date().toISOString(),
    };
    const updatedRecords = [...records, record];
    setRecords(updatedRecords);
    await saveRecords(updatedRecords);
    return record;
  };

  const addNotification = async (notif) => {
    const updated = [notif, ...notifications];
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const markNotificationRead = async (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const markAllRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getUpcomingAppointments = () =>
    appointments.filter(a => a.status === 'upcoming');

  const getCompletedAppointments = () =>
    appointments.filter(a => a.status === 'completed');

  const getCancelledAppointments = () =>
    appointments.filter(a => a.status === 'cancelled');

  const getRecordByAppointment = (appointmentId) =>
    records.find(r => r.appointmentId === appointmentId);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn, loading, user, appointments, records, notifications,
        settings, unreadCount, globalBookings,
        login, register, logout, updateUser, changePassword, resetPassword,
        bookAppointment, cancelAppointment, rescheduleAppointment, completeAppointment,
        addNotification, markNotificationRead, markAllRead, updateSettings,
        getUpcomingAppointments, getCompletedAppointments, getCancelledAppointments,
        getRecordByAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
