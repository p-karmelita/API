import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { clearUser } from '../api/mockApi';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
