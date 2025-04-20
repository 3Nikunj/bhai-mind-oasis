
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { registerUser, loginUser, logoutUser, getCurrentUser, createAnonymousUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

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
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setIsLoading(true);
        
        if (session?.user) {
          try {
            // Get user details including profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching profile in auth change handler:', profileError);
            }
            
            const userData = {
              id: session.user.id,
              name: profileData?.name || session.user.user_metadata.name || 'User',
              email: session.user.email || '',
              role: profileData?.role || session.user.user_metadata.role || 'patient',
              isAnonymous: session.user.user_metadata.isAnonymous || false
            };
            
            setUser(userData);
            console.log('User set after auth change:', userData);
          } catch (error) {
            console.error('Error in auth change handler:', error);
            setUser(null);
          }
        } else {
          console.log('No user in session, setting user to null');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const checkAuth = async () => {
      try {
        console.log('Checking for existing auth session');
        const currentUser = await getCurrentUser();
        console.log('Current user from check:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      const user = await loginUser(email, password);
      if (user) {
        toast.success('Logged in successfully');
      }
      return user;
    } catch (error: any) {
      console.error('Login error in hook:', error);
      toast.error(error.message || 'Failed to login');
      return null;
    } finally {
      setIsLoading(false);
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
      if (user) {
        toast.success('Account created successfully');
      }
      return user;
    } catch (error: any) {
      console.error('Registration error in hook:', error);
      toast.error(error.message || 'Failed to register');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createAnonymous = async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const anonUser = await createAnonymousUser();
      if (anonUser) {
        toast.success('Continuing anonymously');
      }
      return anonUser;
    } catch (error: any) {
      console.error('Anonymous login error in hook:', error);
      toast.error(error.message || 'Failed to continue anonymously');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error in hook:', error);
      toast.error(error.message || 'Failed to logout');
    } finally {
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
