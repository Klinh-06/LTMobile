import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const REVIEW_POOL = [
  { name: 'Minh Tuấn', stars: 5, comment: 'Bác sĩ giải thích rất dễ hiểu, không bị cảm giác bị qua loa. Lần đầu khám ở đây mà rất ưng 👍' },
  { name: 'Lan Phương', stars: 5, comment: 'Khám xong hiểu bệnh của mình hơn nhiều. Bác sĩ không có thái độ coi thường bệnh nhân như mấy chỗ khác.' },
  { name: 'Hoàng Anh', stars: 4, comment: 'Chuyên môn ổn, giải thích cụ thể. Chờ hơi lâu một chút nhưng chấp nhận được.' },
  { name: 'Thu Hà', stars: 5, comment: 'Đã đặt lịch mấy lần rồi. Bác sĩ nhớ cả bệnh sử của mình, không cần kể lại từ đầu mỗi lần, rất tiện.' },
  { name: 'Quốc Việt', stars: 3, comment: 'Khám được, không có gì đặc biệt. Toa thuốc hơi nhiều loại, cảm giác kê hơi dư.' },
  { name: 'Bảo Ngọc', stars: 5, comment: 'Con mình 3 tuổi hay quấy khóc khi khám nhưng bác sĩ rất kiên nhẫn dỗ bé. Cảm ơn bác sĩ nhiều lắm ạ!' },
  { name: 'Thanh Long', stars: 4, comment: 'Bác sĩ oke, nói chuyện thân thiện không khô khan. Phòng khám sạch sẽ thoáng mát.' },
  { name: 'Yến Nhi', stars: 5, comment: 'Mình bị đau mãn tính mấy năm, đi nhiều nơi rồi mà chỗ này mới tìm được nguyên nhân. Rất biết ơn bác sĩ!' },
  { name: 'Đức Hải', stars: 4, comment: 'Ok lắm. Lần sau chắc vẫn quay lại. Chỉ hơi tiếc là đặt lịch sáng sớm hết nhanh quá.' },
  { name: 'Kim Anh', stars: 5, comment: 'Bác sĩ hỏi thăm rất kỹ trước khi kê đơn, không vội vàng. Cảm giác được quan tâm thật sự chứ không phải cho xong.' },
  { name: 'Trung Kiên', stars: 3, comment: 'Khám ổn nhưng mình hỏi thêm thì bác sĩ có vẻ bận. Hy vọng lần sau sẽ có thêm thời gian trao đổi hơn.' },
  { name: 'Hồng Vân', stars: 5, comment: 'Lần đầu đi khám mà không thấy lo lắng gì cả vì bác sĩ giải thích từng bước rõ ràng. Rất an tâm.' },
  { name: 'Phú Lộc', stars: 4, comment: 'Tư vấn nhiệt tình, không bị cảm giác bị đuổi ra nhanh. Sẽ giới thiệu cho người thân.' },
  { name: 'Thảo Vy', stars: 5, comment: 'Ba mình 70 tuổi, bác sĩ nói chuyện từ tốn với ông rất dễ chịu. Cảm ơn vì đã chăm sóc người lớn tuổi chu đáo.' },
  { name: 'Minh Châu', stars: 4, comment: 'Được khám kỹ, không vội. Đơn thuốc có giải thích rõ uống như thế nào, mấy chỗ khác hiếm khi làm vậy.' },
  { name: 'Văn Thắng', stars: 2, comment: 'Khám hơi nhanh, cảm giác chưa nói hết thì bác sĩ đã kết luận rồi. Mong lần sau bác sĩ lắng nghe bệnh nhân nhiều hơn.' },
  { name: 'Diễm My', stars: 5, comment: 'Đặt lịch dễ, đúng giờ, không phải chờ lâu. Bác sĩ dễ gần, mình không ngại hỏi gì cả.' },
  { name: 'Anh Khôi', stars: 4, comment: 'Mình hay hồi hộp khi gặp bác sĩ nhưng hôm nay cảm thấy thoải mái. Giải thích bệnh dễ hiểu, không dùng từ khó.' },
  { name: 'Tố Uyên', stars: 5, comment: 'Đã theo bác sĩ này mấy năm rồi. Không cần phải nói nhiều, rất tin tưởng 🙏' },
  { name: 'Bình An', stars: 3, comment: 'Bác sĩ giỏi nhưng hôm đó phòng chờ đông quá, đợi gần 1 tiếng. Mong cải thiện khâu sắp xếp lịch hơn.' },
];

const pickReviews = (doctorId) => {
  const num = parseInt(doctorId.replace('d', ''), 10) || 1;
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(REVIEW_POOL[(num * 3 + i * 7) % REVIEW_POOL.length]);
  }
  return result;
};

const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={16} color={Colors.primary} style={{ width: 22 }} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

