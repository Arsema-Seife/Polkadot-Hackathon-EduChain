import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, GraduationCap, Building2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export const WalletConnect = () => {
  const { connectWallet, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleConnect = async (role: UserRole) => {
    try {
      await connectWallet(role);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const roles = [
    {
      type: 'student' as UserRole,
      title: 'Student',
      description: 'View and manage your credentials',
      icon: GraduationCap,
    },
    {
      type: 'university' as UserRole,
      title: 'University / Organization',
      description: 'Issue credentials to students',
      icon: Building2,
    },
    {
      type: 'employer' as UserRole,
      title: 'Employer / Verifier',
      description: 'Verify student credentials',
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EduChain
          </h1>
          <p className="text-muted-foreground">
            Decentralized Student Credential Wallet on Polkadot
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              Select your role and connect your wallet to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Card
                    key={role.type}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedRole === role.type ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedRole(role.type)}
                  >
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Icon className="w-12 h-12 mx-auto mb-3 text-primary" />
                        <h3 className="font-semibold mb-1">{role.title}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              disabled={!selectedRole || isLoading}
              onClick={() => selectedRole && handleConnect(selectedRole)}
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              This demo simulates wallet connection. In production, this would connect to MetaMask
              or Polkadot.js wallet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
