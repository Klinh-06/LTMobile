import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { getNext14Days, getDayKey, formatDate, formatDateLong } from '../../utils/dateUtils';
import { doctors } from '../../data/mockData';

export default function RescheduleScreen({ navigation, route }) {
  const { appointment } = route.params;
  const { rescheduleAppointment, appointments, globalBookings } = useApp();
  const [selectedDate, setSelectedDate] = useState(appointment.date);
  const [selectedTime, setSelectedTime] = useState(appointment.time);
  const [loading, setLoading] = useState(false);

  const doctor = doctors.find(d => d.id === appointment.doctorId);
  const dates = getNext14Days();

  const getDoctorSlots = (date) => {
    if (!doctor || !date) return [];
    const dayKey = getDayKey(date);
    return doctor.schedule[dayKey] || [];
  };

  // 'full'    — bác sĩ đã có người khác đặt
  // 'conflict'— bạn có lịch khác cùng giờ
  // false     — slot trống
  const slotState = (date, time) => {
    const full = globalBookings.some(
      b => b.doctorId === appointment.doctorId &&
           b.date === date && b.time === time &&
           b.appointmentId !== appointment.id
    );
    if (full) return 'full';
    const conflict = appointments.some(
      a => a.status === 'upcoming' &&
           a.date === date && a.time === time &&
           a.id !== appointment.id
    );
    if (conflict) return 'conflict';
    return false;
  };

  const availableSlots = getDoctorSlots(selectedDate);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngày và giờ mới');
      return;
    }
    if (selectedDate === appointment.date && selectedTime === appointment.time) {
      Alert.alert('Thông báo', 'Ngày giờ mới phải khác với lịch hiện tại');
      return;
    }
    Alert.alert(
      'Xác nhận đổi lịch',
      `Đổi sang ${formatDateLong(selectedDate)} lúc ${selectedTime}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            setLoading(true);
            try {
              await rescheduleAppointment(appointment.id, selectedDate, selectedTime);
              setLoading(false);
              Alert.alert('Thành công', 'Lịch hẹn đã được cập nhật!', [
                { text: 'OK', onPress: () => navigation.pop(1) },
              ]);
            } catch (err) {
              setLoading(false);
              if (err.message === 'slot_taken') {
                Alert.alert('Khung giờ đã đầy', 'Bác sĩ đã có bệnh nhân khác đặt khung giờ này. Vui lòng chọn giờ khác.');
              } else if (err.message === 'time_conflict') {
                Alert.alert('Trùng lịch', 'Bạn đã có lịch khám khác cùng khung giờ này.');
              } else {
                Alert.alert('Lỗi', 'Không thể đổi lịch. Vui lòng thử lại.');
              }
            }
          },
        },
      ]
    );
  };

  const DateItem = ({ date }) => {
    const d = new Date(date);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const isSelected = date === selectedDate;
    const hasSlots = getDoctorSlots(date).length > 0;
    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.dateItemSelected, !hasSlots && { opacity: 0.4 }]}
        onPress={() => { if (!hasSlots) return; setSelectedDate(date); setSelectedTime(null); }}
        disabled={!hasSlots}
      >
        <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>{days[d.getDay()]}</Text>
        <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>{d.getDate()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi lịch hẹn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Appointment */}
        <View style={styles.currentCard}>
          <Text style={styles.currentLabel}>Lịch hiện tại</Text>
          <View style={styles.currentInfo}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.currentText}>{formatDateLong(appointment.date)} • {appointment.time}</Text>
          </View>
        </View>

        {/* New Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày mới</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {dates.map(d => <DateItem key={d} date={d} />)}
          </ScrollView>
          {selectedDate && (
            <Text style={styles.selectedInfo}>{formatDateLong(selectedDate)}</Text>
          )}
        </View>

        {/* New Time */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Chọn giờ mới</Text>
          {availableSlots.length === 0 ? (
            <Text style={styles.hint}>Bác sĩ không có lịch ngày này</Text>
          ) : (
            <View style={styles.timeGrid}>
              {availableSlots.map(t => {
                const state = slotState(selectedDate, t);
                const blocked = !!state;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeChip,
                      t === selectedTime && !blocked && styles.timeChipSelected,
                      state === 'full' && styles.timeChipFull,
                      state === 'conflict' && styles.timeChipConflict,
                    ]}
                    onPress={() => !blocked && setSelectedTime(t)}
                    disabled={blocked}
                  >
                    <Text style={[
                      styles.timeText,
                      t === selectedTime && !blocked && styles.timeTextSelected,
                      blocked && styles.timeTextBlocked,
                    ]}>{t}</Text>
                    {state === 'full' && <Text style={styles.timeBadge}>Đầy</Text>}
                    {state === 'conflict' && <Text style={[styles.timeBadge, styles.timeBadgeConflict]}>Trùng</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.newInfo}>
          <Text style={styles.newLabel}>Lịch mới:</Text>
          <Text style={styles.newValue}>
            {selectedDate && selectedTime ? `${formatDate(selectedDate)} • ${selectedTime}` : 'Chưa chọn'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
          onPress={handleReschedule}
          disabled={loading}
        >
          <Text style={styles.confirmText}>{loading ? 'Đang xử lý...' : 'Xác nhận đổi'}</Text>
        </TouchableOpacity>
      </View>
        </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  inner: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  currentCard: { backgroundColor: Colors.warning + '20', margin: 16, borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: Colors.warning },
  currentLabel: { fontSize: 12, color: Colors.warning, fontWeight: '700', marginBottom: 6 },
  currentInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currentText: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  section: { backgroundColor: Colors.white, margin: 16, marginBottom: 0, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  dateList: { paddingBottom: 8, gap: 8 },
  dateItem: { width: 52, alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background },
  dateItemSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateDay: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  dateDaySelected: { color: Colors.white },
  dateNum: { fontSize: 17, fontWeight: '700', color: Colors.text, marginTop: 2 },
  dateNumSelected: { color: Colors.white },
  selectedInfo: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 10 },
  hint: { fontSize: 13, color: Colors.textSecondary, fontStyle: 'italic' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background, alignItems: 'center', minWidth: 76 },
  timeChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeChipFull: { backgroundColor: Colors.border + '60', borderColor: Colors.border, opacity: 0.7 },
  timeChipConflict: { backgroundColor: '#FFF3E0', borderColor: '#FB8C00' },
  timeText: { fontSize: 14, color: Colors.text, fontWeight: '600' },
  timeTextSelected: { color: Colors.white },
  timeTextBlocked: { color: Colors.textSecondary },
  timeBadge: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700', marginTop: 2 },
  timeBadgeConflict: { color: '#FB8C00' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, padding: 16, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, gap: 12 },
  newInfo: { flex: 1 },
  newLabel: { fontSize: 11, color: Colors.textSecondary },
  newValue: { fontSize: 13, fontWeight: '600', color: Colors.text, marginTop: 2 },
  confirmBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14 },
  confirmText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
