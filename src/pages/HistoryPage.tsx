
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { getConversations, getAssessmentsForUser } from '@/lib/utils/storage';
import { Conversation, Assessment } from '@/types';

export default function HistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (user) {
      // Get conversations for this user
      const userConversations = getConversations().filter(
        (conv) => conv.userId === user.id
      );
      setConversations(userConversations.sort((a, b) => b.updatedAt - a.updatedAt));

      // Get assessments for this user
      const userAssessments = getAssessmentsForUser(user.id);
      setAssessments(userAssessments.sort((a, b) => b.createdAt - a.createdAt));
    }
  }, [isAuthenticated, user, navigate]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatConversationPreview = (conversation: Conversation) => {
    const messages = conversation.messages;
    if (messages.length === 0) return 'No messages';
    
    const lastMessage = messages[messages.length - 1];
    const preview = lastMessage.content.substring(0, 100);
    return preview.length < lastMessage.content.length
      ? `${preview}...`
      : preview;
  };

  const viewConversation = (conversationId: string) => {
    navigate(`/chat?id=${conversationId}`);
  };

  const viewAssessment = (assessment: Assessment) => {
    // Open a modal or navigate to a page showing the assessment details
    console.log('View assessment', assessment);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Your History</h1>
      <p className="text-muted-foreground mb-8">
        Review your past conversations and assessments. All your data is stored locally on your device.
      </p>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-muted-foreground mt-1">Start chatting with BHAI to see your history here</p>
              <Button className="mt-4" onClick={() => navigate('/chat')}>
                Start a Conversation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <Card key={conversation.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => viewConversation(conversation.id)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Conversation on {formatDate(conversation.createdAt)}
                    </CardTitle>
                    <CardDescription>
                      Last updated: {formatDate(conversation.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">
                      {formatConversationPreview(conversation)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assessments">
          {assessments.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No assessments yet</h3>
              <p className="text-muted-foreground mt-1">Complete an assessment to see your history here</p>
              <div className="flex justify-center gap-3 mt-4">
                <Button onClick={() => navigate('/mental-health-assessment')}>
                  Mental Health Assessment
                </Button>
                <Button onClick={() => navigate('/behavioral-assessment')}>
                  Behavioral Assessment
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => viewAssessment(assessment)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>
                        {assessment.type === 'mental' ? 'Mental Health Assessment' : 'Behavioral Assessment'}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {formatDate(assessment.createdAt)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-24 rounded-md border p-4">
                      <div className="text-sm whitespace-pre-line">
                        {assessment.result.substring(0, 200)}
                        {assessment.result.length > 200 ? '...' : ''}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
