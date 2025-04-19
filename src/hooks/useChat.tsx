
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation } from '@/types';
import { getAIResponse } from '@/lib/api';
import { saveConversation, getConversationById } from '@/lib/utils/storage';

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
      
      // Call AI API
      setIsLoading(true);
      const aiResponse = await getAIResponse(apiMessages);
      
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
    clearConversation
  };
}
