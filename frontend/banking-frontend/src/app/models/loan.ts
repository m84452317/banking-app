export interface Loan {
  _id: string;
  userId: string;
  loanType: 'personal' | 'home' | 'education';
  amount: number; // Changed from principalAmount
  interestRate: number;
  tenureMonths: number; // Changed from termMonths
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}