import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getUser, saveUser, getAppointments, saveAppointments,
  getRecords, saveRecords, getNotifications, saveNotifications,
  getSettings, saveSettings, setAuthState, getAuthState, clearAll,
  saveRegisteredUsers, getRegisteredUsers, saveLastUserId, getLastUserId,
  saveGlobalBookings, getGlobalBookings, savePasscode, getPasscode,
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
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [recordsUnlocked, setRecordsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const auth = await getAuthState();
      const userData = await getUser();
      const setts = await getSettings();
      const gBookings = await getGlobalBookings();

      setSettings(setts);
      setGlobalBookings(gBookings);

      if (!auth || !userData) {
        setIsLoggedIn(false);
        setUser(userData || initialUser);
        return;
      }

      const userId = userData.id;
      const today = new Date().toISOString().split('T')[0];
      const isDemo = userId === 'u1';

      let appts = await getAppointments(userId);
      let recs = await getRecords(userId);
      const notifs = await getNotifications(userId);

      // Seed dữ liệu mẫu cho tài khoản demo nếu lần đầu
      if (appts.length === 0 && isDemo) {
        appts = getSampleAppointments();
        await saveAppointments(userId, appts);
      }
      if (recs.length === 0 && isDemo) {
        recs = getSampleRecords();
        await saveRecords(userId, recs);
      }

      const cleanedAppts = appts.filter(a => !(a.status === 'upcoming' && a.date < today));

      setIsLoggedIn(true);
      setUser(userData);
      setAppointments(cleanedAppts);
      setRecords(recs);
      setNotifications(notifs);
      const savedCode = await getPasscode(userId);
      setPasscodeEnabled(!!savedCode);
    } catch (e) {
      console.log('Load error', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (cccd, password) => {
    const registeredUsers = await getRegisteredUsers();
    const demoAccount = { ...initialUser, password: '123456' };
    const allUsers = [demoAccount, ...registeredUsers];
    const found = allUsers.find(u => u.cccd === cccd.trim() && u.password === password);
    if (!found) return false;
    const userData = { ...found };
    delete userData.password;

    // Merge saved profile cache (saveUser) — source of truth for profile fields
    const savedUser = await getUser();
    if (savedUser?.id === userData.id) {
      const profileKeys = ['fullName', 'phone', 'dateOfBirth', 'gender', 'bloodType', 'avatarColor', 'initials'];
      profileKeys.forEach(k => { if (savedUser[k] != null) userData[k] = savedUser[k]; });
    }

    const userId = userData.id;
    const today = new Date().toISOString().split('T')[0];
    const isDemo = userId === 'u1';

    // Mỗi tài khoản có vùng dữ liệu riêng — load đúng key của user này
    let appts = await getAppointments(userId);
    let recs = await getRecords(userId);
    const notifs = await getNotifications(userId);

    if (appts.length === 0 && isDemo) {
      appts = getSampleAppointments();
      await saveAppointments(userId, appts);
    }
    if (recs.length === 0 && isDemo) {
      recs = getSampleRecords();
      await saveRecords(userId, recs);
    }

    const cleanedAppts = appts.filter(a => !(a.status === 'upcoming' && a.date < today));

    setRecordsUnlocked(false);
    setAppointments(cleanedAppts);
    setRecords(recs);
    setNotifications(notifs);
    const savedCode = await getPasscode(userId);
    setPasscodeEnabled(!!savedCode);

    await saveLastUserId(userId);
    setUser(userData);
    setIsLoggedIn(true);
    await saveUser(userData);
    await setAuthState(true);
    return true;
  };

  const register = async (data) => {
    const registeredUsers = await getRegisteredUsers();
    const exists = registeredUsers.find(u => u.cccd === data.cccd.trim());
    if (exists) return 'exists';
    const newId = 'u_' + Date.now();
    const userData = {
      id: newId,
      fullName: data.fullName,
      cccd: data.cccd.trim(),
      phone: '',
      password: data.password,
      gender: '',
      bloodType: '',
      dateOfBirth: '',
      initials: data.fullName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      avatarColor: ['#2196F3','#4CAF50','#9C27B0','#FF9800','#F44336'][Math.floor(Math.random()*5)],
    };
    await saveRegisteredUsers([...registeredUsers, userData]);
    const savedUser = { ...userData };
    delete savedUser.password;
    setRecordsUnlocked(false);
    setPasscodeEnabled(false);
    // Tài khoản mới có vùng dữ liệu riêng (per-user key) — mặc định rỗng
    setAppointments([]);
    setRecords([]);
    setNotifications([]);
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

  const resetPassword = async (cccd, newPassword) => {
    const registeredUsers = await getRegisteredUsers();
    const found = registeredUsers.find(u => u.cccd === cccd.trim());
    if (!found) return false;
    const updated = registeredUsers.map(u => u.cccd === cccd.trim() ? { ...u, password: newPassword } : u);
    await saveRegisteredUsers(updated);
    return true;
  };

  const enablePasscode = async (code) => {
    if (!user?.id) return;
    await savePasscode(user.id, code);
    setPasscodeEnabled(true);
    setRecordsUnlocked(false);
  };

  const verifyPasscode = async (code) => {
    if (!user?.id) return false;
    const saved = await getPasscode(user.id);
    if (saved === code) { setRecordsUnlocked(true); return true; }
    return false;
  };

  const disablePasscode = async () => {
    if (!user?.id) return;
    await savePasscode(user.id, null);
    setPasscodeEnabled(false);
    setRecordsUnlocked(false);
  };

  const lockRecords = () => setRecordsUnlocked(false);

  const logout = async () => {
    setIsLoggedIn(false);
    setRecordsUnlocked(false);
    await setAuthState(false);
  };

  const updateUser = async (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    await saveUser(updated);
    const registeredUsers = await getRegisteredUsers();
    const synced = registeredUsers.map(u =>
      u.id === updated.id ? { ...u, ...data } : u
    );
    await saveRegisteredUsers(synced);
  };

  const bookAppointment = async (appointmentData) => {
    if (!user?.id) throw new Error('not_logged_in');
    // Guard: bác sĩ chỉ khám 1 bệnh nhân / giờ
    const slotTaken = globalBookings.some(
      b => b.doctorId === appointmentData.doctorId &&
           b.date === appointmentData.date &&
           b.time === appointmentData.time
    );
    if (slotTaken) throw new Error('slot_taken');

    // Guard: user không được đặt 2 lịch cùng giờ
    const timeConflict = appointments.some(
      a => a.status === 'upcoming' &&
           a.date === appointmentData.date &&
           a.time === appointmentData.time
    );
    if (timeConflict) throw new Error('time_conflict');

    const queueNumber = 'A' + String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    const apptCode = 'MC' + appointmentData.date.replace(/-/g, '') + String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    const newAppt = {
      id: generateId(),
      ...appointmentData,
      queueNumber,
      appointmentCode: apptCode,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    const updated = [...appointments, newAppt];
    setAppointments(updated);
    await saveAppointments(user.id, updated);

    const newBooking = { doctorId: appointmentData.doctorId, date: appointmentData.date, time: appointmentData.time, appointmentId: newAppt.id };
    const updatedGlobal = [...globalBookings, newBooking];
    setGlobalBookings(updatedGlobal);
    await saveGlobalBookings(updatedGlobal);

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
    if (!user?.id) return;
    const updated = appointments.map(a =>
      a.id === id ? { ...a, status: 'cancelled' } : a
    );
    setAppointments(updated);
    await saveAppointments(user.id, updated);

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
    if (!user?.id) throw new Error('not_logged_in');
    const current = appointments.find(a => a.id === id);
    if (!current) throw new Error('not_found');

    // Guard: bác sĩ chỉ khám 1 bệnh nhân / giờ — bỏ qua chính lịch đang đổi
    const slotTaken = globalBookings.some(
      b => b.doctorId === current.doctorId &&
           b.date === newDate &&
           b.time === newTime &&
           b.appointmentId !== id
    );
    if (slotTaken) throw new Error('slot_taken');

    // Guard: user không có 2 lịch cùng giờ — bỏ qua chính lịch đang đổi
    const timeConflict = appointments.some(
      a => a.status === 'upcoming' &&
           a.date === newDate &&
           a.time === newTime &&
           a.id !== id
    );
    if (timeConflict) throw new Error('time_conflict');

    const updated = appointments.map(a =>
      a.id === id ? { ...a, date: newDate, time: newTime } : a
    );
    setAppointments(updated);
    await saveAppointments(user.id, updated);

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
    if (!user?.id) return;
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;
    const updated = appointments.map(a =>
      a.id === id ? { ...a, status: 'completed' } : a
    );
    setAppointments(updated);
    await saveAppointments(user.id, updated);

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
    await saveRecords(user.id, updatedRecords);
    return record;
  };

  const rateAppointment = async (id, rating, comment) => {
    if (!user?.id) return;
    const updated = appointments.map(a =>
      a.id === id ? { ...a, rating, comment: comment || '', ratedAt: new Date().toISOString() } : a
    );
    setAppointments(updated);
    await saveAppointments(user.id, updated);
  };

  const addNotification = async (notif) => {
    if (!user?.id) return;
    const updated = [notif, ...notifications];
    setNotifications(updated);
    await saveNotifications(user.id, updated);
  };

  const markNotificationRead = async (id) => {
    if (!user?.id) return;
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    await saveNotifications(user.id, updated);
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    await saveNotifications(user.id, updated);
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
        passcodeEnabled, recordsUnlocked, enablePasscode, verifyPasscode, disablePasscode, lockRecords,
        bookAppointment, cancelAppointment, rescheduleAppointment, completeAppointment, rateAppointment,
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
