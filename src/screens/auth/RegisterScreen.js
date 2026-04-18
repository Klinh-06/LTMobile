import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const Field = ({ label, icon, value, onChangeText, placeholder, keyboardType, secureTextEntry, rightIcon }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={20} color={Colors.textSecondary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        secureTextEntry={!!secureTextEntry}
        autoCapitalize={keyboardType === 'phone-pad' ? 'none' : 'words'}
        placeholderTextColor={Colors.textLight}
      />
      {rightIcon}
    </View>
  </View>
);

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useApp();

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.fullName || !form.phone || !form.password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09)');
      return;
    }
    if (form.password !== form.confirm) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      const result = await register(form);
      if (result === 'exists') {
        Alert.alert('Lỗi', 'Số điện thoại này đã được đăng ký. Vui lòng dùng số khác.');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.topTitle}>Tạo tài khoản</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Đăng ký</Text>
            <Text style={styles.subtitle}>Điền thông tin để tạo tài khoản</Text>

            <Field label="Họ và tên" icon="person-outline" value={form.fullName}
              onChangeText={v => update('fullName', v)} placeholder="Nhập họ và tên" />
            <Field label="Số điện thoại" icon="call-outline" value={form.phone}
              onChangeText={v => update('phone', v)} placeholder="Nhập số điện thoại (10 số)"
              keyboardType="phone-pad" />
            <Field label="Mật khẩu" icon="lock-closed-outline" value={form.password}
              onChangeText={v => update('password', v)} placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              secureTextEntry={!showPw}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPw(p => !p)}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              } />
            <Field label="Xác nhận mật khẩu" icon="shield-checkmark-outline" value={form.confirm}
              onChangeText={v => update('confirm', v)} placeholder="Nhập lại mật khẩu"
              secureTextEntry={!showPw} />

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.7 }]}
              onPress={handleRegister} disabled={loading}
            >
              <Text style={styles.btnText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flexGrow: 1, paddingBottom: 30 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  card: {
    margin: 20, borderRadius: 24, backgroundColor: Colors.white,
    padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: Colors.background,
  },
  inputIcon: { marginRight: 8 },
  input: { paddingVertical: 13, fontSize: 15, color: Colors.text },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});
