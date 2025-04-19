
import { v4 as uuidv4 } from 'uuid';
import { saveUser, getUser, clearUser } from './utils/storage';
import { User, UserRole } from '@/types';

// Function to register a new user
export const registerUser = (name: string, email: string, password: string, role: UserRole): User => {
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    role,
    isAnonymous: false
  };

  // In a real app, this would hash the password and call an API
  const userData = {
    ...newUser,
    passwordHash: password, // NOTE: For demo only! Should be hashed in production
  };

  saveUser(userData);
  return newUser;
};

// Function to login a user
export const loginUser = (email: string, password: string): User | null => {
  const userData = getUser();
  
  // In a real app, this would verify the password hash
  if (userData && userData.email === email && userData.passwordHash === password) {
    const { passwordHash, ...user } = userData;
    return user as User;
  }
  
  return null;
};

// Function to create an anonymous user
export const createAnonymousUser = (): User => {
  const anonUser: User = {
    id: uuidv4(),
    name: 'Anonymous User',
    email: `anon_${Math.random().toString(36).substring(7)}@anonymous.bhai`,
    role: 'patient',
    isAnonymous: true
  };

  saveUser(anonUser);
  return anonUser;
};

// Function to logout the current user
export const logoutUser = (): void => {
  clearUser();
};

// Function to get the current authenticated user
export const getCurrentUser = (): User | null => {
  const userData = getUser();
  if (userData) {
    const { passwordHash, ...user } = userData;
    return user as User;
  }
  return null;
};
