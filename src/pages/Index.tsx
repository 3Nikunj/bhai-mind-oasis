
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-bhai-primary to-bhai-tertiary bg-clip-text text-transparent">
            BHAI
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl">
            Behavioral Health Assistant Interface
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-4">
            Your personal AI companion for mental health support. Talk about your feelings, take assessments, and access resources to support your wellbeing journey.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-bhai-primary hover:bg-bhai-secondary">
                <Link to="/chat">Start Chatting</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-bhai-primary hover:bg-bhai-secondary">
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link to="/resources">View Resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">How BHAI Can Help You</h2>
          <p className="text-muted-foreground">
            BHAI offers several features to support your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Chat Support</CardTitle>
              <CardDescription>Talk about your feelings with our empathetic AI companion</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Have conversational support available 24/7. Share your thoughts and receive supportive responses to help you navigate your emotions.
              </p>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/chat">Start Chatting</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Assessment</CardTitle>
              <CardDescription>Evaluate your current mental health status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Take our comprehensive assessment to gain insights into your mental health. Receive personalized recommendations based on your responses.
              </p>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/mental-health-assessment">Take Assessment</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Health Assessment</CardTitle>
              <CardDescription>Understand how your behaviors impact your wellbeing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Evaluate how your daily habits and lifestyle might be affecting your mental health, and discover adjustments that could improve your wellbeing.
              </p>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/behavioral-assessment">Take Assessment</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>Learn about mental health conditions and coping strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access our library of resources about various mental health topics, including symptoms, causes, and self-help techniques.
              </p>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/resources">Browse Resources</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>Review your past interactions and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access your chat history and assessment results to track your progress over time. All your data is stored locally on your device.
              </p>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/history">View History</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy Focused</CardTitle>
              <CardDescription>Your data stays private and secure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                BHAI stores all your information locally on your device. Your mental health journey remains private and secure.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="container max-w-3xl mx-auto">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-center">Important Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              BHAI is designed to provide support and information, but it is not a replacement for professional mental health care. If you're experiencing a crisis or emergency, please contact emergency services, a crisis helpline, or seek professional help immediately.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
