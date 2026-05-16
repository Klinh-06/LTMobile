import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, Alert,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export default function RateDoctorScreen({ navigation, route }) {
  const { appointment } = route.params;
  const { rateAppointment } = useApp();
  const [rating, setRating] = useState(appointment.rating || 0);
  const [comment, setComment] = useState(appointment.comment || '');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const alreadyRated = !!appointment.rating;

  const handleSubmit = async () => {
    if (rating === 0) { Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá'); return; }
    setSaving(true);
    await rateAppointment(appointment.id, rating, comment);
    setSaving(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.inner}>
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
            <Text style={styles.successTitle}>Cảm ơn bạn!</Text>
            <Text style={styles.successText}>Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn</Text>
            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.doneBtnText}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{alreadyRated ? 'Sửa đánh giá' : 'Đánh giá bác sĩ'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.doctorCard}>
              <View style={[styles.avatar, { backgroundColor: appointment.avatarColor || Colors.primary }]}>
                <Text style={styles.initials}>{appointment.initials || '?'}</Text>
              </View>
              <Text style={styles.doctorName}>{appointment.doctorName}</Text>
              <Text style={styles.specialty}>{appointment.specialty}</Text>
            </View>

            <Text style={styles.rateTitle}>Bạn cảm thấy thế nào?</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starBtn}>
                  <Ionicons
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={48}
                    color={i <= rating ? '#FFB300' : Colors.border}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingLabel}>
              {rating === 0 ? 'Chưa đánh giá' :
               rating === 1 ? 'Tệ' :
               rating === 2 ? 'Không hài lòng' :
               rating === 3 ? 'Bình thường' :
               rating === 4 ? 'Hài lòng' : 'Rất hài lòng!'}
            </Text>

            <View style={styles.commentBox}>
              <Text style={styles.commentLabel}>Nhận xét của bạn</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ này..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, saving && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={styles.submitText}>
                {saving ? 'Đang lưu...' : (alreadyRated ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  doctorCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 20, alignItems: 'center',
    marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  initials: { color: Colors.white, fontSize: 24, fontWeight: '700' },
  doctorName: { fontSize: 18, fontWeight: '700', color: Colors.text },
  specialty: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  rateTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 20 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginBottom: 12 },
  starBtn: { padding: 4 },
  ratingLabel: { fontSize: 16, color: Colors.primary, textAlign: 'center', fontWeight: '600', marginBottom: 24 },
  commentBox: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  commentLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 10 },
  commentInput: { fontSize: 14, color: Colors.text, textAlignVertical: 'top', minHeight: 100, padding: 0 },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  successTitle: { fontSize: 28, fontWeight: '700', color: Colors.text },
  successText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  doneBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 40, paddingVertical: 16, marginTop: 8 },
  doneBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
