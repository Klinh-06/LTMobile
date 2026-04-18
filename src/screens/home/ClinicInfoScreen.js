import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { clinicInfo } from '../../data/mockData';

export default function ClinicInfoScreen({ navigation }) {
  const Info = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
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
        <Text style={styles.headerTitle}>Thông tin phòng khám</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.clinicLogoBox}>
            <Ionicons name="medical" size={48} color={Colors.white} />
          </View>
          <Text style={styles.clinicName}>{clinicInfo.name}</Text>
          <View style={styles.ratingRow}>
            {[1,2,3,4,5].map(i => (
              <Ionicons key={i} name={i <= Math.floor(clinicInfo.rating) ? 'star' : 'star-outline'} size={16} color="#FFB300" />
            ))}
            <Text style={styles.ratingText}>{clinicInfo.rating} ({clinicInfo.totalReviews} đánh giá)</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Giới thiệu</Text>
          <Text style={styles.desc}>{clinicInfo.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
          <Info icon="location-outline" label="Địa chỉ" value={clinicInfo.address} />
          <Info icon="call-outline" label="Điện thoại" value={clinicInfo.phone} />
          <Info icon="mail-outline" label="Email" value={clinicInfo.email} />
          <Info icon="globe-outline" label="Website" value={clinicInfo.website} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Giờ hoạt động</Text>
          <View style={styles.hoursRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.hoursText}>{clinicInfo.hours}</Text>
          </View>
        </View>

        <View style={[styles.card, { marginBottom: 24 }]}>
          <Text style={styles.cardTitle}>Dịch vụ nổi bật</Text>
          {['Khám tổng quát', 'Khám chuyên khoa', 'Xét nghiệm', 'Siêu âm', 'Chẩn đoán hình ảnh'].map(s => (
            <View key={s} style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.serviceText}>{s}</Text>
            </View>
          ))}
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
  heroBanner: {
    backgroundColor: Colors.primary, alignItems: 'center',
    paddingTop: 30, paddingBottom: 40,
  },
  clinicLogoBox: {
    width: 90, height: 90, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  clinicName: { color: Colors.white, fontSize: 22, fontWeight: '700', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginLeft: 6 },
  card: {
    backgroundColor: Colors.white, margin: 16, marginBottom: 0, borderRadius: 16,
    padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  desc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  infoIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  hoursRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  hoursText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 22 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  serviceText: { fontSize: 14, color: Colors.text },
});
