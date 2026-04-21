import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { formatDateLong } from '../../utils/dateUtils';

export default function MedicalRecordsScreen({ navigation }) {
  const { records, passcodeEnabled, recordsUnlocked } = useApp();

  if (passcodeEnabled && !recordsUnlocked) {
    return (
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hồ sơ khám bệnh</Text>
          </View>
          <View style={styles.lockedBody}>
            <View style={styles.lockIconBox}>
              <Ionicons name="lock-closed" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.lockedTitle}>Hồ sơ được bảo vệ</Text>
            <Text style={styles.lockedSub}>Nhập mã PIN để xem hồ sơ khám bệnh của bạn</Text>
            <TouchableOpacity style={styles.unlockBtn} onPress={() => navigation.navigate('PasscodeEntry')}>
              <Ionicons name="keypad-outline" size={18} color={Colors.white} />
              <Text style={styles.unlockBtnText}>Nhập mã PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const RecordCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecordDetail', { record: item })}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconBox}>
          <Ionicons name="document-text" size={24} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <Text style={styles.date}>{formatDateLong(item.date)} • {item.time}</Text>
          <View style={styles.diagnosisRow}>
            <Text style={styles.diagnosisLabel}>Chẩn đoán: </Text>
            <Text style={styles.diagnosisValue} numberOfLines={1}>{item.diagnosis}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ khám bệnh</Text>
        <Text style={styles.headerSub}>{records.length} bản ghi</Text>
      </View>

      {!passcodeEnabled && (
        <TouchableOpacity style={styles.pinBanner} onPress={() => navigation.navigate('SetPasscode')}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#7B1FA2" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.pinBannerTitle}>Bảo vệ hồ sơ của bạn</Text>
            <Text style={styles.pinBannerSub}>Đặt mã PIN để tránh người khác xem hồ sơ bệnh án</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#7B1FA2" />
        </TouchableOpacity>
      )}

      <FlatList
        data={records.slice().reverse()}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <RecordCard item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="document-text-outline" size={60} color={Colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>Chưa có hồ sơ khám</Text>
            <Text style={styles.emptyText}>
              Hồ sơ khám sẽ được tạo tự động sau khi hoàn thành buổi khám
            </Text>
          </View>
        }
      />
        </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  inner: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  iconBox: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  info: { flex: 1 },
  doctorName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  specialty: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  date: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  diagnosisRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  diagnosisLabel: { fontSize: 12, color: Colors.textSecondary },
  diagnosisValue: { fontSize: 12, color: Colors.primary, fontWeight: '600', flex: 1 },
  pinBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3E5F5',
    marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 14,
    borderLeftWidth: 4, borderLeftColor: '#7B1FA2',
  },
  pinBannerTitle: { fontSize: 13, fontWeight: '700', color: '#4A148C', marginBottom: 2 },
  pinBannerSub: { fontSize: 12, color: '#6A1B9A', lineHeight: 17 },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 32, gap: 12 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  lockedBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  lockIconBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  lockedTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  lockedSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  unlockBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, marginTop: 8 },
  unlockBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
