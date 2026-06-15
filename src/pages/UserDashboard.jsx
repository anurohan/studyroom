// src/pages/UserDashboard.jsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserDashboardComponent from '../components/user/Dashboard';
import { Loader2 } from 'lucide-react';

export default function UserDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return <UserDashboardComponent />;
}
