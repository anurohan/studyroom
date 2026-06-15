// src/pages/AdminLogin.jsx
// Separate admin login page with email/password form
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmail } from '../firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, Eye, EyeOff, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  // If already logged in as admin, redirect
  if (user && isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        toast.error('Invalid email or password');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark flex items-center justify-center p-4 bg-mesh">
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display gradient-text">FocusNest</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-yellow-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Portal</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to manage FocusNest Library</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-card rounded-3xl border border-gray-200/50 dark:border-surface-border shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin@focusnest.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Access Admin Panel</>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-400 text-center">
              🔐 Default credentials: <strong>admin@focusnest.com</strong> / <strong>admin123</strong>
              <br />
              <span className="opacity-70">(Change after first login via Firebase Console)</span>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
