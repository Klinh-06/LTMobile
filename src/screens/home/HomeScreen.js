import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { specialties, doctors } from '../../data/mockData';
import { formatDate } from '../../utils/dateUtils';

export default function HomeScreen({ navigation }) {
  const { user, getUpcomingAppointments, unreadCount } = useApp();
  const upcoming = getUpcomingAppointments().slice(0, 2);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const SpecialtyItem = ({ item }) => {
    const iconMap = { 'Tim mạch': 'heart', 'Nhi khoa': 'people', 'Nội tổng quát': 'medkit', 'Da liễu': 'person', 'Thần kinh': 'flash', 'Xương khớp': 'body', 'Mắt': 'eye', 'Tai Mũi Họng': 'ear' };
    return (
      <TouchableOpacity
        style={styles.specialtyItem}
        onPress={() => navigation.navigate('DoctorList', { specialtyId: item.id, specialtyName: item.name })}
      >
        <View style={[styles.specialtyIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={iconMap[item.name] || 'medical'} size={24} color={item.color} />
        </View>
        <Text style={styles.specialtyName} numberOfLines={2}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const DoctorCard = ({ doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => navigation.navigate('DoctorDetail', { doctor })}
    >
      <View style={[styles.doctorAvatar, { backgroundColor: doctor.avatarColor }]}>
        <Text style={styles.doctorInitials}>{doctor.initials}</Text>
      </View>
      <Text style={styles.doctorName} numberOfLines={1}>{doctor.name}</Text>
      <Text style={styles.doctorSpec} numberOfLines={1}>{doctor.specialty}</Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={12} color="#FFB300" />
        <Text style={styles.rating}>{doctor.rating}</Text>
      </View>
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => navigation.navigate('BookAppointment', { doctor })}
      >
        <Text style={styles.bookBtnText}>Đặt lịch</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const AppointmentCard = ({ appt }) => (
    <TouchableOpacity
      style={styles.apptCard}
      onPress={() => navigation.navigate('AppointmentDetail', { appointment: appt })}
    >
      <View style={styles.apptLeft}>
        <View style={[styles.apptAvatar, { backgroundColor: Colors.primaryLight }]}>
          <Ionicons name="person" size={20} color={Colors.primary} />
        </View>
        <View style={styles.apptInfo}>
          <Text style={styles.apptDoctor} numberOfLines={1}>{appt.doctorName}</Text>
          <Text style={styles.apptSpec}>{appt.specialty}</Text>
          <View style={styles.apptTimeRow}>
            <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.apptTime}> {appt.date} • {appt.time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.apptBadge}>
        <Text style={styles.apptBadgeText}>Sắp tới</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
<ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.fullName || 'Người dùng'} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.white} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('SearchDoctor')}
        >
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.searchText}>Tìm bác sĩ, chuyên khoa...</Text>
        </TouchableOpacity>

        {/* Phone reminder */}
        {!user?.phone && (
          <TouchableOpacity
            style={styles.cccdBanner}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="warning-outline" size={20} color="#F57C00" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cccdBannerTitle}>Hồ sơ chưa đầy đủ</Text>
              <Text style={styles.cccdBannerSub}>Bổ sung số điện thoại để khám thuận tiện hơn</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#F57C00" />
          </TouchableOpacity>
        )}

        {/* Clinic Banner */}
        <TouchableOpacity
          style={styles.banner}
          onPress={() => navigation.navigate('ClinicInfo')}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTag}>Phòng khám</Text>
            <Text style={styles.bannerTitle}>MediCare+ Clinic</Text>
            <Text style={styles.bannerSub}>Chất lượng cao • Đội ngũ chuyên gia</Text>
            <View style={styles.bannerRating}>
              <Ionicons name="star" size={14} color="#FFB300" />
              <Text style={styles.bannerRatingText}>4.8 • 1,250 đánh giá</Text>
            </View>
          </View>
          <View style={styles.bannerRight}>
            <Ionicons name="medical" size={60} color="rgba(255,255,255,0.4)" />
          </View>
        </TouchableOpacity>

        {/* Specialty */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chuyên khoa</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SpecialtyList')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {specialties.map(s => <SpecialtyItem key={s.id} item={s} />)}
          </ScrollView>
        </View>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lịch hẹn sắp tới</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            {upcoming.map(a => <AppointmentCard key={a.id} appt={a} />)}
          </View>
        )}

        {/* Doctors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bác sĩ nổi bật</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorList', {})}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
          </ScrollView>
        </View>

        <View style={{ height: 24 }} />
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
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  userName: { color: Colors.white, fontSize: 20, fontWeight: '700', marginTop: 2 },
  notifBtn: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute', top: 0, right: 0, width: 18, height: 18,
    borderRadius: 9, backgroundColor: Colors.error,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    marginHorizontal: 16, marginTop: -12, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  searchText: { marginLeft: 10, color: Colors.textLight, fontSize: 15 },
  banner: {
    margin: 16, borderRadius: 18, backgroundColor: Colors.primaryDark,
    flexDirection: 'row', overflow: 'hidden', padding: 20,
  },
  bannerLeft: { flex: 1 },
  bannerTag: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  bannerTitle: { color: Colors.white, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 8 },
  bannerRating: { flexDirection: 'row', alignItems: 'center' },
  bannerRatingText: { color: Colors.white, fontSize: 13, marginLeft: 4, fontWeight: '600' },
  bannerRight: { justifyContent: 'center', alignItems: 'center', width: 80 },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  specialtyItem: { alignItems: 'center', marginRight: 16, width: 70 },
  specialtyIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  specialtyName: { fontSize: 11, color: Colors.text, textAlign: 'center', fontWeight: '500', lineHeight: 14 },
  doctorCard: {
    width: 150, marginRight: 12, backgroundColor: Colors.white, borderRadius: 16,
    padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  doctorAvatar: {
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center',
    alignItems: 'center', alignSelf: 'center', marginBottom: 10,
  },
  doctorInitials: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  doctorName: { fontSize: 13, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  doctorSpec: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  rating: { fontSize: 12, color: Colors.text, marginLeft: 3, fontWeight: '600' },
  bookBtn: { backgroundColor: Colors.primaryLight, borderRadius: 8, paddingVertical: 6, alignItems: 'center', marginTop: 10 },
  bookBtnText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  apptCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  apptLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  apptAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  apptInfo: { flex: 1 },
  apptDoctor: { fontSize: 14, fontWeight: '700', color: Colors.text },
  apptSpec: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  apptTimeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  apptTime: { fontSize: 12, color: Colors.textSecondary },
  apptBadge: { backgroundColor: Colors.upcomingBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  apptBadgeText: { color: Colors.primary, fontSize: 11, fontWeight: '700' },
  cccdBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF8E1', marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: 12, padding: 12,
    borderLeftWidth: 4, borderLeftColor: '#F57C00',
  },
  cccdBannerTitle: { fontSize: 13, fontWeight: '700', color: '#E65100' },
  cccdBannerSub: { fontSize: 12, color: '#F57C00', marginTop: 2 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 10 },
  quickItem: {
    width: '47%', backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  quickIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, textAlign: 'center' },
});
