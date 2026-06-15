// src/App.jsx
// Root application component — sets up router, contexts, and global layout
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LibraryProvider } from './contexts/LibraryContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';

// Layout wrapper — shows Navbar/Footer except on admin pages
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-surface-dark">
              <div className="text-8xl font-black gradient-text">404</div>
              <p className="text-gray-500 dark:text-gray-400 text-xl">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LibraryProvider>
            <AppLayout />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  borderRadius: '12px',
                  padding: '12px 16px',
                },
                success: {
                  style: {
                    background: '#10b981',
                    color: '#fff',
                  },
                  iconTheme: { primary: '#fff', secondary: '#10b981' },
                },
                error: {
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                  },
                  iconTheme: { primary: '#fff', secondary: '#ef4444' },
                },
              }}
            />
          </LibraryProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
