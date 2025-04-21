
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { Menu } from 'lucide-react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Base navigation items for all users
  const baseNavigation = [
    { name: 'Home', path: '/' },
    { name: 'Chat', path: '/chat' },
    { name: 'Mental Health Assessment', path: '/mental-health-assessment' },
    { name: 'Behavioral Assessment', path: '/behavioral-assessment' },
    { name: 'Resources', path: '/resources' },
    { name: 'History', path: '/history' },
    { name: 'Dashboard', path: '/dashboard' }, // Add Dashboard link for all users
  ];
  
  // Add doctor dashboard link if user is a doctor
  const navigation = user?.role === 'doctor' 
    ? [...baseNavigation, { name: 'Doctor Dashboard', path: '/doctor-dashboard' }]
    : baseNavigation;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-bhai-primary to-bhai-tertiary bg-clip-text text-transparent text-2xl font-bold">BHAI</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive(item.path)
                    ? 'text-foreground font-medium'
                    : 'text-foreground/60'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 bg-bhai-primary text-white">
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role || 'patient'}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {user?.role === 'doctor' && (
                  <DropdownMenuItem asChild>
                    <Link to="/doctor-dashboard">Doctor Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">View Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/history">View History</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Login / Register
              </Button>
            </Link>
          )}
          
          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="px-7">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <span className="bg-gradient-to-r from-bhai-primary to-bhai-tertiary bg-clip-text text-transparent text-2xl font-bold">BHAI</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 text-sm mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-7 py-2 transition-colors hover:text-foreground/80 ${
                      isActive(item.path)
                        ? 'bg-muted font-medium'
                        : 'text-foreground/60'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link 
                    to="/auth" 
                    onClick={() => setIsOpen(false)}
                    className="px-7 py-2 transition-colors hover:text-foreground/80"
                  >
                    Login / Register
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
