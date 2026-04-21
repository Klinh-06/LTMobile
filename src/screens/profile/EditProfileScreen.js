import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const Field = ({ label, icon, value, onChangeText, placeholder, keyboardType, editable }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.fieldInput, editable === false && styles.fieldDisabled]}>
      <Ionicons name={icon} size={18} color={Colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType || 'default'}
        editable={editable !== false}
        placeholderTextColor={Colors.textLight}
      />
    </View>
  </View>
);

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useApp();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    bloodType: user?.bloodType || '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống');
      return;
    }
    if (form.dateOfBirth) {
      const match = form.dateOfBirth.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (!match) {
        Alert.alert('Lỗi', 'Ngày sinh không đúng định dạng\nVí dụ: 20-08-1995');
        return;
      }
      const [, d, m, y] = match.map(Number);
      const date = new Date(y, m - 1, d);
      const now = new Date();
      if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d
          || date > now || y < 1900) {
        Alert.alert('Lỗi', 'Ngày sinh không hợp lệ');
        return;
      }
    }
    setLoading(true);
    await updateUser(form);
    setLoading(false);
    Alert.alert('Thành công', 'Thông tin đã được cập nhật!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: user?.avatarColor || Colors.primary }]}>
              <Text style={styles.initials}>{user?.initials || 'JD'}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
            <Field label="Họ và tên" icon="person-outline" value={form.fullName}
              onChangeText={v => update('fullName', v)} placeholder="Nhập họ tên" />
            <Field label="Số CCCD" icon="card-outline" value={user?.cccd || ''}
              placeholder="CCCD dùng để đăng nhập" editable={false} />
            <Field label="Số điện thoại" icon="call-outline" value={form.phone}
              onChangeText={v => update('phone', v)} placeholder="Nhập số điện thoại"
              keyboardType="phone-pad" />
            <Field label="Ngày sinh" icon="calendar-outline" value={form.dateOfBirth}
              onChangeText={v => {
                const digits = v.replace(/\D/g, '').slice(0, 8);
                let formatted = digits;
                if (digits.length > 2) formatted = digits.slice(0,2) + '-' + digits.slice(2);
                if (digits.length > 4) formatted = digits.slice(0,2) + '-' + digits.slice(2,4) + '-' + digits.slice(4);
                update('dateOfBirth', formatted);
              }}
              placeholder="VD: 20-08-1995" keyboardType="number-pad" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin y tế</Text>
            <Text style={styles.fieldLabel}>Giới tính</Text>
            <View style={styles.genderRow}>
              {['Nam', 'Nữ', 'Khác'].map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
                  onPress={() => update('gender', g)}
                >
                  <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Nhóm máu</Text>
            <View style={styles.bloodRow}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                <TouchableOpacity
                  key={b}
                  style={[styles.bloodBtn, form.bloodType === b && styles.bloodBtnActive]}
                  onPress={() => update('bloodType', b)}
                >
                  <Text style={[styles.bloodText, form.bloodType === b && styles.bloodTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
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
  container: { padding: 16, paddingBottom: 30 },
  avatarSection: { alignItems: 'center', marginBottom: 20, position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  initials: { color: Colors.white, fontSize: 32, fontWeight: '700' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: '50%', marginRight: -45+30,
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  fieldInput: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, backgroundColor: Colors.background, gap: 8,
  },
  fieldDisabled: { backgroundColor: Colors.background, opacity: 0.7 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.text },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center' },
  genderBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  genderTextActive: { color: Colors.white },
  bloodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  bloodBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border },
  bloodBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  bloodText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  bloodTextActive: { color: Colors.white },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
