// src/components/admin/SeatMap.jsx
// Visual grid of all seats for a given date + shift, showing occupied / available
import { useState, useEffect } from 'react';
import { subscribeShiftBookings, createBooking, cancelBooking } from '../../firebase/firestore';
import { useLibrary } from '../../contexts/LibraryContext';
import { getTodayStr } from '../../utils/dateHelpers';
import { Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SeatMap({ date, shiftId }) {
  const { settings } = useLibrary();
  const totalSeats = settings.totalSeats || 51;
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingSeat, setLoadingSeat] = useState(null);

  useEffect(() => {
    if (!shiftId) return;
    const unsub = subscribeShiftBookings(date || getTodayStr(), shiftId, setBookings);
    return unsub;
  }, [date, shiftId]);

  const occupiedMap = {};
  bookings.forEach((b) => {
    if (b.status !== 'cancelled') occupiedMap[b.seatNumber] = b;
  });

  const bookedCount = Object.keys(occupiedMap).length;
  const availableCount = totalSeats - bookedCount;

  const handleManualOccupy = async (seatNum) => {
    setLoadingSeat(seatNum);
    try {
      const shift = settings.shifts.find((s) => s.id === shiftId);
      await createBooking({
        uid: 'admin-manual',
        userName: 'Walk-in User',
        userEmail: 'manual@focusnest.com',
        userPhoto: null,
        date: date || getTodayStr(),
        shiftId,
        shiftTime: shift?.time,
        seatNumber: seatNum,
        amount: shift?.price,
      });
      toast.success(`Seat #${seatNum} manually occupied`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update seat');
    } finally {
      setLoadingSeat(null);
    }
  };

  const handleManualFree = async (bookingId, seatNum) => {
    setLoadingSeat(seatNum);
    try {
      await cancelBooking(bookingId);
      toast.success(`Seat #${seatNum} is now available`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to free seat');
    } finally {
      setLoadingSeat(null);
    }
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/40" />
          <span className="text-gray-600 dark:text-gray-400">Available ({availableCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/40" />
          <span className="text-gray-600 dark:text-gray-400">Occupied ({bookedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-primary-500/20 border border-primary-500/40" />
          <span className="text-gray-600 dark:text-gray-400">Checked In</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-9 gap-2">
        {Array.from({ length: totalSeats }, (_, i) => {
          const seatNum = i + 1;
          const booking = occupiedMap[seatNum];
          const isCheckedIn = booking?.attendance === 'checked-in';
          const isOccupied = !!booking;
          const isLoading = loadingSeat === seatNum;

          return (
            <button
              key={seatNum}
              onClick={() => setSelected(selected === seatNum ? null : seatNum)}
              disabled={isLoading}
              title={isOccupied ? `Seat ${seatNum} — ${booking.userName}` : `Seat ${seatNum} — Available`}
              className={`relative flex items-center justify-center aspect-square rounded-lg text-xs font-bold transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ${
                isCheckedIn
                  ? 'bg-primary-500/30 border border-primary-500/60 text-primary-400'
                  : isOccupied
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
              } ${selected === seatNum ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : seatNum}
            </button>
          );
        })}
      </div>

      {/* Selected seat detail and actions */}
      {selected && (
        <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-surface-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="font-bold text-gray-900 dark:text-white text-lg">Seat #{selected}</span>
            </div>
            {occupiedMap[selected] ? (
               <button
                 onClick={() => handleManualFree(occupiedMap[selected].id, selected)}
                 disabled={loadingSeat === selected}
                 className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg font-semibold text-sm transition-colors"
               >
                 <XCircle className="w-4 h-4" />
                 Mark as Available
               </button>
            ) : (
               <button
                 onClick={() => handleManualOccupy(selected)}
                 disabled={loadingSeat === selected}
                 className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-lg font-semibold text-sm transition-colors"
               >
                 <CheckCircle className="w-4 h-4" />
                 Mark as Occupied
               </button>
            )}
          </div>

          {occupiedMap[selected] ? (
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-surface-card p-3 rounded-lg border border-gray-100 dark:border-surface-border">
              <span>Name:</span><span className="font-semibold text-gray-900 dark:text-white">{occupiedMap[selected].userName}</span>
              <span>Email:</span><span className="font-semibold text-gray-900 dark:text-white truncate">{occupiedMap[selected].userEmail}</span>
              <span>Attendance:</span>
              <span className={`font-semibold capitalize ${occupiedMap[selected].attendance === 'checked-in' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {occupiedMap[selected].attendance?.replace(/-/g, ' ')}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">This seat is currently available.</p>
          )}
        </div>
      )}
    </div>
  );
}
