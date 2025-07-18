/**
 * 📦 Mock Data for VaultKYC Platform
 * 
 * Contains sample data for testing and demonstration purposes.
 * 
 * TODO for blockchain developer:
 * - Replace with blockchain data fetching
 * - Implement smart contract interactions
 * - Add IPFS integration for document storage
 * - Connect to decentralized identity networks
 */

// 🆔 KYC Status Types
export type KYCStatus = 'verified' | 'pending' | 'expired' | 'rekyc_requested';
export type RiskLevel = 'low' | 'medium' | 'high';
export type DocumentType = 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id';

// 📊 KYC Submission Interface
export interface KYCSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  documentType: DocumentType;
  documentNumber: string;
  submissionDate: string;
  expiryDate: string;
  status: KYCStatus;
  riskLevel: RiskLevel;
  faceMatchScore: number;
  riskScore: number;
  staffId?: string;
  comments?: string;
  blockchainTxHash?: string;
}

// 📈 Analytics Interface
export interface AnalyticsData {
  totalProcessed: number;
  verified: number;
  pending: number;
  highRisk: number;
  rekycRequests: number;
  avgProcessingTime: string;
}

// 🗨️ Comment Interface
export interface KYCComment {
  id: string;
  kycId: string;
  staffId: string;
  staffName: string;
  comment: string;
  timestamp: string;
  action: 'approved' | 'escalated' | 'note';
}

// 🔗 Blockchain Transaction Interface
export interface BlockchainTransaction {
  id: string;
  hash: string;
  kycId: string;
  timestamp: string;
  blockNumber: number;
  gasUsed: string;
  status: 'confirmed' | 'pending' | 'failed';
}

// 📋 Mock KYC Submissions Data
export const mockKYCSubmissions: KYCSubmission[] = [
  {
    id: 'KYC-STF-000001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543210',
    dateOfBirth: '1985-03-15',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    documentType: 'aadhaar',
    documentNumber: '1234-5678-9012',
    submissionDate: '2024-01-15T10:30:00Z',
    expiryDate: '2025-03-15T10:30:00Z',
    status: 'verified',
    riskLevel: 'low',
    faceMatchScore: 95.8,
    riskScore: 12,
    staffId: 'STF001',
    blockchainTxHash: '0x1234567890abcdef...'
  },
  {
    id: 'KYC-STF-000002', 
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543211',
    dateOfBirth: '1990-07-22',
    address: '456 Park Street, Delhi, Delhi 110001',
    documentType: 'pan',
    documentNumber: 'ABCDE1234F',
    submissionDate: '2024-01-16T14:20:00Z',
    expiryDate: '2025-03-16T14:20:00Z',
    status: 'pending',
    riskLevel: 'medium',
    faceMatchScore: 87.3,
    riskScore: 45,
    staffId: 'STF001'
  },
  {
    id: 'KYC-STF-000003',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@email.com', 
    phone: '+91-9876543212',
    dateOfBirth: '1988-12-10',
    address: '789 Marina Beach, Chennai, Tamil Nadu 600001',
    documentType: 'passport',
    documentNumber: 'A1234567',
    submissionDate: '2024-01-17T09:15:00Z',
    expiryDate: '2025-03-17T09:15:00Z',
    status: 'verified',
    riskLevel: 'low',
    faceMatchScore: 92.1,
    riskScore: 25,
    staffId: 'STF002',
    comments: 'All documents verified successfully after re-submission'
  },
  {
    id: 'KYC-STF-000004',
    name: 'Anita Patel',
    email: 'anita.patel@email.com',
    phone: '+91-9876543213',
    dateOfBirth: '1992-05-08',
    address: '321 SG Highway, Ahmedabad, Gujarat 380001',
    documentType: 'driving_license',
    documentNumber: 'GJ0112345678',
    submissionDate: '2024-01-18T16:45:00Z',
    expiryDate: '2025-03-18T16:45:00Z',
    status: 'verified',
    riskLevel: 'low',
    faceMatchScore: 92.7,
    riskScore: 18,
    staffId: 'STF001',
    blockchainTxHash: '0xabcdef1234567890...'
  },
  {
    id: 'KYC-STF-000005',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91-9876543214',
    dateOfBirth: '1987-11-30',
    address: '654 City Palace Road, Jaipur, Rajasthan 302001',
    documentType: 'aadhaar',
    documentNumber: '9876-5432-1098',
    submissionDate: '2024-01-19T11:30:00Z',
    expiryDate: '2024-12-19T11:30:00Z', // Expired date
    status: 'expired',
    riskLevel: 'medium',
    faceMatchScore: 89.4,
    riskScore: 52,
    staffId: 'STF002',
    comments: 'Document has expired, requires re-KYC'
  }
];

