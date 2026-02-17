import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { logout } from '../services/auth';
import { getSession } from '../services/storageService';
import { UserSession } from '../types/type';

export default function SessionScreen({ navigation }: any) {
  const [session, setSession] = useState<UserSession | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSession();
      setSession(data);
    };

    fetchSession();
  }, []);

  // Call hook unconditionally to respect Rules of Hooks. If session is null,
  // useSessionTimer will return "00:00" and not start any intervals.
  const duration = useSessionTimer(session?.startTime ?? null);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  if (!session)
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email: {session.email}</Text>
      <Text style={styles.label}>Login Time: {new Date(session.startTime).toLocaleTimeString()}</Text>
      <Text style={styles.label}>Active For: {duration}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
});
