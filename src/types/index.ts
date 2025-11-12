export type UserRole = 'student' | 'university' | 'employer';

export interface User {
  walletAddress: string;
  role: UserRole;
  name?: string;
  email?: string;
  organizationName?: string;
}

export interface Credential {
  id: string;
  studentWalletAddress: string;
  studentName: string;
  degree: string;
  university: string;
  universityWalletAddress: string;
  issueDate: string;
  ipfsHash: string;
  timestamp: number;
  verified: boolean;
  certificateType: 'university' | 'online-course';
  courseProvider?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface OnlineCertificate {
  id: string;
  studentWalletAddress: string;
  courseName: string;
  provider: string;
  completionDate: string;
  certificateUrl: string;
  ipfsHash: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  timestamp: number;
}
