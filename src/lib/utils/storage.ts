
// Local storage utilities for BHAI application

// Generic function to save data to localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error);
  }
};

// Generic function to get data from localStorage
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch (error) {
    console.error(`Error retrieving from storage: ${key}`, error);
    return null;
  }
};

// User storage
export const saveUser = (user: any): void => {
  saveToStorage('bhai_user', user);
};

export const getUser = (): any => {
  return getFromStorage('bhai_user');
};

export const clearUser = (): void => {
  localStorage.removeItem('bhai_user');
};

// Conversation storage
export const saveConversation = (conversation: any): void => {
  const conversations = getConversations();
  const exists = conversations.findIndex(c => c.id === conversation.id);
  
  if (exists >= 0) {
    conversations[exists] = conversation;
  } else {
    conversations.push(conversation);
  }
  
  saveToStorage('bhai_conversations', conversations);
};

export const getConversations = (): any[] => {
  return getFromStorage<any[]>('bhai_conversations') || [];
};

export const getConversationById = (id: string): any | null => {
  const conversations = getConversations();
  return conversations.find(c => c.id === id) || null;
};

// Assessment storage
export const saveAssessment = (assessment: any): void => {
  const assessments = getAssessments();
  const exists = assessments.findIndex(a => a.id === assessment.id);
  
  if (exists >= 0) {
    assessments[exists] = assessment;
  } else {
    assessments.push(assessment);
  }
  
  saveToStorage('bhai_assessments', assessments);
};

export const getAssessments = (): any[] => {
  return getFromStorage<any[]>('bhai_assessments') || [];
};

export const getAssessmentsForUser = (userId: string): any[] => {
  const assessments = getAssessments();
  return assessments.filter(a => a.userId === userId);
};
