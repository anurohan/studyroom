// src/components/landing/Pricing.jsx
import { Check, Sun, Sunset, Moon, ArrowRight } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithGoogle } from '../../firebase/auth';
import toast from 'react-hot-toast';

const SHIFT_ICONS = { morning: Sun, afternoon: Sunset, evening: Moon };
const SHIFT_GRADIENTS = {
  morning: 'from-amber-500 to-orange-500',
  afternoon: 'from-primary-500 to-violet-500',
  evening: 'from-purple-600 to-pink-600',
};
const SHIFT_GLOW = {
  morning: 'shadow-amber-500/30 hover:shadow-amber-500/50',
  afternoon: 'shadow-primary-500/30 hover:shadow-primary-500/50',
  evening: 'shadow-purple-500/30 hover:shadow-purple-500/50',
};

const FEATURES = [
  'Assigned seat number',
  'QR code entry pass',
  'Access to all facilities',
  'Real-time availability',
  'Instant booking confirmation',
];

export default function Pricing() {
  const { settings } = useLibrary();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBook = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      try {
        await signInWithGoogle();
        navigate('/dashboard');
      } catch {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <section id="pricing" className="py-24 dark:bg-surface-card/30 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="section-wrapper">
        <div className="text-center mb-16">
          <div className="section-tag">💳 Simple Pricing</div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-4">
            Choose Your <span className="gradient-text">Study Shift</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Flat rate for all shifts. Book any session that fits your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {settings.shifts?.map((shift, i) => {
            const Icon = SHIFT_ICONS[shift.id] || Sun;
            const gradient = SHIFT_GRADIENTS[shift.id] || SHIFT_GRADIENTS.afternoon;
            const glow = SHIFT_GLOW[shift.id] || SHIFT_GLOW.afternoon;
            const isPopular = shift.id === 'afternoon';

            return (
              <div
                key={shift.id}
                className={`relative rounded-3xl border transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl ${glow} ${
                  isPopular
                    ? 'bg-gradient-to-b from-primary-500/10 to-purple-500/10 border-primary-500/50 shadow-xl shadow-primary-500/20'
                    : 'bg-white dark:bg-surface-card border-gray-200 dark:border-surface-border hover:border-primary-500/30'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-primary-500 to-purple-500 shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-1">
                    {shift.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{shift.time}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">₹</span>
                    <span className="text-5xl font-black font-display text-gray-900 dark:text-white">{shift.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">/shift</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {FEATURES.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleBook}
                    id={`book-${shift.id}-btn`}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isPopular
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl hover:opacity-90`
                        : 'border-2 border-gray-200 dark:border-surface-border text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400'
                    }`}
                  >
                    Book {shift.label} Shift
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
