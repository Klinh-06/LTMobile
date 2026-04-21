import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { specialties, doctors } from '../../data/mockData';

export default function SpecialtyListScreen({ navigation }) {
  const iconMap = {
    'Tim mạch': 'heart', 'Nhi khoa': 'people', 'Nội tổng quát': 'medkit',
    'Da liễu': 'person', 'Thần kinh': 'flash', 'Xương khớp': 'body',
    'Mắt': 'eye', 'Tai Mũi Họng': 'ear',
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chuyên khoa</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={specialties}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const count = doctors.filter(d => d.specialtyId === item.id).length;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DoctorList', { specialtyId: item.id, specialtyName: item.name })}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={iconMap[item.name] || 'medical'} size={32} color={item.color} />
              </View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.count}>{count} bác sĩ</Text>
              <View style={[styles.badge, { backgroundColor: item.color + '20' }]}>
                <Text style={[styles.badgeText, { color: item.color }]}>Xem ngay</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  grid: { padding: 16, gap: 12 },
  card: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  iconBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  count: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12 },
  badge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
