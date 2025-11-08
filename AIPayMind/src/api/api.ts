const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dashboard API
export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
  return response.json();
}

export async function getRecentTransactions(limit: number = 10) {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/transactions/recent?limit=${limit}`);
  return response.json();
}

// Payments API
export async function sendPayment(data: {
  destinationAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/payments/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function schedulePayment(data: {
  destinationAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
  frequency: string;
  startDate?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/payments/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function createConditionalPayment(data: {
  destinationAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
  conditionType: string;
  conditionParams: any;
}) {
  const response = await fetch(`${API_BASE_URL}/api/payments/conditional`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function estimatePaymentFee(data: {
  destinationAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/payments/estimate-fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// DeFi API
export async function executeSwap(data: {
  walletId: string;
  fromToken: string;
  toToken: string;
  amount: string;
  slippage?: number;
  dexProtocol?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/defi/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function supplyToLending(data: {
  walletId: string;
  tokenAddress: string;
  amount: string;
  protocol?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/defi/lending/supply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function borrowFromLending(data: {
  walletId: string;
  tokenAddress: string;
  amount: string;
  protocol?: string;
  interestRateMode?: number;
}) {
  const response = await fetch(`${API_BASE_URL}/api/defi/lending/borrow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function addLiquidity(data: {
  walletId: string;
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  protocol?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/defi/liquidity/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function autoRebalance(data: {
  walletId: string;
  targetAllocation: Record<string, number>;
}) {
  const response = await fetch(`${API_BASE_URL}/api/defi/rebalance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Creator Payments API
export async function sendMicropayment(data: {
  creatorAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
  contentId?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/creator/micropayment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function sendTip(data: {
  creatorAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
  message?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/creator/tip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function createSubscription(data: {
  creatorAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
  tier?: string;
  billingCycle?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/creator/subscription/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function cancelSubscription(subscriptionId: string) {
  const response = await fetch(`${API_BASE_URL}/api/creator/subscription/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId }),
  });
  return response.json();
}

export async function listSubscriptions(walletId: string) {
  const response = await fetch(`${API_BASE_URL}/api/creator/subscriptions?walletId=${walletId}`);
  return response.json();
}

export async function nftGatedPayment(data: {
  creatorAddress: string;
  amount: string;
  walletId: string;
  tokenId: string;
  nftContract: string;
  contentId?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/creator/nft-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getCreatorRevenue(creatorAddress: string, period: string = '30d') {
  const response = await fetch(`${API_BASE_URL}/api/creator/revenue?creatorAddress=${creatorAddress}&period=${period}`);
  return response.json();
}

// Wallets API
export async function listWallets() {
  const response = await fetch(`${API_BASE_URL}/list_wallets`);
  return response.json();
}

export async function getWalletBalances() {
  const response = await fetch(`${API_BASE_URL}/list_wallets_with_balances`);
  return response.json();
}

// AI Chatbot API
export async function sendChatMessage(message: string, history: any[] = []) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  return response.json();
}
