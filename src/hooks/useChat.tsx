
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation, Assessment } from '@/types';
import { getAIResponse } from '@/lib/api';
import { saveConversation, getConversationById, getAssessmentsForUser } from '@/lib/utils/storage';
import { toast } from '@/components/ui/use-toast';

interface UseChatProps {
  userId: string;
  conversationId?: string;
}

export function useChat({ userId, conversationId }: UseChatProps) {
  const [conversation, setConversation] = useState<Conversation>(() => {
    if (conversationId) {
      const existingConversation = getConversationById(conversationId);
      if (existingConversation) {
        return existingConversation;
      }
    }

    // Create a new conversation if none exists
    return {
      id: uuidv4(),
      userId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<string>('');
  const [isContextLoaded, setIsContextLoaded] = useState(false);

  // Get user assessment history for context
  useEffect(() => {
    if (userId) {
      const loadUserContext = async () => {
        try {
          // Get assessments for context
          const assessments = getAssessmentsForUser(userId);
          
          if (assessments.length > 0) {
            // Sort by creation date (newest first)
            const sortedAssessments = assessments.sort((a, b) => b.createdAt - a.createdAt);
            
            // Create a context string with the most recent assessments
            let contextString = "USER HISTORY (Do not directly mention that you have access to this information unless asked):\n";
            
            // Include up to 2 most recent assessments
            const recentAssessments = sortedAssessments.slice(0, 2);
            recentAssessments.forEach((assessment, index) => {
              const date = new Date(assessment.createdAt).toLocaleDateString();
              contextString += `\n[${date}] ${assessment.type.toUpperCase()} ASSESSMENT RESULT:\n${assessment.result}\n`;
            });
            
            setUserContext(contextString);
            setIsContextLoaded(true);
          } else {
            setUserContext('');
            setIsContextLoaded(true);
          }
        } catch (error) {
          console.error('Error loading user context:', error);
          setUserContext('');
          setIsContextLoaded(true);
        }
      };
      
      loadUserContext();
    }
  }, [userId]);

  // Save conversation to storage whenever it changes
  useEffect(() => {
    saveConversation(conversation);
  }, [conversation]);

  const sendMessage = async (content: string) => {
    try {
      setError(null);
      
      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: Date.now()
      };
      
      // Update conversation with user message
      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, userMessage],
        updatedAt: Date.now()
      };
      
      setConversation(updatedConversation);
      saveConversation(updatedConversation);
      
      // Prepare messages for API call
      const apiMessages = updatedConversation.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Call AI API with user context if available
      setIsLoading(true);
      const aiResponse = await getAIResponse(apiMessages, userContext);
      
      // Add AI response message
      const aiMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      };
      
      // Update conversation with AI message
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiMessage],
        updatedAt: Date.now()
      };
      
      setConversation(finalConversation);
      saveConversation(finalConversation);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    const newConversation = {
      ...conversation,
      id: uuidv4(),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setConversation(newConversation);
    saveConversation(newConversation);
  };

  return {
    conversation,
    messages: conversation.messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    hasUserContext: !!userContext,
    isContextLoaded
  };
}
