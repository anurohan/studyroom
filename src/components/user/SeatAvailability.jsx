// src/components/user/SeatAvailability.jsx
// Live seat availability dashboard — used on landing page hero AND user dashboard
import { useState, useEffect } from 'react';
import { subscribeShiftBookings } from '../../firebase/firestore';
import { useLibrary } from '../../contexts/LibraryContext';
import { getTodayStr } from '../../utils/dateHelpers';
import { Users, Sun, Sunset, Moon, RefreshCw } from 'lucide-react';

const SHIFT_CONFIG = {
  morning:   { icon: Sun,     gradient: 'from-amber-500 to-orange-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',  bar: 'bg-gradient-to-r from-amber-400 to-orange-400' },
  afternoon: { icon: Sunset,  gradient: 'from-primary-500 to-violet-500', bg: 'bg-primary-500/10', border: 'border-primary-500/20', bar: 'bg-gradient-to-r from-primary-400 to-violet-400' },
  evening:   { icon: Moon,    gradient: 'from-purple-600 to-pink-600',    bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  bar: 'bg-gradient-to-r from-purple-400 to-pink-400' },
};

function ShiftCard({ shift, totalSeats }) {
  const [booked, setBooked] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = getTodayStr();
  const cfg = SHIFT_CONFIG[shift.id] || SHIFT_CONFIG.afternoon;
  const Icon = cfg.icon;
  const available = Math.max(0, totalSeats - booked);
  const pct = Math.round((booked / totalSeats) * 100);
  const isFull = available === 0;
  const isAlmostFull = pct >= 80 && !isFull;

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeShiftBookings(today, shift.id, (bookings) => {
      const active = bookings.filter((b) => b.status !== 'cancelled').length;
      setBooked(active);
      setLoading(false);
    });
    return unsub;
  }, [today, shift.id]);

  return (
    <div className={`relative p-5 rounded-2xl border ${cfg.border} ${cfg.bg} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">{shift.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{shift.time}</div>
          </div>
        </div>
        <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          isFull ? 'bg-red-500/20 text-red-400' :
          isAlmostFull ? 'bg-amber-500/20 text-amber-400' :
          'bg-emerald-500/20 text-emerald-400'
        }`}>
          {isFull ? 'Full' : isAlmostFull ? 'Filling Fast' : 'Available'}
        </div>
      </div>

      {loading ? (
        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse mb-3" />
      ) : (
        <>
          <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {booked}/{totalSeats} booked
            </span>
            <span className={`font-bold ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
              {available} left
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function SeatAvailabilityWidget() {
  const { settings } = useLibrary();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">Live Availability</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Today's seat status</p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4" key={refreshKey}>
        {settings.shifts?.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} totalSeats={settings.totalSeats} />
        ))}
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-4">
        🔴 Updates in real-time via Firebase
      </p>
    </div>
  );
}
