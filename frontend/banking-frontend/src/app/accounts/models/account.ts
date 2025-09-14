export interface Transaction {
  txnId: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

export interface Account {
  _id: string;
  accountNumber: string;
  userId: string;
  type: 'savings' | 'current';
  balance: number;
  status: 'active' | 'frozen' | 'closed';
  transactions: Transaction[];
  createdAt: string;
}