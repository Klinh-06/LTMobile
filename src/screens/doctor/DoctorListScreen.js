import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
  Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { doctors } from '../../data/mockData';

const SORT_OPTIONS = [
  { key: 'default', label: 'Mặc định' },
  { key: 'rating', label: 'Rating cao nhất' },
  { key: 'exp', label: 'Kinh nghiệm nhiều nhất' },
  { key: 'fee_asc', label: 'Phí thấp nhất' },
  { key: 'fee_desc', label: 'Phí cao nhất' },
];

const parseFee = (fee) => parseInt(fee.replace(/\./g, '').replace('đ', ''), 10);
const parseExp = (exp) => parseInt(exp, 10);

const DoctorCard = ({ item, navigation }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
  >
    <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
      <Text style={styles.initials}>{item.initials}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.spec} numberOfLines={1}>{item.specialty}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.meta} numberOfLines={1}> {item.experience}</Text>
        <Text style={styles.dot}>  •  </Text>
        <Ionicons name="star" size={13} color="#FFB300" />
        <Text style={styles.rating}> {item.rating}</Text>
      </View>
      <Text style={styles.fee}>{item.fee} / lần khám</Text>
    </View>
    <TouchableOpacity
      style={styles.bookBtn}
      onPress={() => navigation.navigate('BookAppointment', { doctor: item })}
    >
      <Text style={styles.bookText}>Đặt lịch</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function DoctorListScreen({ navigation, route }) {
  const { specialtyId, specialtyName } = route.params || {};
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('default');
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = doctors.filter(d => {
    const matchSpec = specialtyId ? d.specialtyId === specialtyId : true;
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'rating') return b.rating - a.rating;
    if (sortKey === 'exp') return parseExp(b.experience) - parseExp(a.experience);
    if (sortKey === 'fee_asc') return parseFee(a.fee) - parseFee(b.fee);
    if (sortKey === 'fee_desc') return parseFee(b.fee) - parseFee(a.fee);
    return 0;
  });

  const currentLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label || 'Mặc định';

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{specialtyName || 'Tất cả bác sĩ'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchDoctor')} style={styles.backBtn}>
            <Ionicons name="search" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Search + Filter row */}
        <View style={styles.topRow}>
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm tên bác sĩ..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={Colors.textLight}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="options-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Active sort indicator */}
        {sortKey !== 'default' && (
          <View style={styles.sortBar}>
            <Ionicons name="funnel" size={12} color={Colors.primary} />
            <Text style={styles.sortBarText}>{currentLabel}</Text>
            <TouchableOpacity onPress={() => setSortKey('default')}>
              <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Count */}
        <Text style={styles.count}>Tìm thấy {sorted.length} bác sĩ</Text>

        {/* List */}
        <FlatList
          data={sorted}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <DoctorCard item={item} navigation={navigation} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>Không tìm thấy bác sĩ</Text>
            </View>
          }
        />
      </View>

      {/* Sort Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <Text style={styles.modalTitle}>Sắp xếp theo</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={styles.modalOption}
                onPress={() => { setSortKey(opt.key); setModalVisible(false); }}
              >
                <Text style={[styles.modalOptionText, sortKey === opt.key && styles.modalOptionActive]}>
                  {opt.label}
                </Text>
                {sortKey === opt.key && (
                  <Ionicons name="checkmark" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
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
  topRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
    marginRight: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text, marginLeft: 8 },
  filterBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  sortBar: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 4,
    gap: 4,
  },
  sortBarText: { flex: 1, fontSize: 12, color: Colors.primary, fontWeight: '600' },
  count: { paddingHorizontal: 16, paddingBottom: 4, fontSize: 13, color: Colors.textSecondary },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  initials: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text },
  spec: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexShrink: 1 },
  meta: { fontSize: 12, color: Colors.textSecondary, flexShrink: 1 },
  rating: { fontSize: 12, color: Colors.textSecondary, minWidth: 28 },
  dot: { color: Colors.textLight, flexShrink: 0 },
  fee: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 4 },
  bookBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginLeft: 8 },
  bookText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: Colors.textSecondary, marginTop: 12 },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    backgroundColor: Colors.white, borderRadius: 20, width: 300,
    paddingTop: 20, paddingBottom: 8, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  modalTitle: {
    fontSize: 16, fontWeight: '700', color: Colors.text,
    paddingHorizontal: 20, marginBottom: 12,
  },
  modalOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  modalOptionText: { fontSize: 15, color: Colors.text },
  modalOptionActive: { color: Colors.primary, fontWeight: '700' },
});
