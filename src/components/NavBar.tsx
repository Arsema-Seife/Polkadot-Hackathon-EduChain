import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Home, User, Settings, Moon, Sun, LogOut, Wallet, Copy, Download, Share2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NavBar = () => {
  const { user, disconnectWallet } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCopyWallet = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      toast.success('Wallet address copied!');
    }
  };

  const handleExportCredentials = () => {
    toast.success('Exporting credentials...');
    // Implementation for exporting all credentials as PDF/JSON
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.walletAddress}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied!');
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'student':
        return '/student';
      case 'university':
        return '/university';
      case 'employer':
        return '/employer';
      default:
        return '/';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              EduChain
            </div>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive(getDashboardRoute()) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate(getDashboardRoute())}
              className="glow-on-hover"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>

            {user?.role === 'student' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student')}
                className="glow-on-hover"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShareProfile}
              className="glow-on-hover"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCredentials}
              className="glow-on-hover"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Right Side: Wallet + Theme + Settings */}
          <div className="flex items-center gap-2">
            {/* Wallet Address Display */}
            {user?.walletAddress && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50 glow-on-hover">
                <Wallet className="w-4 h-4 text-primary" />
                <code className="text-xs font-mono">
                  {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopyWallet}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="glow-on-hover"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="glow-on-hover">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings & Privacy
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleCopyWallet}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Wallet Address
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleShareProfile}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleExportCredentials}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    disconnectWallet();
                    navigate('/');
                  }}
                  className="text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
