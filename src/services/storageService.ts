import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSession } from '../types/type';

const SESSION_KEY = 'user_session';

export const saveSession = async (session: UserSession) => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // optionally handle error
    console.warn('Failed to save session', e);
  }
};

export const getSession = async (): Promise<UserSession | null> => {
  try {
    const data = await AsyncStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Failed to read session', e);
    return null;
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn('Failed to clear session', e);
  }
};
