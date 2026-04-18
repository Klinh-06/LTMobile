import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { formatDateLong, getStatusLabel } from '../../utils/dateUtils';

export default function AppointmentDetailScreen({ navigation, route }) {
  const { appointments, cancelAppointment, completeAppointment, getRecordByAppointment } = useApp();
  const appointmentId = route.params.appointment.id;
  const [, setTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setTick(t => t + 1);
    }, [])
  );

  const appointment = appointments.find(a => a.id === appointmentId) || route.params.appointment;
  const record = getRecordByAppointment(appointment.id);

  const statusConfig = {
    upcoming: { color: Colors.upcoming, bg: Colors.upcomingBg, icon: 'time-outline' },
    completed: { color: Colors.completed, bg: Colors.completedBg, icon: 'checkmark-circle' },
    cancelled: { color: Colors.cancelled, bg: Colors.cancelledBg, icon: 'close-circle' },
  };
  const cfg = statusConfig[appointment.status] || statusConfig.upcoming;

  const handleCancel = () => {
    Alert.alert(
      'Hủy lịch khám',
      'Bạn có chắc muốn hủy lịch này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy lịch',
          style: 'destructive',
          onPress: async () => {
            await cancelAppointment(appointment.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Hoàn thành khám',
      'Xác nhận đã hoàn thành buổi khám?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            await completeAppointment(appointment.id);
            navigation.replace('RateDoctor', { appointment });
          },
        },
      ]
    );
  };

  const Row = ({ icon, label, value, valueColor }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, valueColor && { color: valueColor }]}>{value || 'Chưa có'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lịch hẹn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={24} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{getStatusLabel(appointment.status)}</Text>
        </View>

        {/* Doctor */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin bác sĩ</Text>
          <View style={styles.doctorRow}>
            <View style={[styles.avatar, { backgroundColor: appointment.avatarColor || Colors.primary }]}>
              <Text style={styles.initials}>{appointment.initials || '?'}</Text>
            </View>
            <View>
              <Text style={styles.doctorName}>{appointment.doctorName}</Text>
              <Text style={styles.specialty}>{appointment.specialty}</Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin lịch hẹn</Text>
          <Row icon="calendar-outline" label="Ngày khám" value={formatDateLong(appointment.date)} />
          <Row icon="time-outline" label="Giờ khám" value={appointment.time} />
          <Row icon="cash-outline" label="Phí khám" value={appointment.fee} valueColor={Colors.primary} />
          {appointment.note ? <Row icon="document-text-outline" label="Ghi chú" value={appointment.note} /> : null}
        </View>

        {/* Medical Record Link */}
        {appointment.status === 'completed' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Kết quả khám</Text>
            {record ? (
              <TouchableOpacity
                style={styles.recordLink}
                onPress={() => navigation.navigate('RecordDetail', { record })}
              >
                <View style={styles.recordLeft}>
                  <View style={styles.recordIcon}>
                    <Ionicons name="document-text" size={24} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.recordTitle}>Hồ sơ khám bệnh</Text>
                    <Text style={styles.recordDate}>{formatDateLong(appointment.date)}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ) : (
              <Text style={styles.noRecord}>Chưa có hồ sơ khám</Text>
            )}
          </View>
        )}

        {/* Quy trình khám — chỉ hiện khi sắp tới */}
        {appointment.status === 'upcoming' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quy trình khi đến khám</Text>
            {[
              { step: '1', floor: 'Tầng 1', room: 'Quầy lễ tân', desc: 'Xuất trình CCCD/CMND + mã lịch hẹn, nhận số thứ tự' },
              { step: '2', floor: 'Tầng 2', room: 'Khu vực chờ', desc: 'Ngồi chờ tại ghế chờ, theo dõi bảng điện tử gọi số' },
              { step: '3', floor: 'Tầng 2', room: `Phòng khám ${appointment.specialty}`, desc: 'Vào phòng khi được gọi số, mang theo CCCD để bác sĩ đối chiếu' },
              { step: '4', floor: 'Tầng 1', room: 'Quầy thu ngân', desc: 'Thanh toán phí khám và nhận toa thuốc (nếu có)' },
            ].map((item, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{item.step}</Text>
                </View>
                {i < 3 && <View style={styles.stepLine} />}
                <View style={styles.stepContent}>
                  <View style={styles.stepFloorRow}>
                    <Ionicons name="location-outline" size={12} color={Colors.primary} />
                    <Text style={styles.stepFloor}>{item.floor} — {item.room}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
            <View style={styles.cccdNote}>
              <Ionicons name="information-circle-outline" size={16} color="#0288D1" />
              <Text style={styles.cccdNoteText}>Vui lòng mang theo <Text style={{ fontWeight: '700' }}>CCCD/CMND bản gốc</Text></Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={[styles.card, { marginBottom: 24 }]}>
          <Text style={styles.cardTitle}>Thao tác</Text>
          {appointment.status === 'upcoming' && (
            <>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Reschedule', { appointment })}
              >
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                <Text style={styles.actionText}>Đổi lịch hẹn</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionComplete]} onPress={handleComplete}>
                <Ionicons name="checkmark-circle-outline" size={18} color={Colors.success} />
                <Text style={[styles.actionText, { color: Colors.success }]}>Xác nhận đã khám</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.success} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionDanger]} onPress={handleCancel}>
                <Ionicons name="close-circle-outline" size={18} color={Colors.error} />
                <Text style={[styles.actionText, { color: Colors.error }]}>Hủy lịch khám</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.error} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            </>
          )}
          {appointment.status === 'completed' && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('RateDoctor', { appointment })}
            >
              <Ionicons name="star-outline" size={18} color="#FFB300" />
              <Text style={[styles.actionText, { color: '#FFB300' }]}>Đánh giá bác sĩ</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          )}
          {appointment.status === 'cancelled' && (
            <Text style={styles.cancelledNote}>Lịch hẹn này đã bị hủy và không thể thay đổi.</Text>
          )}
        </View>
      </ScrollView>
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
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 14, gap: 8,
  },
  statusText: { fontSize: 16, fontWeight: '700' },
  card: {
    backgroundColor: Colors.white, margin: 16, marginBottom: 0, borderRadius: 16,
    padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  doctorRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  initials: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  doctorName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  specialty: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 12, color: Colors.textSecondary },
  rowValue: { fontSize: 14, color: Colors.text, fontWeight: '500', marginTop: 2 },
  recordLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background, borderRadius: 12, padding: 12 },
  recordLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recordIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  recordTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  recordDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  noRecord: { fontSize: 14, color: Colors.textSecondary, fontStyle: 'italic' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: 12, padding: 14, marginBottom: 10, gap: 12 },
  actionComplete: { backgroundColor: Colors.completedBg },
  actionDanger: { backgroundColor: Colors.cancelledBg },
  actionText: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 },
  cancelledNote: { fontSize: 14, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepNum: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  stepLine: { position: 'absolute', left: 13, top: 28, width: 2, height: 36, backgroundColor: Colors.primaryLight },
  stepContent: { flex: 1, marginLeft: 12, paddingTop: 2 },
  stepFloorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  stepFloor: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  stepDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  cccdNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, backgroundColor: '#E1F5FE', borderRadius: 8, padding: 10 },
  cccdNoteText: { fontSize: 13, color: '#0277BD', flex: 1 },
});
