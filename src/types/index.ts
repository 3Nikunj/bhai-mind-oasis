
// Type definitions for BHAI application

export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAnonymous: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Assessment {
  id: string;
  userId: string;
  type: 'mental' | 'behavioral';
  answers: Record<string, any>;
  result: string;
  createdAt: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'depression' | 'anxiety' | 'ptsd' | 'stress' | 'general';
  content: string;
}
