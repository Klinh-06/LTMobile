import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout, appointments, records, unreadCount } = useApp();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, badge, color, rightText }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: (color || Colors.primary) + '15' }]}>
        <Ionicons name={icon} size={20} color={color || Colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {rightText && <Text style={styles.menuRight}>{rightText}</Text>}
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color={Colors.textLight} style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );

  const upcoming = appointments.filter(a => a.status === 'upcoming').length;
  const completed = appointments.filter(a => a.status === 'completed').length;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cá nhân</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.white} />
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: user?.avatarColor || Colors.primary }]}>
            <Text style={styles.initials}>{user?.initials || 'JD'}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'John Doe'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="create-outline" size={16} color={Colors.primary} />
            <Text style={styles.editBtnText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          {[
            { label: 'Lịch sắp tới', value: upcoming, icon: 'calendar', color: Colors.primary },
            { label: 'Đã khám', value: completed, icon: 'checkmark-circle', color: Colors.success },
            { label: 'Hồ sơ', value: records.length, icon: 'document-text', color: '#9C27B0' },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Ionicons name={s.icon} size={20} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="person-outline" label="Thông tin cá nhân" onPress={() => navigation.navigate('EditProfile')} />
            <MenuItem icon="notifications-outline" label="Thông báo" badge={unreadCount} onPress={() => navigation.navigate('Notifications')} />
            <MenuItem icon="settings-outline" label="Cài đặt" onPress={() => navigation.navigate('Settings')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khám bệnh</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="calendar-outline" label="Lịch hẹn của tôi" onPress={() => navigation.navigate('Appointments')} />
            <MenuItem icon="document-text-outline" label="Hồ sơ khám bệnh" onPress={() => navigation.navigate('Records')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="business-outline" label="Về phòng khám" onPress={() => navigation.navigate('ClinicInfo')} color="#4CAF50" />
            <MenuItem icon="help-circle-outline" label="Trợ giúp & FAQ" onPress={() => {}} color="#FF9800" />
            <MenuItem icon="shield-outline" label="Quyền riêng tư" onPress={() => {}} color="#9C27B0" />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 24 }]}>
          <View style={styles.menuCard}>
            <TouchableOpacity style={[styles.menuItem, { borderRadius: 14 }]} onPress={handleLogout}>
              <View style={[styles.menuIcon, { backgroundColor: Colors.cancelledBg }]}>
                <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              </View>
              <Text style={[styles.menuLabel, { color: Colors.error }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 16,
    position: 'relative',
  },
  headerTitle: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  notifBadge: {
    position: 'absolute', top: -4, right: -4, width: 16, height: 16,
    borderRadius: 8, backgroundColor: Colors.error, justifyContent: 'center', alignItems: 'center',
  },
  notifBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '700' },
  profileCard: { backgroundColor: Colors.primary, alignItems: 'center', paddingTop: 20, paddingBottom: 30 },
  avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  initials: { color: Colors.white, fontSize: 32, fontWeight: '700' },
  userName: { color: Colors.white, fontSize: 22, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginTop: 12, gap: 6 },
  editBtnText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  statsCard: { flexDirection: 'row', backgroundColor: Colors.white, margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 22, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.background },
  menuIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuLabel: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  menuRight: { fontSize: 13, color: Colors.textSecondary, marginLeft: 'auto', marginRight: 6 },
  badge: { backgroundColor: Colors.error, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1, marginLeft: 'auto', marginRight: 6 },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
});
