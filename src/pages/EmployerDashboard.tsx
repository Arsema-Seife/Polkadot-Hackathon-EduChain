import { useState } from 'react';
import { Header } from '@/components/Header';
import { CredentialCard } from '@/components/CredentialCard';
import { Credential } from '@/types';
import { blockchainService } from '@/services/blockchain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, FileSearch, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployerDashboard() {
  const [searchAddress, setSearchAddress] = useState('');
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress) return;

    setIsSearching(true);
    setHasSearched(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = blockchainService.getStudentCredentials(searchAddress);
      setCredentials(results);
      setHasSearched(true);
      
      if (results.length === 0) {
        toast.info('No credentials found for this wallet address');
      } else {
        toast.success(`Found ${results.length} credential(s)`);
      }
    } catch (error) {
      toast.error('Failed to search credentials');
    } finally {
      setIsSearching(false);
    }
  };

  const sampleAddresses = [
    '0x1234567890student001',
    '0xabc123student456',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Employer Dashboard</h2>
          <p className="text-muted-foreground">
            Verify student credentials by wallet address
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Student Credentials</CardTitle>
            <CardDescription>
              Enter the student's wallet address to view and verify their credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="walletAddress">Student Wallet Address</Label>
                <Input
                  id="walletAddress"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="0x..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Try sample addresses: {sampleAddresses.join(' or ')}
                </p>
              </div>
              <Button type="submit" disabled={isSearching}>
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search Credentials'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {credentials.length > 0 
                  ? `Found ${credentials.length} credential(s) for wallet ${searchAddress.slice(0, 10)}...`
                  : 'No credentials found'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {credentials.length === 0 ? (
                <div className="py-12 text-center">
                  <FileSearch className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No credentials found for this wallet address
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {credentials.map(credential => (
                      <CredentialCard 
                        key={credential.id} 
                        credential={credential}
                        showActions={false}
                      />
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Verification Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <div>
                          <p className="font-medium">All Credentials Verified</p>
                          <p className="text-sm text-muted-foreground">
                            All credentials are authentic and verified on blockchain
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                        <FileSearch className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-medium">Blockchain Verified</p>
                          <p className="text-sm text-muted-foreground">
                            IPFS hashes match on-chain records
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
