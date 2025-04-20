
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { registerUser, loginUser, logoutUser, getCurrentUser, createAnonymousUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<User | null>;
  logout: () => Promise<void>;
  createAnonymous: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            name: session.user.user_metadata.name || 'User',
            email: session.user.email || '',
            role: session.user.user_metadata.role || 'patient',
            isAnonymous: session.user.user_metadata.isAnonymous || false
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      const user = await loginUser(email, password);
      setIsLoading(false);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return null;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'patient' | 'doctor'
  ): Promise<User | null> => {
    try {
      setIsLoading(true);
      const user = await registerUser(name, email, password, role);
      setIsLoading(false);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const createAnonymous = async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const anonUser = await createAnonymousUser();
      setIsLoading(false);
      return anonUser;
    } catch (error) {
      console.error('Anonymous registration error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
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
