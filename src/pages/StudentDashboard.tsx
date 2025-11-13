import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavBar } from '@/components/NavBar';
import { CredentialCard } from '@/components/CredentialCard';
import { Credential, OnlineCertificate } from '@/types';
import { blockchainService } from '@/services/blockchain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Upload, Award, Bell, User, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import QRCode from 'react-qr-code';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [onlineCerts, setOnlineCerts] = useState<OnlineCertificate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allOrganizations, setAllOrganizations] = useState<string[]>([]);

  const [certForm, setCertForm] = useState({
    courseName: '',
    provider: 'Coursera',
    completionDate: '',
    certificateUrl: '',
  });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    graduationYear: '',
  });

  useEffect(() => {
    if (user?.walletAddress) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user?.walletAddress) return;
    const creds = blockchainService.getStudentCredentials(user.walletAddress);
    const certs = blockchainService.getStudentOnlineCertificates(user.walletAddress);
    setCredentials(creds);
    setOnlineCerts(certs);

    // Get all unique organizations/universities
    const allCreds = blockchainService.getAllCredentials();
    const universities = [...new Set(allCreds.map(c => c.university))];
    const onlineProviders = [...new Set(certs.map(c => c.provider))];
    setAllOrganizations([...universities, ...onlineProviders]);

    // Load profile
    const savedProfile = localStorage.getItem(`profile_${user.walletAddress}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  };

  const handleSaveProfile = () => {
    if (!user?.walletAddress) return;
    localStorage.setItem(`profile_${user.walletAddress}`, JSON.stringify(profile));
    toast.success('Profile updated successfully!');
  };

  const handleSubmitCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.walletAddress) return;

    // Input validation
    if (!certForm.courseName.trim() || certForm.courseName.length > 200) {
      toast.error('Course name must be between 1 and 200 characters');
      return;
    }
    if (!certForm.certificateUrl.match(/^https?:\/\/.+/)) {
      toast.error('Please enter a valid certificate URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      blockchainService.submitOnlineCertificate({
        studentWalletAddress: user.walletAddress,
        courseName: certForm.courseName.trim(),
        provider: certForm.provider,
        completionDate: certForm.completionDate,
        certificateUrl: certForm.certificateUrl.trim(),
      });

      toast.success('Certificate submitted for verification!');
      setCertForm({
        courseName: '',
        provider: 'Coursera',
        completionDate: '',
        certificateUrl: '',
      });
      loadData();
    } catch (error) {
      toast.error('Failed to submit certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-success">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Student Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your credentials and certificates
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{credentials.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Online Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onlineCerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {onlineCerts.filter(c => c.verificationStatus === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="university" className="space-y-6">
          <TabsList>
            <TabsTrigger value="university">
              <GraduationCap className="w-4 h-4 mr-2" />
              University Credentials
            </TabsTrigger>
            <TabsTrigger value="online">
              <Award className="w-4 h-4 mr-2" />
              Online Certificates
            </TabsTrigger>
            <TabsTrigger value="organizations">
              <Building className="w-4 h-4 mr-2" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="university">
            {credentials.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No university credentials yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {credentials.map(credential => (
                  <CredentialCard key={credential.id} credential={credential} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="online">
            <div className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Add Online Certificate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Online Course Certificate</DialogTitle>
                    <DialogDescription>
                      Add your online course certificate for verification
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitCertificate} className="space-y-4">
                    <div>
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        value={certForm.courseName}
                        onChange={(e) => setCertForm({ ...certForm, courseName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="provider">Platform</Label>
                      <Select
                        value={certForm.provider}
                        onValueChange={(value) => setCertForm({ ...certForm, provider: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Coursera">Coursera</SelectItem>
                          <SelectItem value="Udemy">Udemy</SelectItem>
                          <SelectItem value="edX">edX</SelectItem>
                          <SelectItem value="Udacity">Udacity</SelectItem>
                          <SelectItem value="LinkedIn Learning">LinkedIn Learning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="completionDate">Completion Date</Label>
                      <Input
                        id="completionDate"
                        type="date"
                        value={certForm.completionDate}
                        onChange={(e) => setCertForm({ ...certForm, completionDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="certificateUrl">Certificate URL</Label>
                      <Input
                        id="certificateUrl"
                        type="url"
                        value={certForm.certificateUrl}
                        onChange={(e) => setCertForm({ ...certForm, certificateUrl: e.target.value })}
                        required
                        placeholder="https://..."
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {onlineCerts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No online certificates yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {onlineCerts.map(cert => (
                    <Card key={cert.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{cert.courseName}</CardTitle>
                          {getStatusBadge(cert.verificationStatus)}
                        </div>
                        <CardDescription>{cert.provider}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>Completed: {new Date(cert.completionDate).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            IPFS: {cert.ipfsHash.slice(0, 20)}...
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full mt-4">
                              View QR Code
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Certificate QR Code</DialogTitle>
                              <DialogDescription>
                                Share this QR code for verification
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-4 p-4">
                              <QRCode 
                                value={JSON.stringify({
                                  id: cert.id,
                                  courseName: cert.courseName,
                                  provider: cert.provider,
                                  completionDate: cert.completionDate,
                                  status: cert.verificationStatus,
                                  ipfsHash: cert.ipfsHash
                                })} 
                                size={256} 
                              />
                              <p className="text-sm text-muted-foreground text-center">
                                Scan to verify certificate
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <Card>
              <CardHeader>
                <CardTitle>All Issuing Organizations</CardTitle>
                <CardDescription>
                  Universities and platforms that have issued credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allOrganizations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No organizations found</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {allOrganizations.map((org, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Building className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{org}</p>
                          <p className="text-xs text-muted-foreground">Verified Issuer</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input id="walletAddress" value={user?.walletAddress || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input 
                    id="graduationYear" 
                    value={profile.graduationYear}
                    onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onlineCerts
                    .filter(c => c.verificationStatus === 'verified')
                    .map(cert => (
                      <div key={cert.id} className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                        <Award className="w-5 h-5 text-success mt-0.5" />
                        <div>
                          <p className="font-medium">Certificate Verified</p>
                          <p className="text-sm text-muted-foreground">
                            Your {cert.courseName} certificate from {cert.provider} has been verified
                          </p>
                        </div>
                      </div>
                    ))}
                  {credentials.length > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">New Credential Issued</p>
                        <p className="text-sm text-muted-foreground">
                          {credentials[0].university} issued your {credentials[0].degree} credential
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