// 📊 Mock Analytics Data
export const mockAnalytics: AnalyticsData = {
  totalProcessed: 1247,
  verified: 1113,
  pending: 134,
  highRisk: 65,
  rekycRequests: 23,
  avgProcessingTime: '1.8 hours'
};

// 🗨️ Mock Comments Data
export const mockComments: KYCComment[] = [
  {
    id: 'CMT001',
    kycId: 'KYC-STF-000001',
    staffId: 'STF001',
    staffName: 'Staff Member',
    comment: 'All documents verified successfully. Face match score excellent.',
    timestamp: '2024-01-15T11:00:00Z',
    action: 'approved'
  },
  {
    id: 'CMT002',
    kycId: 'KYC-STF-000003',
    staffId: 'STF002',
    staffName: 'Staff Member',
    comment: 'Document re-submitted with better quality. Verification completed.',
    timestamp: '2024-01-17T10:30:00Z',
    action: 'approved'
  },
  {
    id: 'CMT003',
    kycId: 'KYC-STF-000005',
    staffId: 'STF002',
    staffName: 'Staff Member',
    comment: 'Document has expired. User needs to submit re-KYC.',
    timestamp: '2024-01-19T12:00:00Z',
    action: 'escalated'
  }
];

// 🔗 Mock Blockchain Transactions
export const mockBlockchainTxs: BlockchainTransaction[] = [
  {
    id: 'TX001',
    hash: '0x1234567890abcdef1234567890abcdef12345678',
    kycId: 'KYC-STF-000001',
    timestamp: '2024-01-15T11:05:00Z',
    blockNumber: 1234567,
    gasUsed: '21000',
    status: 'confirmed'
  },
  {
    id: 'TX002',
    hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    kycId: 'KYC-STF-000004',
    timestamp: '2024-01-18T17:00:00Z',
    blockNumber: 1234589,
    gasUsed: '21000',
    status: 'confirmed'
  }
];

// 🆔 KYC ID Generator
export const generateKYCId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `KYC-STF-${timestamp.toString().slice(-6)}${random}`;
};

// 📅 Date Helper Functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 📈 Risk Score Calculator (dummy implementation)
export const calculateRiskScore = (faceMatchScore: number, documentQuality: number): number => {
  // Simple risk calculation: lower face match + lower doc quality = higher risk
  const baseRisk = 100 - ((faceMatchScore + documentQuality) / 2);
  return Math.max(0, Math.min(100, baseRisk + Math.random() * 20 - 10));
};

// 🎯 Status Badge Helper
export const getStatusBadge = (status: KYCStatus): string => {
  switch (status) {
    case 'verified':
      return 'status-verified';
    case 'pending':
      return 'status-pending';
    case 'expired':
      return 'status-rejected';
    case 'rekyc_requested':
      return 'status-warning';
    default:
      return 'status-pending';
  }
};

// 🏷️ Risk Level Badge Helper
export const getRiskBadge = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case 'low':
      return 'risk-low';
    case 'medium':
      return 'risk-medium';
    case 'high':
      return 'risk-high';
    default:
      return 'risk-medium';
  }
};