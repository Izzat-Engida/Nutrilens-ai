import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { User } from './authSlice';

const AUTH_STORAGE_KEY = 'nutrilens.auth.session';

export interface StoredAuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const canUseSecureStore = Platform.OS !== 'web';

export const saveAuthSession = async (session: StoredAuthSession) => {
  if (!canUseSecureStore) return;
  await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const restoreAuthSession = async (): Promise<StoredAuthSession | null> => {
  if (!canUseSecureStore) return null;

  const storedSession = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession) as Partial<StoredAuthSession>;
    if (
      typeof session.accessToken !== 'string' ||
      typeof session.refreshToken !== 'string' ||
      !session.user ||
      typeof session.user.id !== 'number' ||
      typeof session.user.email !== 'string'
    ) {
      return null;
    }
    return session as StoredAuthSession;
  } catch {
    return null;
  }
};

export const clearAuthSession = async () => {
  if (!canUseSecureStore) return;
  await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
};
