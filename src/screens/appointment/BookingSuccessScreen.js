import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { formatDateLong } from '../../utils/dateUtils';

export default function BookingSuccessScreen({ navigation, route }) {
  const { appointment, doctor } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.successCircle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark-circle" size={90} color={Colors.success} />
        </Animated.View>

        <Animated.View style={[styles.content, { opacity }]}>
          <Text style={styles.title}>Đặt lịch thành công!</Text>
          <Text style={styles.subtitle}>Lịch hẹn của bạn đã được xác nhận</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.avatar, { backgroundColor: doctor.avatarColor }]}>
                <Text style={styles.initials}>{doctor.initials}</Text>
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpec}>{doctor.specialty}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {[
              { icon: 'calendar-outline', label: 'Ngày khám', value: formatDateLong(appointment.date) },
              { icon: 'time-outline', label: 'Giờ khám', value: appointment.time },
              { icon: 'cash-outline', label: 'Phí khám', value: appointment.fee },
            ].map(item => (
              <View key={item.label} style={styles.detailRow}>
                <Ionicons name={item.icon} size={16} color={Colors.primary} />
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.noteBox}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.warning} />
            <Text style={styles.noteText}>Vui lòng đến trước giờ hẹn 15 phút và mang theo CCCD/hộ chiếu</Text>
          </View>

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.reset({
              index: 0,
              routes: [{
                name: 'MainTabs',
                state: { index: 1, routes: [{ name: 'Home' }, { name: 'Appointments' }] },
              }],
            })}
          >
            <Text style={styles.viewBtnText}>Xem lịch hẹn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
          >
            <Text style={styles.homeBtnText}>Về trang chủ</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successCircle: { marginBottom: 16 },
  content: { width: '100%', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 24 },
  infoCard: {
    width: '100%', backgroundColor: Colors.white, borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    marginBottom: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  initials: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  doctorInfo: {},
  doctorName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  doctorSpec: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary, marginLeft: 10 },
  detailValue: { fontSize: 14, color: Colors.text, fontWeight: '600' },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF8E1',
    borderRadius: 12, padding: 12, width: '100%', marginBottom: 24, gap: 8,
  },
  noteText: { flex: 1, fontSize: 13, color: '#F57C00', lineHeight: 18 },
  viewBtn: {
    width: '100%', backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginBottom: 10,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  viewBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  homeBtn: {
    width: '100%', borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  homeBtnText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600' },
});
