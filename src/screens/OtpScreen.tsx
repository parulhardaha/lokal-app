import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Platform, StyleSheet, Text } from 'react-native';
import { validateOtp, generateOtp } from '../services/otpManager';
import { login } from '../services/auth';

export default function OtpScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [input, setInput] = useState('');
  // Initialize debugCode from navigation params so the OTP generated on the
  // Login screen is visible immediately when arriving at this screen.
  const [debugCode, setDebugCode] = useState<string | null>(
    (route.params && route.params.debugCode) ?? null
  );

  const handleVerify = async () => {
    const result = validateOtp(email, input);

    if (!result.success) {
      if (Platform.OS === 'web' && typeof globalThis !== 'undefined') {
        (globalThis as any).alert(result.message);
      } else {
        Alert.alert(result.message);
      }

      return;
    }

    await login(email);
    navigation.replace('Session');
  };

  const handleResend = () => {
  const newCode = generateOtp(email);
  console.log('Resent OTP:', newCode);
  // keep a visible copy in-app so the generated OTP is visible in the UI
  setDebugCode(newCode);

    if (Platform.OS === 'web' && typeof globalThis !== 'undefined') {
      (globalThis as any).alert('New OTP generated');
      return;
    }

    Alert.alert('New OTP generated');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={input}
        onChangeText={setInput}
        keyboardType="numeric"
      />
      <Button title="Verify OTP" onPress={handleVerify} />
      <View style={{ height: 12 }} />
      <Button title="Resend OTP" onPress={handleResend} />
      {debugCode ? (
        <Text style={styles.debug}>Generated OTP is (only for demo purpose): {debugCode}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  debug: { marginTop: 12, color: 'green', textAlign: 'center' },
});
