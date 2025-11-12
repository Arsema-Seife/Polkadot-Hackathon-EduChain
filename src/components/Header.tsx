import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { LogOut, Wallet, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

export const Header = () => {
  const { user, disconnectWallet } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success('Wallet disconnected');
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'student':
        return 'Student';
      case 'university':
        return 'University';
      case 'employer':
        return 'Employer';
      default:
        return '';
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EduChain
          </h1>
          <span className="text-sm text-muted-foreground">| {getRoleLabel()} Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="w-4 h-4 text-primary" />
            <code className="bg-muted px-2 py-1 rounded text-xs">
              {user?.walletAddress.slice(0, 6)}...{user?.walletAddress.slice(-4)}
            </code>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>
    </header>
  );
};
