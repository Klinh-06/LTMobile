import React from 'react';
import {
  View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Alert } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const { settings, updateSettings, passcodeEnabled, disablePasscode } = useApp();

  const ToggleItem = ({ icon, title, subtitle, value, onToggle, iconColor }) => (
    <View style={styles.item}>
      <View style={[styles.itemIcon, { backgroundColor: (iconColor || Colors.primary) + '15' }]}>
        <Ionicons name={icon} size={20} color={iconColor || Colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSub}>{subtitle}</Text>
      </View>
      <Switch
        value={!!value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );

  const LinkItem = ({ icon, title, value, onPress, iconColor }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.itemIcon, { backgroundColor: (iconColor || Colors.primary) + '15' }]}>
        <Ionicons name={icon} size={20} color={iconColor || Colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {value && <Text style={styles.itemValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THÔNG BÁO</Text>
          <View style={styles.card}>
            <ToggleItem
              icon="notifications" title="Push Notifications"
              subtitle="Nhận nhắc lịch khám"
              value={settings.pushNotifications}
              onToggle={v => updateSettings({ pushNotifications: v })}
              iconColor="#2196F3"
            />
            <View style={styles.divider} />
            <ToggleItem
              icon="mail" title="Email Notifications"
              subtitle="Nhận cập nhật qua email"
              value={settings.emailNotifications}
              onToggle={v => updateSettings({ emailNotifications: v })}
              iconColor="#4CAF50"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BẢO MẬT</Text>
          <View style={styles.card}>
            <LinkItem
              icon="keypad" title="Mã PIN hồ sơ bệnh án"
              value={passcodeEnabled ? 'Đang bật' : 'Tắt'}
              onPress={() => navigation.navigate('SetPasscode')}
              iconColor="#9C27B0"
            />
            {passcodeEnabled && (
              <>
                <View style={styles.divider} />
                <LinkItem
                  icon="lock-open" title="Tắt mã PIN"
                  onPress={() => Alert.alert('Tắt mã PIN', 'Bạn có chắc muốn tắt bảo vệ hồ sơ?', [
                    { text: 'Không', style: 'cancel' },
                    { text: 'Tắt', style: 'destructive', onPress: disablePasscode },
                  ])}
                  iconColor="#F44336"
                />
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
          <View style={styles.card}>
            <LinkItem icon="lock-closed" title="Đổi mật khẩu" onPress={() => navigation.navigate('ChangePassword')} iconColor="#F44336" />
            <View style={styles.divider} />
            <LinkItem icon="language" title="Ngôn ngữ" value={settings.language || 'Tiếng Việt'} onPress={() => {}} iconColor="#FF9800" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HỖ TRỢ</Text>
          <View style={styles.card}>
            <LinkItem icon="help-circle" title="Câu hỏi thường gặp" onPress={() => {}} iconColor="#03A9F4" />
            <View style={styles.divider} />
            <LinkItem icon="chatbubble-ellipses" title="Liên hệ hỗ trợ" onPress={() => {}} iconColor="#4CAF50" />
            <View style={styles.divider} />
            <LinkItem icon="star" title="Đánh giá ứng dụng" onPress={() => {}} iconColor="#FFB300" />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>VỀ ỨNG DỤNG</Text>
          <View style={styles.card}>
            <LinkItem icon="information-circle" title="Phiên bản" value="1.0.0" onPress={() => {}} iconColor={Colors.primary} />
            <View style={styles.divider} />
            <LinkItem icon="document-text" title="Điều khoản sử dụng" onPress={() => {}} iconColor={Colors.textSecondary} />
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
    overflow: 'hidden',
  },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  itemIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '500', color: Colors.text },
  itemSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  itemValue: { fontSize: 14, color: Colors.textSecondary, marginRight: 6 },
  divider: { height: 1, backgroundColor: Colors.background, marginLeft: 68 },
});
