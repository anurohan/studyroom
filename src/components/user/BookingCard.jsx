// src/components/user/BookingCard.jsx
// Displays a single booking with status, QR code access, and cancel option
import { useState } from 'react';
import { QrCode, Calendar, Clock, MapPin, XCircle, CheckCircle, LogOut } from 'lucide-react';
import { cancelBooking, markAttendance } from '../../firebase/firestore';
import QRCodeDisplay from './QRCodeDisplay';
import { formatDate, formatTimestamp } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  confirmed: 'badge-blue',
  cancelled: 'badge-red',
};
const ATTENDANCE_STYLES = {
  'not-checked-in': 'badge-yellow',
  'checked-in': 'badge-green',
  'checked-out': { className: 'badge bg-gray-500/20 text-gray-400 border border-gray-500/30' },
};

export default function BookingCard({ booking, onRefresh }) {
  const [showQR, setShowQR] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const isCancelled = booking.status === 'cancelled';
  const isCheckedIn = booking.attendance === 'checked-in';
  const isCheckedOut = booking.attendance === 'checked-out';

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await cancelBooking(booking.id);
      toast.success('Booking cancelled');
      onRefresh?.();
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await markAttendance(booking.id, 'checked-out');
      toast.success('Checked out successfully. See you tomorrow!');
    } catch {
      toast.error('Checkout failed. Try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <div className={`relative p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
        isCancelled
          ? 'bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/5 opacity-60'
          : 'bg-white dark:bg-surface-card border-gray-200/50 dark:border-surface-border hover:border-primary-500/30'
      }`}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 dark:text-white capitalize">{booking.shiftId} Shift</span>
              <span className={isCancelled ? 'badge-red' : 'badge-blue'}>
                {booking.status}
              </span>
              {!isCancelled && (
                <span className={
                  isCheckedIn ? 'badge-green' :
                  isCheckedOut ? 'badge bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                  'badge-yellow'
                }>
                  {booking.attendance === 'not-checked-in' ? 'Not Checked In' :
                   booking.attendance === 'checked-in' ? 'Checked In' : 'Checked Out'}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-gray-900 dark:text-white">#{booking.seatNumber}</div>
            <div className="text-xs text-gray-500">Seat</div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 text-primary-400 shrink-0" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 text-primary-400 shrink-0" />
            <span>{booking.shiftTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 col-span-2">
            <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
            <span className="truncate">Booked on {formatTimestamp(booking.createdAt)}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-white/5 mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</span>
          <span className="font-bold text-primary-500">₹{booking.amount}</span>
        </div>

        {/* Actions */}
        {!isCancelled && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowQR(true)}
              id={`qr-${booking.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all"
            >
              <QrCode className="w-4 h-4" />
              View QR
            </button>
            {isCheckedIn && (
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {checkingOut ? 'Checking out...' : 'Check Out'}
              </button>
            )}
            {!isCheckedIn && !isCheckedOut && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 ml-auto"
              >
                <XCircle className="w-4 h-4" />
                {cancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        )}
      </div>

      {showQR && <QRCodeDisplay booking={booking} onClose={() => setShowQR(false)} />}
    </>
  );
}
