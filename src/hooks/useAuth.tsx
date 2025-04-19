
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { registerUser, loginUser, logoutUser, getCurrentUser, createAnonymousUser } from '@/lib/auth';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<User>;
  logout: () => Promise<void>;
  createAnonymous: () => Promise<User>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on component mount
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const user = loginUser(email, password);
      if (user) {
        setUser(user);
      }
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'patient' | 'doctor'
  ): Promise<User> => {
    try {
      const user = registerUser(name, email, password, role);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const createAnonymous = async (): Promise<User> => {
    try {
      const anonUser = createAnonymousUser();
      setUser(anonUser);
      return anonUser;
    } catch (error) {
      console.error('Anonymous registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    createAnonymous
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
