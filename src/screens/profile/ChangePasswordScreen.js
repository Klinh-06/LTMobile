import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const PwInput = ({ label, value, onChangeText, show, onToggle, placeholder }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrap}>
      <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.icon} />
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!show}
        placeholderTextColor={Colors.textLight}
      />
      <TouchableOpacity onPress={onToggle}>
        <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  </View>
);

export default function ChangePasswordScreen({ navigation }) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const { changePassword } = useApp();

  const handleSubmit = async () => {
    if (!oldPw || !newPw || !confirm) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPw !== confirm) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPw === oldPw) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }
    setLoading(true);
    const result = await changePassword(oldPw, newPw);
    setLoading(false);
    if (result === 'wrong') {
      Alert.alert('Sai mật khẩu', 'Mật khẩu hiện tại không đúng. Vui lòng thử lại.');
    } else if (result === 'demo') {
      Alert.alert('Thông báo', 'Tài khoản demo không thể đổi mật khẩu.');
    } else {
      Alert.alert('Thành công', 'Mật khẩu đã được đổi thành công.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="shield-checkmark-outline" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.desc}>
                Mật khẩu mới phải có ít nhất 6 ký tự và khác mật khẩu hiện tại.
              </Text>

              <PwInput
                label="Mật khẩu hiện tại"
                value={oldPw}
                onChangeText={setOldPw}
                show={showOld}
                onToggle={() => setShowOld(p => !p)}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <PwInput
                label="Mật khẩu mới"
                value={newPw}
                onChangeText={setNewPw}
                show={showNew}
                onToggle={() => setShowNew(p => !p)}
                placeholder="Nhập mật khẩu mới"
              />
              <PwInput
                label="Xác nhận mật khẩu mới"
                value={confirm}
                onChangeText={setConfirm}
                show={showNew}
                onToggle={() => setShowNew(p => !p)}
                placeholder="Nhập lại mật khẩu mới"
              />

              <TouchableOpacity
                style={[styles.btn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.btnText}>{loading ? 'Đang lưu...' : 'Xác nhận đổi mật khẩu'}</Text>
              </TouchableOpacity>
            </View>
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
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  iconBox: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 14,
  },
  desc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: Colors.background,
  },
  icon: { marginRight: 8 },
  input: { paddingVertical: 13, fontSize: 15, color: Colors.text },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
