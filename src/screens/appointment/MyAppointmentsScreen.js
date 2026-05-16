import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { formatDate, getStatusLabel } from '../../utils/dateUtils';

const TABS = ['Sắp tới', 'Đã khám', 'Đã hủy'];

export default function MyAppointmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const {
    getUpcomingAppointments, getCompletedAppointments, getCancelledAppointments,
  } = useApp();

  const lists = [getUpcomingAppointments(), getCompletedAppointments(), getCancelledAppointments()];
  const data = lists[activeTab];

  const statusConfig = {
    upcoming: { color: Colors.upcoming, bg: Colors.upcomingBg, icon: 'time-outline' },
    completed: { color: Colors.completed, bg: Colors.completedBg, icon: 'checkmark-circle-outline' },
    cancelled: { color: Colors.cancelled, bg: Colors.cancelledBg, icon: 'close-circle-outline' },
  };

  const AppointmentCard = ({ item }) => {
    const cfg = statusConfig[item.status] || statusConfig.upcoming;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AppointmentDetail', { appointment: item })}
      >
        <View style={styles.cardTop}>
          <View style={[styles.avatar, { backgroundColor: item.avatarColor || Colors.primary }]}>
            <Text style={styles.initials}>{item.initials || '?'}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.doctorName}>{item.doctorName}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={12} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.cardBottom}>
          <View style={styles.meta}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
          <View style={styles.meta}>
            <Ionicons name="cash-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{item.fee}</Text>
          </View>
        </View>
        {item.status === 'upcoming' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Reschedule', { appointment: item })}
            >
              <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
              <Text style={styles.actionBtnText}>Đổi lịch</Text>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('AppointmentDetail', { appointment: item })}
            >
              <Ionicons name="eye-outline" size={14} color={Colors.textSecondary} />
              <Text style={[styles.actionBtnText, { color: Colors.textSecondary }]}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === 'completed' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('AppointmentDetail', { appointment: item })}
            >
              <Ionicons name="document-text-outline" size={14} color={Colors.success} />
              <Text style={[styles.actionBtnText, { color: Colors.success }]}>Xem kết quả</Text>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('RateDoctor', { appointment: item })}
            >
              <Ionicons name={item.rating ? 'star' : 'star-outline'} size={14} color="#FFB300" />
              <Text style={[styles.actionBtnText, { color: '#FFB300' }]}>
                {item.rating ? `Đã đánh giá ${item.rating}★` : 'Đánh giá'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch hẹn của tôi</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
            {lists[i].length > 0 && (
              <View style={[styles.tabBadge, activeTab === i && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === i && styles.tabBadgeTextActive]}>
                  {lists[i].length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AppointmentCard item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Chưa có lịch hẹn</Text>
            <Text style={styles.emptyText}>
              {activeTab === 0 ? 'Đặt lịch khám ngay hôm nay!' : 'Không có dữ liệu'}
            </Text>
            {activeTab === 0 && (
              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={() => navigation.navigate('DoctorList', {})}
              >
                <Text style={styles.bookNowText}>Đặt lịch ngay</Text>
              </TouchableOpacity>
            )}
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
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 6 },
  tabActive: { borderBottomWidth: 2.5, borderBottomColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.primary },
  tabBadge: { backgroundColor: Colors.border, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  tabBadgeActive: { backgroundColor: Colors.primaryLight },
  tabBadgeText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700' },
  tabBadgeTextActive: { color: Colors.primary },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
    overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  initials: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  cardInfo: { flex: 1 },
  doctorName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  specialty: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, gap: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: Colors.background, marginHorizontal: 16 },
  cardBottom: { flexDirection: 'row', padding: 12, paddingHorizontal: 16, gap: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.background },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 5 },
  actionDivider: { width: 1, backgroundColor: Colors.background },
  actionBtnText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
  bookNowBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  bookNowText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
