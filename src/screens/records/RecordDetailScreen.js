import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { formatDateLong } from '../../utils/dateUtils';

export default function RecordDetailScreen({ navigation, route }) {
  const { record } = route.params;

  const Section = ({ title, icon, children }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconBox}>
          <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'Chưa cập nhật'}</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết hồ sơ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="document-text" size={36} color={Colors.white} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle}>Hồ sơ khám bệnh</Text>
            <Text style={styles.heroDate}>{formatDateLong(record.date)}</Text>
            <Text style={styles.heroTime}>{record.time}</Text>
          </View>
        </View>

        <Section title="Thông tin bác sĩ" icon="person-circle-outline">
          <InfoRow label="Bác sĩ" value={record.doctorName} />
          <InfoRow label="Chuyên khoa" value={record.specialty} />
        </Section>

        <Section title="Chẩn đoán" icon="medical-outline">
          <Text style={styles.contentText}>{record.diagnosis}</Text>
        </Section>

        <Section title="Đơn thuốc" icon="flask-outline">
          <Text style={styles.contentText}>{record.prescription}</Text>
        </Section>

        <Section title="Ghi chú bác sĩ" icon="create-outline">
          <Text style={styles.contentText}>{record.notes}</Text>
        </Section>

        <View style={[styles.card, { marginBottom: 24 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.warning} />
            </View>
            <Text style={styles.cardTitle}>Lưu ý</Text>
          </View>
          <Text style={styles.noteText}>
            Tái khám theo lịch hẹn. Nếu có triệu chứng bất thường, liên hệ ngay phòng khám.
          </Text>
          <TouchableOpacity style={styles.clinicBtn}>
            <Ionicons name="call-outline" size={16} color={Colors.primary} />
            <Text style={styles.clinicBtnText}>Liên hệ phòng khám</Text>
          </TouchableOpacity>
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
  heroCard: {
    backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center',
    padding: 20,
  },
  heroIcon: {
    width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  heroInfo: {},
  heroTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  heroDate: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  heroTime: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  card: {
    backgroundColor: Colors.white, margin: 16, marginBottom: 0, borderRadius: 16,
    padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardIconBox: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.background,
  },
  infoLabel: { fontSize: 13, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  contentText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  noteText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 12 },
  clinicBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10,
    paddingVertical: 10, gap: 6,
  },
  clinicBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
});
