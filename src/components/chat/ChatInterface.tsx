
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { User } from '@/types';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
  user: User;
  conversationId?: string;
}

export function ChatInterface({ user, conversationId }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    error,
    sendMessage
  } = useChat({
    userId: user.id,
    conversationId
  });

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[80vh] border rounded-xl bg-white/50 backdrop-blur-sm shadow-lg">
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar className="h-9 w-9 bg-bhai-primary text-white">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">BHAI</h2>
          <p className="text-sm text-muted-foreground">Behavioral Health Assistant Interface</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <Avatar className="h-16 w-16 mb-4 bg-bhai-primary text-white">
                <AvatarFallback>BHAI</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">Welcome to BHAI</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                I'm here to support your mental wellbeing. Feel free to share what's on your mind or ask about mental health topics.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 mt-1 bg-bhai-primary text-white">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-bhai-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start gap-3">
              <Avatar className="h-8 w-8 mt-1 bg-bhai-primary text-white">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="px-4 py-2 rounded-lg max-w-[80%] bg-muted">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-bhai-primary animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-bhai-primary animate-pulse delay-150"></div>
                  <div className="h-2 w-2 rounded-full bg-bhai-primary animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 p-3 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-12 flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-full bg-bhai-primary hover:bg-bhai-secondary"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
