import { Credential, OnlineCertificate } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Simulated blockchain storage
const CREDENTIALS_KEY = 'educhain_credentials';
const ONLINE_CERTS_KEY = 'educhain_online_certificates';
const AUTHORIZED_UNIVERSITIES_KEY = 'educhain_authorized_universities';

export const blockchainService = {
  // University authorization
  isAuthorizedUniversity(walletAddress: string): boolean {
    const authorized = JSON.parse(localStorage.getItem(AUTHORIZED_UNIVERSITIES_KEY) || '[]');
    return authorized.includes(walletAddress);
  },

  authorizeUniversity(walletAddress: string): void {
    const authorized = JSON.parse(localStorage.getItem(AUTHORIZED_UNIVERSITIES_KEY) || '[]');
    if (!authorized.includes(walletAddress)) {
      authorized.push(walletAddress);
      localStorage.setItem(AUTHORIZED_UNIVERSITIES_KEY, JSON.stringify(authorized));
    }
  },

  // Credential management
  issueCredential(credential: Omit<Credential, 'id' | 'timestamp' | 'ipfsHash'>): Credential {
    const credentials = this.getAllCredentials();
    const newCredential: Credential = {
      ...credential,
      id: uuidv4(),
      timestamp: Date.now(),
      ipfsHash: this.generateIPFSHash(),
    };
    credentials.push(newCredential);
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    return newCredential;
  },

  getStudentCredentials(walletAddress: string): Credential[] {
    const credentials = this.getAllCredentials();
    return credentials.filter(c => c.studentWalletAddress === walletAddress);
  },

  getAllCredentials(): Credential[] {
    return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '[]');
  },

  getCredentialsByUniversity(universityWalletAddress: string): Credential[] {
    const credentials = this.getAllCredentials();
    return credentials.filter(c => c.universityWalletAddress === universityWalletAddress);
  },

  verifyCredential(credentialId: string): Credential | null {
    const credentials = this.getAllCredentials();
    return credentials.find(c => c.id === credentialId) || null;
  },

  // Online certificate management
  submitOnlineCertificate(cert: Omit<OnlineCertificate, 'id' | 'timestamp' | 'ipfsHash' | 'verificationStatus'>): OnlineCertificate {
    const certificates = this.getAllOnlineCertificates();
    const newCert: OnlineCertificate = {
      ...cert,
      id: uuidv4(),
      timestamp: Date.now(),
      ipfsHash: this.generateIPFSHash(),
      verificationStatus: 'pending',
    };
    certificates.push(newCert);
    localStorage.setItem(ONLINE_CERTS_KEY, JSON.stringify(certificates));
    return newCert;
  },

  getStudentOnlineCertificates(walletAddress: string): OnlineCertificate[] {
    const certificates = this.getAllOnlineCertificates();
    return certificates.filter(c => c.studentWalletAddress === walletAddress);
  },

  getAllOnlineCertificates(): OnlineCertificate[] {
    return JSON.parse(localStorage.getItem(ONLINE_CERTS_KEY) || '[]');
  },

  updateCertificateVerification(certId: string, status: 'verified' | 'rejected'): void {
    const certificates = this.getAllOnlineCertificates();
    const updated = certificates.map(c => 
      c.id === certId ? { ...c, verificationStatus: status } : c
    );
    localStorage.setItem(ONLINE_CERTS_KEY, JSON.stringify(updated));
  },

  // IPFS simulation
  generateIPFSHash(): string {
    return 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },

  uploadToIPFS(file: File): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateIPFSHash());
      }, 1500);
    });
  },
};

// Initialize with sample data
export const initializeSampleData = () => {
  const existingData = localStorage.getItem(CREDENTIALS_KEY);
  if (!existingData) {
    const sampleUniversity = '0xabc123university456';
    blockchainService.authorizeUniversity(sampleUniversity);

    const sampleCredentials: Credential[] = [
      {
        id: uuidv4(),
        studentWalletAddress: '0x1234567890student001',
        studentName: 'Alice Johnson',
        degree: 'Bachelor of Computer Science',
        university: 'Tech University',
        universityWalletAddress: sampleUniversity,
        issueDate: '2024-05-15',
        ipfsHash: blockchainService.generateIPFSHash(),
        timestamp: Date.now() - 86400000,
        verified: true,
        certificateType: 'university',
      },
      {
        id: uuidv4(),
        studentWalletAddress: '0x1234567890student001',
        studentName: 'Alice Johnson',
        degree: 'Master of Business Administration',
        university: 'Business School International',
        universityWalletAddress: sampleUniversity,
        issueDate: '2023-12-20',
        ipfsHash: blockchainService.generateIPFSHash(),
        timestamp: Date.now() - 172800000,
        verified: true,
        certificateType: 'university',
      },
    ];

    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(sampleCredentials));

    const sampleOnlineCerts: OnlineCertificate[] = [
      {
        id: uuidv4(),
        studentWalletAddress: '0x1234567890student001',
        courseName: 'Machine Learning Specialization',
        provider: 'Coursera',
        completionDate: '2024-03-10',
        certificateUrl: 'https://coursera.org/verify/SAMPLE123',
        ipfsHash: blockchainService.generateIPFSHash(),
        verificationStatus: 'verified',
        timestamp: Date.now() - 259200000,
      },
    ];

    localStorage.setItem(ONLINE_CERTS_KEY, JSON.stringify(sampleOnlineCerts));
  }
};
