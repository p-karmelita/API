import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import { getTransactions } from '../api/mockApi';

export default function Transactions() {
  const allTransactions = getTransactions();
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesStatus = filter === 'all' || tx.status === filter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      Completed: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Failed: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { key: 'id', label: 'Transaction ID' },
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: string | number) => `${value} USDC`,
    },
    { key: 'recipient', label: 'Recipient' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string | number) => getStatusBadge(String(value)),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-1">View and manage all your payment transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Rent">Rent</option>
            <option value="Purchase">Purchase</option>
            <option value="Deposit">Deposit</option>
            <option value="Insurance">Insurance</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {allTransactions.length} transactions
          </p>
        </div>
        <Table
          columns={columns}
          data={filteredTransactions}
          emptyMessage="No transactions found matching your filters"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Total Completed</p>
          <p className="text-2xl font-bold text-gray-900">
            {allTransactions.filter((tx) => tx.status === 'Completed').length}
          </p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600 mb-1">Total Pending</p>
          <p className="text-2xl font-bold text-gray-900">
            {allTransactions.filter((tx) => tx.status === 'Pending').length}
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Total Failed</p>
          <p className="text-2xl font-bold text-gray-900">
            {allTransactions.filter((tx) => tx.status === 'Failed').length}
          </p>
        </div>
      </div>
    </div>
  );
}
