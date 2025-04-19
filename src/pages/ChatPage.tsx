
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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
      <p className="text-muted-foreground mb-4">
        Share your thoughts and feelings with BHAI, your mental health assistant. All conversations are private and secure.
      </p>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription>
          BHAI now uses your assessment history to provide more personalized support. Complete mental health or behavioral assessments for better tailored advice.
        </AlertDescription>
      </Alert>
      
      <ChatInterface user={user} />
    </div>
  );
}
