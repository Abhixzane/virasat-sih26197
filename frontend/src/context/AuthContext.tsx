import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { api } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'virasat_user_profile';
const TOKEN_STORAGE_KEY = 'virasat_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on app boot
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (storedUser && storedToken) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } else {
        // Check if legacy name was stored
        const legacyName = localStorage.getItem('virasat_user_name');
        if (legacyName) {
          const guestUser: User = {
            id: 'usr_guest',
            name: legacyName,
            email: `${legacyName.toLowerCase().replace(/\s+/g, '')}@explorer.in`,
            picture: `https://api.dicebear.com/7.x/initials/svg?seed=${legacyName}&backgroundColor=ff6600`,
            provider: 'guest'
          };
          setUser(guestUser);
        }
      }
    } catch (e) {
      console.warn('Could not restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = (authenticatedUser: User, authToken: string) => {
    setUser(authenticatedUser);
    setToken(authToken);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      localStorage.setItem('virasat_user_name', authenticatedUser.name);
    } catch (e) {
      console.error('Failed to persist session:', e);
    }
  };

  const loginWithGoogle = async (params: {
    credential?: string;
    email?: string;
    name?: string;
    picture?: string;
    google_id?: string;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.googleAuth(params);
      handleAuthSuccess(res.user, res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.emailLogin(email, password);
      handleAuthSuccess(res.user, res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (name: string, email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.emailSignup(name, email, password);
      handleAuthSuccess(res.user, res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem('virasat_user_name');
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  };

  const saveItineraryToAccount = async (itineraryTitle: string) => {
    if (!user) return;
    try {
      const res = await api.saveItineraryToUser(user.id, itineraryTitle);
      if (res.success) {
        const updatedUser = {
          ...user,
          saved_itineraries: res.saved_itineraries
        };
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error('Error saving itinerary to account:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && user.provider !== 'guest'),
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        saveItineraryToAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
