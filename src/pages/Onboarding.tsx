import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { GraduationCap, Shield, Eye, EyeOff, Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Onboarding() {
  const navigate = useNavigate();
  const { connectWallet } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [step, setStep] = useState(1);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [seedConfirmed, setSeedConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateSeedPhrase = () => {
    const words = [
      'academic', 'secure', 'blockchain', 'credential', 'verify', 'trust',
      'education', 'polkadot', 'wallet', 'freedom', 'decentralized', 'proof'
    ];
    return words.sort(() => Math.random() - 0.5).join(' ');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleCreateWallet = () => {
    const phrase = generateSeedPhrase();
    setSeedPhrase(phrase);
    setStep(3);
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase);
    toast.success('Seed phrase copied to clipboard!');
  };

  const handleConfirmAndConnect = async () => {
    if (!seedConfirmed) {
      toast.error('Please confirm you have backed up your seed phrase');
      return;
    }

    setIsLoading(true);
    try {
      await connectWallet(selectedRole);
      toast.success('Wallet connected successfully!');
      
      // Navigate based on role
      if (selectedRole === 'student') navigate('/student');
      else if (selectedRole === 'university') navigate('/university');
      else if (selectedRole === 'employer') navigate('/employer');
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student',
      description: 'Store and share your academic credentials',
      icon: GraduationCap
    },
    {
      id: 'university' as UserRole,
      title: 'University',
      description: 'Issue and manage student credentials',
      icon: Shield
    },
    {
      id: 'employer' as UserRole,
      title: 'Employer',
      description: 'Verify student credentials',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold gradient-text">EduChain</span>
          </div>
          <p className="text-muted-foreground">Your wallet is your academic key — keep it safe</p>
        </div>

        <Card className="card-lift">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Choose Your Role'}
              {step === 2 && 'Create or Import Wallet'}
              {step === 3 && 'Backup Your Seed Phrase'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Select how you want to use EduChain'}
              {step === 2 && 'Choose your preferred method to access your wallet'}
              {step === 3 && 'Save this phrase securely - it\'s the only way to recover your wallet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="grid gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="text-left p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <role.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{role.title}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <Tabs defaultValue="create">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create New Wallet</TabsTrigger>
                  <TabsTrigger value="import">Import Wallet</TabsTrigger>
                </TabsList>
                
                <TabsContent value="create" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Create a new wallet with a secure seed phrase. Make sure to back it up!
                  </p>
                  <Button onClick={handleCreateWallet} className="w-full">
                    Generate Seed Phrase
                  </Button>
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                    Back
                  </Button>
                </TabsContent>
                
                <TabsContent value="import" className="space-y-4">
                  <div>
                    <Label htmlFor="seedInput">Seed Phrase</Label>
                    <Input
                      id="seedInput"
                      placeholder="Enter your 12-word seed phrase"
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={handleConfirmAndConnect} className="w-full">
                    Import Wallet
                  </Button>
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                    Back
                  </Button>
                </TabsContent>
              </Tabs>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Never share your seed phrase with anyone. Write it down and store it in a safe place.
                  </AlertDescription>
                </Alert>

                <div className="relative">
                  <div className={`p-4 bg-muted rounded-lg border-2 border-dashed ${showSeedPhrase ? '' : 'blur-sm select-none'}`}>
                    <p className="font-mono text-sm break-all">{seedPhrase}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  >
                    {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                <Button variant="outline" onClick={handleCopySeed} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Seed Phrase
                </Button>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="confirmBackup"
                    checked={seedConfirmed}
                    onChange={(e) => setSeedConfirmed(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="confirmBackup" className="text-sm cursor-pointer">
                    I have securely backed up my seed phrase
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirmAndConnect}
                    disabled={!seedConfirmed || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Connecting...' : 'Continue'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
