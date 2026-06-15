// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, BookOpen, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { logOut, signInWithGoogle } from '../../firebase/auth';
import toast from 'react-hot-toast';

export default function Navbar({ onLoginClick }) {
  const { dark, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const { settings } = useLibrary();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    await logOut();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (e) {
      toast.error('Login failed. Try again.');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Facilities', href: '/#facilities' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-gray-200/50 dark:border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="section-wrapper">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              {settings.libraryName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="nav-link text-sm font-medium">
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-yellow-500 hover:bg-yellow-500/10 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-400 hover:bg-primary-500/10 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=6366f1&color=fff`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-primary-500/50"
                />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleGoogleLogin} className="btn-primary text-sm py-2 px-5">
                  Sign In with Google
                </button>
                <Link to="/admin/login" className="btn-secondary text-sm py-2 px-4">
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 pb-6 border-t border-gray-200/50 dark:border-white/10 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-b-2xl animate-fade-in">
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 font-medium transition-all"
                >
                  {l.label}
                </a>
              ))}
              <div className="border-t border-gray-200/50 dark:border-white/10 mt-2 pt-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-primary-400 hover:bg-primary-500/10 font-medium transition-all">
                      <LayoutDashboard className="w-4 h-4" /> My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-yellow-400 hover:bg-yellow-500/10 font-medium transition-all">
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-all text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { handleGoogleLogin(); setMenuOpen(false); }} className="w-full btn-primary justify-center mt-1">
                      Sign In with Google
                    </button>
                    <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="w-full btn-secondary justify-center mt-2">
                      Admin Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
