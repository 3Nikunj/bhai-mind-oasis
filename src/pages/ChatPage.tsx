
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/hooks/useAuth';

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Chat with BHAI</h1>
      <p className="text-muted-foreground mb-8">
        Share your thoughts and feelings with BHAI, your mental health assistant. All conversations are private and secure.
      </p>
      <ChatInterface user={user} />
    </div>
  );
}
