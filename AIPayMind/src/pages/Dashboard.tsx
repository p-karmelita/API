import { DollarSign, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { getUser } from '../api/mockApi';
import { getDashboardStats, getRecentTransactions as getRecentTx, sendPayment } from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Fetch dashboard stats from API
    getDashboardStats().then(res => {
      if (res.success) {
        setStats(res.data);
      }
    }).catch(() => {
      // Fallback to mock data if API fails
      setStats({
        balance: 1200,
        activePayments: 3,
        pendingPayments: 2,
        monthlyVolume: 2450
      });
    });

    // Fetch recent transactions from API
    getRecentTx(3).then(res => {
      if (res.success && res.data.length > 0) {
        setRecentTransactions(res.data);
      } else {
        // Fallback to mock data
        setRecentTransactions([
          { id: 'TX001', type: 'Rent', amount: 600, status: 'Completed', date: '2025-11-01', recipient: '0xABC...123' },
          { id: 'TX002', type: 'Deposit', amount: 300, status: 'Pending', date: '2025-11-05', recipient: '0xDEF...456' },
          { id: 'TX003', type: 'Insurance', amount: 150, status: 'Completed', date: '2025-10-28', recipient: '0xGHI...789' }
        ]);
      }
    }).catch(() => {
      // Fallback to mock data
      setRecentTransactions([
        { id: 'TX001', type: 'Rent', amount: 600, status: 'Completed', date: '2025-11-01', recipient: '0xABC...123' },
        { id: 'TX002', type: 'Deposit', amount: 300, status: 'Pending', date: '2025-11-05', recipient: '0xDEF...456' },
        { id: 'TX003', type: 'Insurance', amount: 150, status: 'Completed', date: '2025-10-28', recipient: '0xGHI...789' }
      ]);
    });
  }, []);

  const statsDisplay = stats ? [
    {
      title: 'USDC Balance',
      value: `${stats.balance.toLocaleString()} USDC`,
      icon: <DollarSign className="w-6 h-6" />,
      change: '+2.5%',
      changeType: 'positive',
    },
    {
      title: 'Active Payments',
      value: stats.activePayments.toString(),
      icon: <Activity className="w-6 h-6" />,
      change: `${stats.pendingPayments} pending`,
      changeType: 'neutral',
    },
    {
      title: 'Monthly Volume',
      value: `${stats.monthlyVolume.toLocaleString()} USDC`,
      icon: <TrendingUp className="w-6 h-6" />,
      change: '+12.3%',
      changeType: 'positive',
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your payments today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsDisplay.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-sm mt-2 ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : stat.changeType === 'neutral'
                      ? 'text-gray-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Transactions">
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{tx.type}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{tx.recipient}</p>
                  <p className="text-xs text-gray-500 mt-1">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{tx.amount} USDC</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Order Status">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Rent Payment - Completed</p>
                  <p className="text-sm text-gray-600 mt-1">600 USDC transferred successfully</p>
                  <p className="text-xs text-gray-500 mt-2">Completed on Nov 1, 2025</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Deposit - Pending</p>
                  <p className="text-sm text-gray-600 mt-1">300 USDC awaiting confirmation</p>
                  <p className="text-xs text-gray-500 mt-2">Expected completion: Nov 5, 2025</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Transfer - Failed</p>
                  <p className="text-sm text-gray-600 mt-1">450 USDC transaction failed</p>
                  <p className="text-xs text-gray-500 mt-2">Please retry or contact support</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-center"
          >
            <p className="font-medium text-gray-900">Send Payment</p>
            <p className="text-xs text-gray-600 mt-1">Quick transfer</p>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-center"
          >
            <p className="font-medium text-gray-900">Schedule</p>
            <p className="text-xs text-gray-600 mt-1">Automate payments</p>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-center"
          >
            <p className="font-medium text-gray-900">AI Assistant</p>
            <p className="text-xs text-gray-600 mt-1">Chat with AI</p>
          </button>
          <button
            onClick={() => navigate('/transactions')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-center"
          >
            <p className="font-medium text-gray-900">History</p>
            <p className="text-xs text-gray-600 mt-1">View all</p>
          </button>
        </div>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Send Payment</h2>

            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Sent!</h3>
                <p className="text-sm text-gray-600 mb-6">Your USDC payment has been initiated</p>
                <button
                  onClick={() => {
                    setPaymentSuccess(false);
                    setShowPaymentModal(false);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setPaymentError(null);
                setIsPaymentLoading(true);

                const formData = new FormData(e.currentTarget);
                const destinationAddress = formData.get('address') as string;
                const amount = formData.get('amount') as string;

                // For now, use demo wallet ID and token ID
                // In production, these would come from user's wallet connection
                const walletId = 'demo_wallet_id';
                const tokenId = 'usdc_token_id';

                try {
                  const result = await sendPayment({
                    destinationAddress,
                    amount,
                    walletId,
                    tokenId
                  });

                  if (result.success) {
                    setPaymentSuccess(true);
                    // Refresh dashboard stats
                    getDashboardStats().then(res => {
                      if (res.success) setStats(res.data);
                    });
                  } else {
                    setPaymentError(result.error || 'Payment failed. Please check your wallet configuration.');
                  }
                } catch (error) {
                  setPaymentError('Unable to connect to payment service. Please make sure backend is running and wallet is configured.');
                } finally {
                  setIsPaymentLoading(false);
                }
              }}>
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{paymentError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="0xDCBD19eb43cD48184999e88e3fd55961322D4865"
                      defaultValue="0xDCBD19eb43cD48184999e88e3fd55961322D4865"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC)</label>
                    <input
                      type="number"
                      name="amount"
                      placeholder="100"
                      step="0.01"
                      min="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                    <input
                      type="text"
                      name="note"
                      placeholder="Payment for..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> To send real payments, configure your Circle API keys in the backend .env file with your wallet ID and entity secret.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentError(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isPaymentLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPaymentLoading}
                  >
                    {isPaymentLoading ? 'Sending...' : 'Send Payment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
