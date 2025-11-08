import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Wallet, Bell, Globe } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getUser, saveUser, clearUser } from '../api/mockApi';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  const handleToggleNotifications = () => {
    const updatedUser = { ...user, notifications: !user.notifications };
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedUser = { ...user, language: e.target.value };
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const handleDisconnectWallet = () => {
    clearUser();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <Card title="Personal Information">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={user.wallet}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600">Receive payment alerts and updates</p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user.notifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Globe className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <label htmlFor="language" className="block font-medium text-gray-900 mb-2">
                Language
              </label>
              <select
                id="language"
                value={user.language}
                onChange={handleLanguageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Account Balance">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Current Balance</p>
          <p className="text-3xl font-bold text-gray-900">{user.balance.toLocaleString()} USDC</p>
          <p className="text-sm text-gray-600 mt-2">on Arc Blockchain</p>
        </div>
      </Card>

      <Card title="Danger Zone">
        <div className="space-y-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="font-medium text-red-900 mb-2">Disconnect Wallet</p>
            <p className="text-sm text-red-700 mb-4">
              This will log you out and clear your session data. You'll need to reconnect to access
              your account.
            </p>
            <Button variant="secondary" onClick={handleDisconnectWallet} className="bg-red-600 hover:bg-red-700">
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
