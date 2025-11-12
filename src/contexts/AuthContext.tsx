import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isConnected: boolean;
  connectWallet: (role: UserRole) => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('educhain_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const connectWallet = async (role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      const newUser: User = {
        walletAddress: mockAddress,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem('educhain_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    localStorage.removeItem('educhain_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isConnected: !!user,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
