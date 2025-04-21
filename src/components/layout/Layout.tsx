
import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isLoading } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timer);
  }, []);

  // Show loading state only during initial authentication check
  if (isLoading && !initialLoadComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <Loader2 className="h-12 w-12 text-bhai-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">{children}</main>
      <Footer />
    </div>
  );
}
