import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { WalletConnect } from '@/components/WalletConnect';
import { initializeSampleData } from '@/services/blockchain';

const Index = () => {
  const { user, isConnected, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    initializeSampleData();
  }, []);

  useEffect(() => {
    if (isConnected && user) {
      switch (user.role) {
        case 'student':
          navigate('/student');
          break;
        case 'university':
          navigate('/university');
          break;
        case 'employer':
          navigate('/employer');
          break;
      }
    }
  }, [isConnected, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <WalletConnect />;
};

export default Index;
