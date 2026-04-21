import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { getRegisteredUsers } from '../../utils/storage';

export default function ForgotPasswordScreen({ navigation }) {
  const [cccd, setCccd] = useState('');
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useApp();

  const handleCheckCccd = async () => {
    if (!cccd || cccd.trim().length !== 12) {
      Alert.alert('Lỗi', 'Vui lòng nhập đúng 12 số CCCD');
      return;
    }
    if (cccd.trim() === '079190012345') {
      Alert.alert('Không thể đặt lại', 'Tài khoản demo không hỗ trợ đặt lại mật khẩu.');
      return;
    }
    const users = await getRegisteredUsers().catch(() => []);
    const found = users.find(u => u.cccd === cccd.trim());
    if (!found) {
      Alert.alert('Không tìm thấy', 'CCCD này chưa được đăng ký.');
      return;
    }
    setStep(2);
  };

  const handleReset = async () => {
    if (!newPassword || !confirm) { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ'); return; }
    if (newPassword.length < 6) { Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự'); return; }
    if (newPassword !== confirm) { Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    const ok = await resetPassword(cccd, newPassword);
    setLoading(false);
    if (ok) setStep(3);
    else Alert.alert('Lỗi', 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.topTitle}>Quên mật khẩu</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            {step === 1 && (
              <>
                <View style={styles.iconBox}>
                  <Ionicons name="lock-open-outline" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.title}>Khôi phục mật khẩu</Text>
                <Text style={styles.subtitle}>Nhập số CCCD đã đăng ký để đặt lại mật khẩu</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Số CCCD / CMND</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="card-outline" size={20} color={Colors.textSecondary} style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Nhập 12 số CCCD" value={cccd}
                      onChangeText={setCccd} keyboardType="number-pad" maxLength={12}
                      placeholderTextColor={Colors.textLight} />
                  </View>
                </View>
                <TouchableOpacity style={styles.btn} onPress={handleCheckCccd}>
                  <Text style={styles.btnText}>Tiếp tục</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <View style={styles.iconBox}>
                  <Ionicons name="key-outline" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.title}>Đặt mật khẩu mới</Text>
                <Text style={styles.subtitle}>CCCD: {cccd}</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mật khẩu mới</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.icon} />
                    <TextInput style={[styles.input, { flex: 1 }]} placeholder="Tối thiểu 6 ký tự"
                      value={newPassword} onChangeText={setNewPassword} secureTextEntry={!showPw}
                      placeholderTextColor={Colors.textLight} />
                    <TouchableOpacity onPress={() => setShowPw(p => !p)}>
                      <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Xác nhận mật khẩu</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textSecondary} style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Nhập lại mật khẩu mới"
                      value={confirm} onChangeText={setConfirm} secureTextEntry={!showPw}
                      placeholderTextColor={Colors.textLight} />
                  </View>
                </View>
                <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleReset} disabled={loading}>
                  <Text style={styles.btnText}>{loading ? 'Đang lưu...' : 'Đặt lại mật khẩu'}</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 3 && (
              <>
                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
                </View>
                <Text style={styles.title}>Thành công!</Text>
                <Text style={styles.subtitle}>Mật khẩu đã được đặt lại. Hãy đăng nhập bằng mật khẩu mới.</Text>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.btnText}>Đăng nhập ngay</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  card: { margin: 20, borderRadius: 24, backgroundColor: Colors.white, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  iconBox: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, backgroundColor: Colors.background },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: Colors.text },
  btn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
