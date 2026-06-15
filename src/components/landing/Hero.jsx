// src/components/landing/Hero.jsx
import { useState } from 'react';
import { ArrowRight, Star, Users, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithGoogle } from '../../firebase/auth';
import { useLibrary } from '../../contexts/LibraryContext';
import toast from 'react-hot-toast';
import SeatAvailabilityWidget from '../user/SeatAvailability';

export default function Hero() {
  const { user } = useAuth();
  const { settings } = useLibrary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCTA = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setLoading(true);
      try {
        await signInWithGoogle();
        toast.success('Welcome to FocusNest!');
        navigate('/dashboard');
      } catch {
        toast.error('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const stats = [
    { icon: Users, value: '500+', label: 'Happy Students' },
    { icon: Star, value: '4.9★', label: 'Average Rating' },
    { icon: Clock, value: '12hrs', label: 'Daily Operation' },
    { icon: Zap, value: settings.totalSeats, label: 'Seats per Shift' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-mesh">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="section-wrapper relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="animate-slide-up">
            <div className="section-tag mb-6">
              🎯 Premium Self-Study Space
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-display leading-tight mb-6">
              <span className="text-gray-900 dark:text-white">Study Smarter</span>
              <br />
              <span className="gradient-text text-shadow-glow">at FocusNest</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-lg">
              Book your dedicated study seat online in seconds. QR check-in, real-time availability, and a distraction-free environment — all for just <strong className="text-primary-400">₹300 per shift</strong>.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={handleCTA}
                disabled={loading}
                id="hero-cta-btn"
                className="btn-primary text-base px-8 py-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    {user ? 'Go to Dashboard' : 'Book a Seat Now'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <a href="#facilities" className="btn-secondary text-base px-8 py-4">
                Explore Facilities
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
                  <Icon className="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live Availability Card */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SeatAvailabilityWidget />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-50">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-primary-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
      </div>
    </section>
  );
}
