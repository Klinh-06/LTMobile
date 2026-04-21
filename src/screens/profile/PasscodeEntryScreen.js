import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const PIN_LENGTH = 6;
const MAX_ATTEMPTS = 5;

export default function PasscodeEntryScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const { verifyPasscode } = useApp();

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 12, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = (digit) => {
    if (pin.length >= PIN_LENGTH) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === PIN_LENGTH) {
      setTimeout(() => handleComplete(newPin), 100);
    }
  };

  const handleDelete = () => setPin(p => p.slice(0, -1));

  const handleComplete = async (completed) => {
    const ok = await verifyPasscode(completed);
    if (ok) {
      navigation.goBack();
    } else {
      shake();
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      if (newAttempts >= MAX_ATTEMPTS) {
        Alert.alert('Quá nhiều lần thử', 'Bạn đã nhập sai quá 5 lần. Vui lòng thử lại sau.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    }
  };

  const remaining = MAX_ATTEMPTS - attempts;
  const dots = Array(PIN_LENGTH).fill(0).map((_, i) => (
    <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
  ));

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nhập mã PIN</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.lockIcon}>
            <Ionicons name="lock-closed" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Nhập mã PIN để xem hồ sơ</Text>

          <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
            {dots}
          </Animated.View>

          {attempts > 0 && (
            <Text style={styles.attemptsText}>
              Sai mã PIN — còn {remaining} lần thử
            </Text>
          )}

          <View style={styles.keypad}>
            {keys.map((row, ri) => (
              <View key={ri} style={styles.keyRow}>
                {row.map((k, ki) => (
                  k === '' ? <View key={ki} style={styles.keyEmpty} /> :
                  k === 'del' ? (
                    <TouchableOpacity key={ki} style={styles.keyBtn} onPress={handleDelete}>
                      <Ionicons name="backspace-outline" size={24} color={Colors.text} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity key={ki} style={styles.keyBtn} onPress={() => handlePress(k)}>
                      <Text style={styles.keyText}>{k}</Text>
                    </TouchableOpacity>
                  )
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  inner: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  body: { flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: 24 },
  lockIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 32 },
  dotsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: Colors.primary, backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: Colors.primary },
  attemptsText: { fontSize: 13, color: Colors.error, marginBottom: 16, textAlign: 'center' },
  keypad: { marginTop: 16, width: '100%', maxWidth: 300 },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  keyBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  keyEmpty: { width: 80, height: 80 },
  keyText: { fontSize: 28, fontWeight: '600', color: Colors.text },
});