export default function DoctorDetailScreen({ navigation, route }) {
  const { doctor } = route.params;
  const dayLabels = { Mon: 'T2', Tue: 'T3', Wed: 'T4', Thu: 'T5', Fri: 'T6', Sat: 'T7', Sun: 'CN' };
  const currentYear = new Date().getFullYear();
  const age = doctor.birthYear ? currentYear - doctor.birthYear : null;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin bác sĩ</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={[styles.avatar, { backgroundColor: doctor.avatarColor }]}>
              <Text style={styles.initials}>{doctor.initials}</Text>
            </View>
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.spec}>{doctor.specialty}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{doctor.experience}</Text>
                <Text style={styles.statLabel}>Kinh nghiệm</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{doctor.rating}</Text>
                <Text style={styles.statLabel}>Đánh giá</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{doctor.totalReviews}</Text>
                <Text style={styles.statLabel}>Bệnh nhân</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Giới thiệu</Text>
            <Text style={styles.bio}>{doctor.bio}</Text>
          </View>

          {/* Credentials */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin chuyên môn</Text>
            {age && (
              <InfoRow icon="person-outline" text={`Sinh năm ${doctor.birthYear} (${age} tuổi)`} />
            )}
            {(doctor.education || []).map((e, i) => (
              <InfoRow key={i} icon="school-outline" text={e} />
            ))}
            {(doctor.certifications || []).map((c, i) => (
              <InfoRow key={i} icon="ribbon-outline" text={c} />
            ))}
          </View>

          {/* Work history */}
          {(doctor.hospitals || []).length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kinh nghiệm làm việc</Text>
              {doctor.hospitals.map((h, i) => (
                <InfoRow key={i} icon="business-outline" text={h} />
              ))}
            </View>
          )}

          {/* Awards */}
          {(doctor.awards || []).length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Thành tích & Giải thưởng</Text>
              {doctor.awards.map((a, i) => (
                <InfoRow key={i} icon="trophy-outline" text={a} />
              ))}
            </View>
          )}

          {/* Fee */}
          <View style={styles.card}>
            <View style={styles.feeRow}>
              <View>
                <Text style={styles.cardTitle}>Phí khám</Text>
                <Text style={styles.feeValue}>{doctor.fee}</Text>
              </View>
              <Ionicons name="cash-outline" size={32} color={Colors.primary} />
            </View>
          </View>

          {/* Schedule */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lịch làm việc</Text>
            {Object.entries(doctor.schedule).map(([day, times]) => (
              <View key={day} style={styles.dayRow}>
                <Text style={styles.dayLabel}>{dayLabels[day] || day}</Text>
                <View style={styles.timesWrap}>
                  {times.slice(0, 4).map(t => (
                    <View key={t} style={styles.timeChip}>
                      <Text style={styles.timeText}>{t}</Text>
                    </View>
                  ))}
                  {times.length > 4 && (
                    <View style={[styles.timeChip, { backgroundColor: Colors.background }]}>
                      <Text style={[styles.timeText, { color: Colors.textSecondary }]}>+{times.length - 4}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Reviews */}
          <View style={[styles.card, { marginBottom: 100 }]}>
            <Text style={styles.cardTitle}>Đánh giá</Text>
            <View style={styles.ratingBig}>
              <Text style={styles.ratingNum}>{doctor.rating}</Text>
              <View>
                <View style={{ flexDirection: 'row' }}>
                  {[1,2,3,4,5].map(i => (
                    <Ionicons key={i} name={i <= Math.floor(doctor.rating) ? 'star' : 'star-outline'} size={18} color="#FFB300" />
                  ))}
                </View>
                <Text style={styles.reviewCount}>{doctor.totalReviews} đánh giá</Text>
              </View>
            </View>
            <View style={styles.reviewDivider} />
            {pickReviews(doctor.id).map((r, i) => (
              <View key={i} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <Ionicons key={s} name={s <= r.stars ? 'star' : 'star-outline'} size={12} color="#FFB300" />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={styles.bookBarWrap}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate('BookAppointment', { doctor })}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.bookBtnText}>Đặt lịch khám</Text>
          </TouchableOpacity>
        </View>
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
  profileCard: {
    backgroundColor: Colors.primary, alignItems: 'center', paddingTop: 24, paddingBottom: 30,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  initials: { color: Colors.white, fontSize: 30, fontWeight: '700' },
  name: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  spec: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 24, gap: 20,
  },
  stat: { alignItems: 'center' },
  statValue: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  card: {
    backgroundColor: Colors.white, margin: 16, marginBottom: 0, borderRadius: 16,
    padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  bio: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  infoText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginLeft: 8 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feeValue: { fontSize: 22, fontWeight: '700', color: Colors.primary },
  dayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dayLabel: { width: 32, fontSize: 13, fontWeight: '700', color: Colors.text },
  timesWrap: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeChip: { backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  timeText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  ratingBig: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ratingNum: { fontSize: 48, fontWeight: '700', color: Colors.text },
  reviewCount: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  reviewDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
  reviewItem: { marginBottom: 14 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  reviewName: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  reviewComment: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, paddingLeft: 44 },
  bookBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, padding: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  bookBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  bookBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
