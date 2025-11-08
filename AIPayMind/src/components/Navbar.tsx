import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import Button from './Button';

interface NavbarProps {
  isLoggedIn?: boolean;
  onConnectWallet?: () => void;
}

export default function Navbar({ isLoggedIn = false, onConnectWallet }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PayMind</span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Button variant="primary" size="sm" onClick={onConnectWallet}>
                  Connect Wallet
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
