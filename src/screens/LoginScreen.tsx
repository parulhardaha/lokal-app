import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Platform, StyleSheet, Text } from 'react-native';
import { generateOtp } from '../services/otpManager';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  const handleSendOtp = () => {
    if (!email) {
      if (Platform.OS === 'web' && typeof globalThis !== 'undefined') {
        (globalThis as any).alert('Enter email');
        return;
      }

      return Alert.alert('Enter email');
    }

    const code = generateOtp(email);
    console.log('Generated OTP:', code);

    // In a real app you'd send code via email/SMS. For dev/demo we pass the code
    // to the OTP screen so it can be displayed in the UI.
    navigation.navigate('Otp', { email, debugCode: code });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passwordless Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send OTP" onPress={handleSendOtp} />
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
});
