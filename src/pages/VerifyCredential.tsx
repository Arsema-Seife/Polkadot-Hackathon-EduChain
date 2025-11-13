import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Credential } from '@/types';
import { blockchainService } from '@/services/blockchain';
import { CheckCircle, XCircle, Search, Shield, Building2, Calendar, GraduationCap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function VerifyCredential() {
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();
  const [searchId, setSearchId] = useState(id || '');
  const [credential, setCredential] = useState<Credential | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cred = blockchainService.verifyCredential(searchId);
    setCredential(cred);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold gradient-text">EduChain Verifier</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verify Academic Credential</h1>
          <p className="text-muted-foreground">
            Enter a credential ID or scan a QR code to verify authenticity
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 card-lift">
          <CardHeader>
            <CardTitle>Credential Verification</CardTitle>
            <CardDescription>
              Secured by Polkadot blockchain technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter credential ID..."
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full glow-on-hover">
                <Search className="w-4 h-4 mr-2" />
                Verify Credential
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <Card className={`card-lift ${credential ? 'border-success' : 'border-destructive'}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {credential ? (
                  <>
                    <div className="p-3 rounded-full bg-success/10">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <CardTitle className="text-success">Credential Verified</CardTitle>
                      <CardDescription>This credential is authentic and valid</CardDescription>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-destructive/10">
                      <XCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-destructive">Not Found</CardTitle>
                      <CardDescription>This credential could not be verified</CardDescription>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>

            {credential && (
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-medium">Verified on Polkadot</span>
                  </div>
                  <Badge className="trust-badge text-white">Authentic</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Student Name</p>
                    <p className="font-semibold">{credential.studentName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Degree</p>
                    <p className="font-semibold">{credential.degree}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">University</p>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold">{credential.university}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold">{new Date(credential.issueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Blockchain Transaction Hash</p>
                  <code className="text-xs break-all">{credential.ipfsHash}</code>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Issuer Wallet Address</p>
                  <code className="text-xs break-all">{credential.universityWalletAddress}</code>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
