import { Credential } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Building2, FileCheck, Share2, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

interface CredentialCardProps {
  credential: Credential;
  showActions?: boolean;
}

export const CredentialCard = ({ credential, showActions = true }: CredentialCardProps) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/verify/${credential.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Verification link copied to clipboard!');
  };

  const credentialData = {
    id: credential.id,
    student: credential.studentName,
    degree: credential.degree,
    university: credential.university,
    issueDate: credential.issueDate,
    ipfsHash: credential.ipfsHash,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{credential.degree}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              {credential.university}
            </div>
          </div>
          {credential.verified && (
            <Badge variant="default" className="bg-success">
              <FileCheck className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Issued: {new Date(credential.issueDate).toLocaleDateString()}
          </div>
          <div className="text-xs text-muted-foreground">
            IPFS: {credential.ipfsHash.slice(0, 20)}...
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Credential QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 p-4">
                  <QRCode value={JSON.stringify(credentialData)} size={256} />
                  <p className="text-sm text-muted-foreground text-center">
                    Scan this QR code to verify the credential
                  </p>
                  <Button onClick={handleShare} className="w-full">
                    Copy Verification Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={handleShare}>
              <Download className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
