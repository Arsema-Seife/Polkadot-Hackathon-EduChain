import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Credential } from '@/types';
import { blockchainService } from '@/services/blockchain';
import { Calendar, Building2, CheckCircle, Share2, ExternalLink, Shield, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

export default function CredentialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    if (id) {
      const cred = blockchainService.verifyCredential(id);
      setCredential(cred);
    }
  }, [id]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/verify/${credential?.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Verification link copied to clipboard!');
  };

  if (!credential) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Credential not found</p>
          <Button onClick={() => navigate('/student')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="card-lift">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{credential.degree}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{credential.university}</span>
                </div>
              </div>
              {credential.verified && (
                <Badge className="trust-badge text-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified on Polkadot
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Credential Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-medium">{credential.studentName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{new Date(credential.issueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Credential Type</p>
                <Badge variant="outline">{credential.certificateType}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
            </div>

            {/* Blockchain Proof */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Blockchain Proof
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">IPFS Hash</p>
                  <code className="text-xs bg-background px-2 py-1 rounded break-all">{credential.ipfsHash}</code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Issuer Wallet</p>
                  <code className="text-xs bg-background px-2 py-1 rounded break-all">
                    {credential.universityWalletAddress.slice(0, 20)}...
                  </code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    {new Date(credential.timestamp).toLocaleString()}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="glow-on-hover">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Credential
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Credential</DialogTitle>
                    <DialogDescription>
                      Share this credential via QR code or link
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <QRCode
                      value={JSON.stringify({
                        id: credential.id,
                        student: credential.studentName,
                        degree: credential.degree,
                        university: credential.university,
                        verified: credential.verified
                      })}
                      size={256}
                    />
                    <Button onClick={handleShare} className="w-full">
                      Copy Verification Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={() => window.open(`/verify/${credential.id}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Public Verification Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
