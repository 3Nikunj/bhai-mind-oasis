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
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    let unmounted = false;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (unmounted) return;
        
        if (session?.user) {
          try {
            // Get user profile using setTimeout to avoid deadlock
            setTimeout(async () => {
              if (unmounted) return;
              
              try {
                const { data: profileData, error: profileError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .maybeSingle();
                  
                if (profileError && profileError.code !== 'PGRST116') {
                  console.error('Error fetching profile in auth change handler:', profileError);
                }
                
                if (unmounted) return;
                
                const userData = {
                  id: session.user.id,
                  name: profileData?.name || session.user.user_metadata.name || 'User',
                  email: session.user.email || '',
                  role: profileData?.role || session.user.user_metadata.role || 'patient',
                  isAnonymous: session.user.user_metadata.isAnonymous || false
                };
                
                setUser(userData);
                console.log('User set after auth change:', userData);
                setIsLoading(false);
              } catch (error) {
                console.error('Error in profile fetch timeout:', error);
                if (!unmounted) setIsLoading(false);
              }
            }, 0);
          } catch (error) {
            console.error('Error in auth change handler:', error);
            if (!unmounted) {
              setUser(null);
              setIsLoading(false);
            }
          }
        } else {
          console.log('No user in session, setting user to null');
          if (!unmounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      }
    );

    // Check for existing session
    const checkAuth = async () => {
      try {
        console.log('Checking for existing auth session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (!unmounted) {
            setUser(null);
            setIsLoading(false);
            setAuthInitialized(true);
          }
          return;
        }
        
        if (!session) {
          console.log('No existing session found');
          if (!unmounted) {
            setUser(null);
            setIsLoading(false);
            setAuthInitialized(true);
          }
          return;
        }
        
        console.log('Existing session found');
        
        // The auth state change handler will set the user
        if (!unmounted) {
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (!unmounted) {
          setUser(null);
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    checkAuth();

    return () => {
      console.log('Cleaning up auth subscription');
      unmounted = true;
      subscription.unsubscribe();
    };
  }, []);

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && authInitialized) {
        console.log('Safety timeout: Forcing loading state to complete');
        setIsLoading(false);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timer);
  }, [isLoading, authInitialized]);

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
