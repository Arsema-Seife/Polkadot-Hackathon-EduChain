import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Credential } from '@/types';
import { blockchainService } from '@/services/blockchain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function UniversityDashboard() {
  const { user } = useAuth();
  const [issuedCredentials, setIssuedCredentials] = useState<Credential[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [credentialForm, setCredentialForm] = useState({
    studentWalletAddress: '',
    studentName: '',
    degree: '',
    issueDate: '',
  });

  useEffect(() => {
    if (user?.walletAddress) {
      const authorized = blockchainService.isAuthorizedUniversity(user.walletAddress);
      setIsAuthorized(authorized);
      
      if (!authorized) {
        blockchainService.authorizeUniversity(user.walletAddress);
        setIsAuthorized(true);
        toast.success('University authorized successfully!');
      }

      loadIssuedCredentials();
    }
  }, [user]);

  const loadIssuedCredentials = () => {
    if (!user?.walletAddress) return;
    const credentials = blockchainService.getCredentialsByUniversity(user.walletAddress);
    setIssuedCredentials(credentials);
  };

  const handleIssueCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.walletAddress) return;

    setIsIssuing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      blockchainService.issueCredential({
        studentWalletAddress: credentialForm.studentWalletAddress,
        studentName: credentialForm.studentName,
        degree: credentialForm.degree,
        university: user.organizationName || 'University',
        universityWalletAddress: user.walletAddress,
        issueDate: credentialForm.issueDate,
        verified: true,
        certificateType: 'university',
      });

      toast.success('Credential issued successfully!');
      setCredentialForm({
        studentWalletAddress: '',
        studentName: '',
        degree: '',
        issueDate: '',
      });
      loadIssuedCredentials();
    } catch (error) {
      toast.error('Failed to issue credential');
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">University Dashboard</h2>
          <p className="text-muted-foreground">
            Issue and manage student credentials
          </p>
        </div>

        {isAuthorized && (
          <Badge className="mb-4 bg-success">
            <Building2 className="w-3 h-3 mr-1" />
            Authorized Issuer
          </Badge>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issuedCredentials.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {issuedCredentials.filter(c => {
                  const issueDate = new Date(c.issueDate);
                  const now = new Date();
                  return issueDate.getMonth() === now.getMonth() && 
                         issueDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue New Credential</CardTitle>
              <CardDescription>
                Create and issue a new credential to a student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIssueCredential} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      value={credentialForm.studentName}
                      onChange={(e) => setCredentialForm({ ...credentialForm, studentName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentWallet">Student Wallet Address</Label>
                    <Input
                      id="studentWallet"
                      value={credentialForm.studentWalletAddress}
                      onChange={(e) => setCredentialForm({ ...credentialForm, studentWalletAddress: e.target.value })}
                      placeholder="0x..."
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree">Degree / Certificate</Label>
                    <Input
                      id="degree"
                      value={credentialForm.degree}
                      onChange={(e) => setCredentialForm({ ...credentialForm, degree: e.target.value })}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={credentialForm.issueDate}
                      onChange={(e) => setCredentialForm({ ...credentialForm, issueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isIssuing || !isAuthorized}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isIssuing ? 'Issuing...' : 'Issue Credential'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issued Credentials</CardTitle>
              <CardDescription>
                View all credentials issued by your institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issuedCredentials.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No credentials issued yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {issuedCredentials.map(credential => (
                    <div
                      key={credential.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{credential.studentName}</p>
                        <p className="text-sm text-muted-foreground">{credential.degree}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Issued: {new Date(credential.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="default" className="bg-success">
                        Verified
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
