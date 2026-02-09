import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USER_KEY = '@auth_user';
const STORAGE_CREDENTIALS_KEY = '@auth_credentials';

type StoredCredentials = {
  name: string;
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser) as User);
        }
      } catch (error) {
        console.warn('Failed to restore user from storage', error);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const persistUser = useCallback(async (nextUser: User | null) => {
    if (nextUser) {
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_USER_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const storedCredentials = await AsyncStorage.getItem(STORAGE_CREDENTIALS_KEY);

      if (!storedCredentials) {
        throw new Error('No user found. Please sign up first.');
      }

      const credentials = JSON.parse(storedCredentials) as StoredCredentials;

      if (credentials.email !== email || credentials.password !== password) {
        throw new Error('Incorrect email or password.');
      }

      const nextUser: User = { name: credentials.name, email: credentials.email };
      setUser(nextUser);
      await persistUser(nextUser);
    },
    [persistUser],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const credentials: StoredCredentials = { name, email, password };
      await AsyncStorage.setItem(STORAGE_CREDENTIALS_KEY, JSON.stringify(credentials));

      const nextUser: User = { name, email };
      setUser(nextUser);
      await persistUser(nextUser);
    },
    [persistUser],
  );

  const logout = useCallback(async () => {
    setUser(null);
    await persistUser(null);
  }, [persistUser]);

  const value: AuthContextValue = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

