
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

// Function to register a new user
export const registerUser = async (name: string, email: string, password: string, role: UserRole): Promise<User | null> => {
  try {
    console.log('Registering user:', { name, email, role });
    
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

    if (authError) {
      console.error('Auth error during registration:', authError);
      throw authError;
    }
    
    // If user was created successfully, create profile in the profiles table
    if (authData.user) {
      console.log('User registered successfully with ID:', authData.user.id);
      
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name,
            email,
            role
          });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here - we want to return the user even if profile creation fails
        }
      } catch (profileErr) {
        console.error('Profile creation exception:', profileErr);
      }
      
      return {
        id: authData.user.id,
        name,
        email,
        role,
        isAnonymous: false
      };
    }
    
    console.log('No user data returned from registration');
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Function to login a user
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('Logging in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    
    if (data.user) {
      console.log('User logged in successfully:', data.user.id);
      
      // Get user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }
      
      const userData = {
        id: data.user.id,
        name: profileData?.name || data.user.user_metadata.name || 'User',
        email: data.user.email || '',
        role: profileData?.role || data.user.user_metadata.role || 'patient',
        isAnonymous: data.user.user_metadata.isAnonymous || false
      };
      
      return userData;
    }
    
    console.log('No user data returned from login');
    return null;
  } catch (error) {
    console.error('Login error exception:', error);
    throw error;
  }
};

// Function to create an anonymous user
export const createAnonymousUser = async (): Promise<User | null> => {
  try {
    // Generate a random email and password for anonymous users
    const randomEmail = `anon_${Math.random().toString(36).substring(2)}@anonymous.bhai`;
    const randomPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    
    console.log('Creating anonymous user with email:', randomEmail);
    
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

    if (error) {
      console.error('Anonymous login error:', error);
      throw error;
    }
    
    if (data.user) {
      console.log('Anonymous user created with ID:', data.user.id);
      
      // Insert into profiles table
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: 'Anonymous User',
            email: data.user.email || randomEmail,
            role: 'patient'
          });
          
        if (profileError) {
          console.error('Anonymous profile creation error:', profileError);
        }
      } catch (profileErr) {
        console.error('Anonymous profile creation exception:', profileErr);
      }
      
      return {
        id: data.user.id,
        name: 'Anonymous User',
        email: data.user.email || randomEmail,
        role: 'patient',
        isAnonymous: true
      };
    }
    
    console.log('No user data returned from anonymous registration');
    return null;
  } catch (error) {
    console.error('Anonymous login error exception:', error);
    throw error;
  }
};

// Function to logout the current user
export const logoutUser = async (): Promise<void> => {
  try {
    console.log('Logging out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error exception:', error);
    throw error;
  }
};

// Function to get the current authenticated user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log('Getting current user');
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
      const user = data.session.user;
      console.log('Current user found:', user.id);
      
      // Get user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching current user profile:', profileError);
      }
      
      return {
        id: user.id,
        name: profileData?.name || user.user_metadata.name || 'User',
        email: user.email || '',
        role: profileData?.role || user.user_metadata.role || 'patient',
        isAnonymous: user.user_metadata.isAnonymous || false
      };
    }
    
    console.log('No current user session found');
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};
