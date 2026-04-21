import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { formatDateLong } from '../../utils/dateUtils';

export default function AppointmentConfirmScreen({ navigation, route }) {
  const { doctor, date, time, note } = route.params;
  const { bookAppointment, user } = useApp();
  const [loading, setLoading] = useState(false);
  const submitted = useRef(false);

  const handleConfirm = async () => {
    if (submitted.current) return;
    submitted.current = true;
    setLoading(true);
    try {
      const appt = await bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        avatarColor: doctor.avatarColor,
        initials: doctor.initials,
        room: doctor.room,
        date,
        time,
        note,
        fee: doctor.fee,
      });
      navigation.replace('BookingSuccess', { appointment: appt, doctor });
    } catch (e) {
      submitted.current = false;
      if (e.message === 'slot_taken') {
        Alert.alert('Giờ đã đầy', 'Giờ khám này vừa có người đặt. Vui lòng chọn giờ khác.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else if (e.message === 'time_conflict') {
        Alert.alert('Trùng lịch', 'Bạn đã có lịch khám vào giờ này. Vui lòng chọn giờ khác.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const Row = ({ icon, label, value, valueColor }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, valueColor && { color: valueColor }]}>{value}</Text>
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
        <Text style={styles.headerTitle}>Xác nhận đặt lịch</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progress}>
          {['Chọn lịch', 'Xác nhận', 'Hoàn thành'].map((s, i) => (
            <React.Fragment key={s}>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, i <= 1 && styles.progressDotActive]}>
                  {i < 1 ? <Ionicons name="checkmark" size={14} color={Colors.white} /> :
                    <Text style={styles.progressDotText}>{i + 1}</Text>}
                </View>
                <Text style={[styles.progressLabel, i <= 1 && styles.progressLabelActive]}>{s}</Text>
              </View>
              {i < 2 && <View style={[styles.progressLine, i < 1 && styles.progressLineActive]} />}
            </React.Fragment>
          ))}
        </View>

        {/* Doctor */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin bác sĩ</Text>
          <View style={styles.doctorRow}>
            <View style={[styles.avatar, { backgroundColor: doctor.avatarColor }]}>
              <Text style={styles.initials}>{doctor.initials}</Text>
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpec}>{doctor.specialty}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color="#FFB300" />
                <Text style={styles.rating}> {doctor.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiết lịch hẹn</Text>
          <Row icon="calendar-outline" label="Ngày khám" value={formatDateLong(date)} />
          <Row icon="time-outline" label="Giờ khám" value={time} />
          <Row icon="cash-outline" label="Phí khám" value={doctor.fee} valueColor={Colors.primary} />
          {note ? <Row icon="document-text-outline" label="Ghi chú" value={note} /> : null}
        </View>

        {/* Patient */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin bệnh nhân</Text>
          <Row icon="person-outline" label="Họ tên" value={user?.fullName || ''} />
          <Row icon="card-outline" label="CCCD / CMND" value={user?.cccd || ''} />
          {user?.phone ? <Row icon="call-outline" label="Điện thoại" value={user.phone} /> : null}
        </View>

        {/* Quy trình khám */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quy trình khám</Text>
          {(() => {
            const roomFloor = doctor.room ? doctor.room.split(', ')[1] : 'Tầng 2';
            return [
              { step: '1', location: 'Tầng 1 — Quầy lễ tân', person: 'Nhân viên lễ tân', desc: 'Xuất trình CCCD bản gốc hoặc VNeID + mã lịch hẹn, nhận số thứ tự' },
              { step: '2', location: `${roomFloor} — Khu vực chờ`, person: 'Điều dưỡng', desc: 'Ngồi chờ tại ghế chờ, theo dõi bảng điện tử gọi số' },
              { step: '3', location: `${doctor.room || 'Phòng khám'}`, person: doctor.name, desc: 'Vào phòng khi được gọi số, mang theo CCCD để bác sĩ đối chiếu' },
              { step: '4', location: 'Tầng 1 — Quầy thu ngân', person: 'Nhân viên thu ngân', desc: 'Thanh toán phí khám và nhận toa thuốc (nếu có)' },
            ].map((item, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{item.step}</Text>
                </View>
                {i < 3 && <View style={styles.stepLine} />}
                <View style={styles.stepContent}>
                  <View style={styles.stepFloorRow}>
                    <Ionicons name="location-outline" size={12} color={Colors.primary} />
                    <Text style={styles.stepFloor}>{item.location}</Text>
                  </View>
                  <View style={styles.stepPersonRow}>
                    <Ionicons name="person-outline" size={11} color={Colors.textSecondary} />
                    <Text style={styles.stepPerson}>{item.person}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{item.desc}</Text>
                </View>
              </View>
            ));
          })()}
        </View>

        {/* Lưu ý mang CCCD */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={20} color="#0288D1" style={{ marginTop: 1 }} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.noteTitle}>Lưu ý khi đến khám</Text>
            <Text style={styles.noteText}>Vui lòng mang theo <Text style={{ fontWeight: '700' }}>CCCD bản gốc hoặc VNeID</Text> để đối chiếu thông tin tại quầy lễ tân và phòng khám.</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmText}>{loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}</Text>
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
  progress: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 4,
  },
  progressItem: { alignItems: 'center' },
  progressDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  progressDotActive: { backgroundColor: Colors.primary },
  progressDotText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  progressLabel: { fontSize: 11, color: Colors.textSecondary },
  progressLabelActive: { color: Colors.primary, fontWeight: '600' },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginBottom: 14, marginHorizontal: 4 },
  progressLineActive: { backgroundColor: Colors.primary },
  card: {
    backgroundColor: Colors.white, margin: 16, marginBottom: 0, borderRadius: 16,
    padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  doctorRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  initials: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  doctorSpec: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rating: { fontSize: 13, color: Colors.text, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 12, color: Colors.textSecondary },
  rowValue: { fontSize: 14, color: Colors.text, fontWeight: '500', marginTop: 2 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, padding: 16, flexDirection: 'row', gap: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  cancelText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '700' },
  confirmBtn: {
    flex: 2, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  confirmText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  stepNum: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  stepLine: {
    position: 'absolute', left: 13, top: 28, width: 2, height: 36,
    backgroundColor: Colors.primaryLight,
  },
  stepContent: { flex: 1, marginLeft: 12, paddingTop: 2 },
  stepFloorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  stepFloor: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  stepPersonRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3, marginTop: 2 },
  stepPerson: { fontSize: 11, color: Colors.textSecondary },
  stepDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#E1F5FE', marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 14,
    borderLeftWidth: 4, borderLeftColor: '#0288D1',
  },
  noteTitle: { fontSize: 13, fontWeight: '700', color: '#01579B', marginBottom: 4 },
  noteText: { fontSize: 13, color: '#0277BD', lineHeight: 19 },
});
