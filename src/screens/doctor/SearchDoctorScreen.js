import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { doctors, specialties } from '../../data/mockData';

export default function SearchDoctorScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState(null);

  const filtered = doctors.filter(d => {
    const matchSpec = selectedSpec ? d.specialtyId === selectedSpec : true;
    const matchQ = query.length === 0 ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialty.toLowerCase().includes(query.toLowerCase());
    return matchSpec && matchQ;
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm bác sĩ, chuyên khoa..."
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholderTextColor={Colors.textLight}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Specialty Filter */}
      <View>
        <FlatList
          data={[{ id: null, name: 'Tất cả' }, ...specialties]}
          keyExtractor={item => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedSpec === item.id && styles.filterChipActive]}
              onPress={() => setSelectedSpec(item.id)}
            >
              <Text style={[styles.filterText, selectedSpec === item.id && styles.filterTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={styles.resultCount}>{filtered.length} kết quả</Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
          >
            <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
              <Text style={styles.initials}>{item.initials}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.spec}>{item.specialty}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="star" size={12} color="#FFB300" />
                <Text style={styles.meta}> {item.rating}  •  {item.experience}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.fee}>{item.fee}</Text>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('BookAppointment', { doctor: item })}
              >
                <Text style={styles.bookText}>Đặt lịch</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={60} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Không tìm thấy</Text>
            <Text style={styles.emptyText}>Thử từ khóa hoặc chuyên khoa khác</Text>
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
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 12, gap: 10,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  filterList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  filterTextActive: { color: Colors.white, fontWeight: '700' },
  resultCount: { paddingHorizontal: 16, fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  list: { padding: 16, paddingTop: 0, gap: 10 },
  card: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 5, elevation: 3,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  initials: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.text },
  spec: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  meta: { fontSize: 12, color: Colors.textSecondary },
  fee: { fontSize: 12, color: Colors.primary, fontWeight: '600', textAlign: 'right', marginBottom: 6 },
  bookBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  bookText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
