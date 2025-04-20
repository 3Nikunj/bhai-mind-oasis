
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

// Function to register a new user
export const registerUser = async (name: string, email: string, password: string, role: UserRole): Promise<User | null> => {
  try {
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    });

    if (authError) throw authError;
    
    // If user was created successfully, return user data
    if (authData.user) {
      return {
        id: authData.user.id,
        name,
        email,
        role,
        isAnonymous: false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Function to login a user
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    if (data.user) {
      const userData = {
        id: data.user.id,
        name: data.user.user_metadata.name || 'User',
        email: data.user.email || '',
        role: data.user.user_metadata.role || 'patient',
        isAnonymous: false
      };
      
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

// Function to create an anonymous user
export const createAnonymousUser = async (): Promise<User | null> => {
  try {
    // Generate a random email and password for anonymous users
    const randomEmail = `anon_${Math.random().toString(36).substring(2)}@anonymous.bhai`;
    const randomPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    
    // Register anonymous user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email: randomEmail,
      password: randomPassword,
      options: {
        data: {
          name: 'Anonymous User',
          role: 'patient',
          isAnonymous: true
        }
      }
    });

    if (error) throw error;
    
    if (data.user) {
      return {
        id: data.user.id,
        name: 'Anonymous User',
        email: data.user.email || randomEmail,
        role: 'patient',
        isAnonymous: true
      };
    }
    
    return null;
  } catch (error) {
    console.error('Anonymous login error:', error);
    return null;
  }
};

// Function to logout the current user
export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Function to get the current authenticated user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
      const user = data.session.user;
      return {
        id: user.id,
        name: user.user_metadata.name || 'User',
        email: user.email || '',
        role: user.user_metadata.role || 'patient',
        isAnonymous: user.user_metadata.isAnonymous || false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};
