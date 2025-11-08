export interface User {
  name: string;
  email: string;
  wallet: string;
  balance: number;
  notifications: boolean;
  language: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  type: 'Rent' | 'Purchase' | 'Deposit' | 'Insurance' | 'Transfer';
  status: 'Pending' | 'Completed' | 'Failed';
}

export const getUser = (): User => {
  const stored = localStorage.getItem('paymind_user');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    name: 'John Doe',
    email: 'john@paymind.io',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    balance: 1200,
    notifications: true,
    language: 'English',
  };
};

export const saveUser = (user: User): void => {
  localStorage.setItem('paymind_user', JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem('paymind_user');
};

export const getTransactions = (): Transaction[] => [
  {
    id: 'TX001',
    type: 'Rent',
    amount: 600,
    status: 'Completed',
    date: '2025-11-01',
    recipient: '0xABC...123',
  },
  {
    id: 'TX002',
    type: 'Deposit',
    amount: 300,
    status: 'Pending',
    date: '2025-11-05',
    recipient: '0xDEF...456',
  },
  {
    id: 'TX003',
    type: 'Insurance',
    amount: 150,
    status: 'Completed',
    date: '2025-10-28',
    recipient: '0xGHI...789',
  },
  {
    id: 'TX004',
    type: 'Transfer',
    amount: 450,
    status: 'Failed',
    date: '2025-10-25',
    recipient: '0xJKL...012',
  },
  {
    id: 'TX005',
    type: 'Purchase',
    amount: 2500,
    status: 'Completed',
    date: '2025-10-20',
    recipient: '0xMNO...345',
  },
  {
    id: 'TX006',
    type: 'Rent',
    amount: 600,
    status: 'Completed',
    date: '2025-10-01',
    recipient: '0xABC...123',
  },
];

export const getRecentTransactions = (): Transaction[] => {
  return getTransactions().slice(0, 3);
};

export const sendAICommand = (command: string): string => {
  const lowerCmd = command.toLowerCase();

  if (lowerCmd.includes('rent') && lowerCmd.includes('month')) {
    return '✅ Payment scheduled successfully! I\'ll automatically pay your rent on the 1st of every month.';
  }

  if (lowerCmd.includes('transfer') && lowerCmd.includes('contract')) {
    return '✅ Smart contract condition set! I\'ll transfer 600 USDC once the contract is signed and verified.';
  }

  if (lowerCmd.includes('deposit')) {
    return '✅ Deposit payment understood. I\'ll process the deposit transaction and notify you when complete.';
  }

  if (lowerCmd.includes('insurance')) {
    return '✅ Insurance payment scheduled. I\'ll handle the recurring payments automatically.';
  }

  if (lowerCmd.includes('balance') || lowerCmd.includes('how much')) {
    return '💵 Your current USDC balance is 1,200 USDC. You have 2 pending transactions totaling 300 USDC.';
  }

  if (lowerCmd.includes('status') || lowerCmd.includes('transaction')) {
    return '📊 Transaction Status: 4 completed, 1 pending, 1 failed. Would you like details on any specific transaction?';
  }

  return `✅ Command understood: "${command}". I'll process this request and notify you once it's complete.`;
};

export const loginUser = (email: string): User => {
  const user: User = {
    name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    email,
    wallet: '0x' + Math.random().toString(16).substr(2, 40),
    balance: 1200,
    notifications: true,
    language: 'English',
  };
  saveUser(user);
  return user;
};

export const connectWallet = (): User => {
  const user: User = {
    name: 'John Doe',
    email: 'john@paymind.io',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    balance: 1200,
    notifications: true,
    language: 'English',
  };
  saveUser(user);
  return user;
};
