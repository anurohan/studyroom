// src/pages/AdminPanel.jsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-dark">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <AdminDashboard />;
}
