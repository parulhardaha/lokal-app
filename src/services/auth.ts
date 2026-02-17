import { UserSession } from '../types/type';
import { saveSession, getSession, clearSession } from './storageService';

export const checkLoginStatus = async (): Promise<UserSession | null> => {
  return await getSession();
};

export const login = async (email: string): Promise<UserSession> => {
  const session: UserSession = {
    email,
    startTime: Date.now(),
  };

  await saveSession(session);
  return session;
};

export const logout = async () => {
  await clearSession();
};
