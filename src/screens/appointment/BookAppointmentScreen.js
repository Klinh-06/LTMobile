import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { getNext14Days, formatDate, getDayKey, formatDateLong } from '../../utils/dateUtils';

export default function BookAppointmentScreen({ navigation, route }) {
  const { doctor } = route.params;
  const { globalBookings, appointments } = useApp();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState('');

  const dates = getNext14Days();

  const isSlotTaken = (date, time) => {
    // Slot full: another user already booked this doctor at this time
    if (globalBookings.some(b => b.doctorId === doctor.id && b.date === date && b.time === time)) return 'full';
    // Conflict: current user already has any appointment at this date+time
    if (appointments.some(a => a.status === 'upcoming' && a.date === date && a.time === time)) return 'conflict';
    return false;
  };

  const getDoctorSlots = (date) => {
    if (!date) return [];
    const dayKey = getDayKey(date);
    return doctor.schedule[dayKey] || [];
  };

  const isSlotPast = (date, time) => {
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) return false;
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    return now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m);
  };

  const hasAvailableSlots = (date) => {
    const slots = getDoctorSlots(date);
    return slots.some(t => !isSlotPast(date, t));
  };

  const availableSlots = selectedDate ? getDoctorSlots(selectedDate) : [];

  const handleNext = () => {
    if (!selectedDate) { Alert.alert('Thông báo', 'Vui lòng chọn ngày khám'); return; }
    if (!selectedTime) { Alert.alert('Thông báo', 'Vui lòng chọn giờ khám'); return; }
    navigation.navigate('AppointmentConfirm', {
      doctor,
      date: selectedDate,
      time: selectedTime,
      note,
    });
  };

  const DateItem = ({ date }) => {
    const d = new Date(date);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const isSunday = d.getDay() === 0;
    const isSelected = date === selectedDate;
    const hasSlots = !isSunday && hasAvailableSlots(date);
    const disabled = isSunday || !hasSlots;
    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.dateItemSelected, disabled && styles.dateItemDisabled]}
        onPress={() => {
          if (disabled) return;
          setSelectedDate(date);
          setSelectedTime(null);
        }}
        disabled={disabled}
      >
        <Text style={[styles.dateDay, isSelected && styles.dateDaySelected, disabled && styles.dateDisabledText]}>
          {days[d.getDay()]}
        </Text>
        <Text style={[styles.dateNum, isSelected && styles.dateNumSelected, disabled && styles.dateDisabledText]}>
          {d.getDate()}
        </Text>
        {isSunday
          ? <Text style={styles.restLabel}>Nghỉ</Text>
          : !hasSlots && <View style={styles.noSlotDot} />
        }
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
          <Text style={styles.headerTitle}>Đặt lịch khám</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Doctor Info */}
          <View style={styles.doctorCard}>
            <View style={[styles.avatar, { backgroundColor: doctor.avatarColor }]}>
              <Text style={styles.initials}>{doctor.initials}</Text>
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpec}>{doctor.specialty}</Text>
              <Text style={styles.doctorFee}>{doctor.fee} / lần khám</Text>
            </View>
          </View>

          {/* Step 1: Date */}
          <View style={styles.section}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
              <Text style={styles.stepTitle}>Chọn ngày khám</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
              {dates.map(d => <DateItem key={d} date={d} />)}
            </ScrollView>
            {selectedDate && (
              <Text style={styles.selectedDateText}>
                <Ionicons name="calendar" size={14} color={Colors.primary} /> {formatDateLong(selectedDate)}
              </Text>
            )}
          </View>

          {/* Step 2: Time */}
          <View style={styles.section}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
              <Text style={styles.stepTitle}>Chọn giờ khám</Text>
            </View>
            {!selectedDate ? (
              <Text style={styles.hint}>Vui lòng chọn ngày trước</Text>
            ) : availableSlots.length === 0 ? (
              <Text style={styles.hint}>Bác sĩ không có lịch ngày này</Text>
            ) : (
              <View style={styles.timeGrid}>
                {availableSlots.filter(t => !isSlotPast(selectedDate, t)).map(t => {
                  const taken = isSlotTaken(selectedDate, t);
                  const isConflict = taken === 'conflict';
                  const isFull = taken === 'full';
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.timeChip,
                        t === selectedTime && styles.timeChipSelected,
                        isFull && styles.timeChipTaken,
                        isConflict && styles.timeChipConflict,
                      ]}
                      onPress={() => !taken && setSelectedTime(t)}
                      disabled={!!taken}
                    >
                      <Text style={[
                        styles.timeText,
                        t === selectedTime && styles.timeTextSelected,
                        taken && styles.timeTextTaken,
                      ]}>{t}</Text>
                      {isFull && <Text style={styles.takenLabel}>Đầy</Text>}
                      {isConflict && <Text style={styles.takenLabel}>Trùng</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Step 3: Note */}
          <View style={[styles.section, { marginBottom: 100 }]}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
              <Text style={styles.stepTitle}>Ghi chú (tùy chọn)</Text>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textLight}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Đã chọn:</Text>
            <Text style={styles.summaryValue}>
              {selectedDate && selectedTime
                ? `${formatDate(selectedDate)} • ${selectedTime}`
                : 'Chưa chọn'}
            </Text>
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Tiếp theo</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
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
  doctorCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    margin: 16, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  initials: { color: Colors.white, fontSize: 22, fontWeight: '700' },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  doctorSpec: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  doctorFee: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 4 },
  section: {
    backgroundColor: Colors.white, margin: 16, marginBottom: 0, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  stepNumText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  stepTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  dateList: { paddingBottom: 8, gap: 8 },
  dateItem: {
    width: 56, alignItems: 'center', paddingVertical: 10,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  dateItemSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateItemDisabled: { opacity: 0.4 },
  dateDay: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  dateDaySelected: { color: Colors.white },
  dateNum: { fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: 2 },
  dateNumSelected: { color: Colors.white },
  dateDisabledText: { color: Colors.textLight },
  noSlotDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error, marginTop: 3 },
  restLabel: { fontSize: 9, color: Colors.error, fontWeight: '700', marginTop: 2 },
  selectedDateText: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 10 },
  hint: { fontSize: 13, color: Colors.textSecondary, fontStyle: 'italic', marginTop: 4 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background,
    alignItems: 'center',
  },
  timeChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeChipTaken: { backgroundColor: Colors.background, borderColor: Colors.border, opacity: 0.5 },
  timeChipConflict: { backgroundColor: '#FFF3E0', borderColor: '#FF9800', opacity: 0.7 },
  timeText: { fontSize: 14, color: Colors.text, fontWeight: '600' },
  timeTextSelected: { color: Colors.white },
  timeTextTaken: { color: Colors.textLight },
  takenLabel: { fontSize: 10, color: Colors.error, marginTop: 2 },
  noteInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    padding: 12, fontSize: 14, color: Colors.text, backgroundColor: Colors.background,
    textAlignVertical: 'top', minHeight: 80,
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, padding: 16, flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: Colors.border, gap: 12,
  },
  summary: { flex: 1 },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary },
  summaryValue: { fontSize: 13, color: Colors.text, fontWeight: '600', marginTop: 2 },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  nextBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
