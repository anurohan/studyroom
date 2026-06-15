// src/components/user/Dashboard.jsx
// Full user dashboard: profile, book a seat, my bookings, attendance history
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import {
  subscribeUserBookings,
  getShiftBookings,
  createBooking,
} from '../../firebase/firestore';
import { getTodayStr, getNextNDays } from '../../utils/dateHelpers';
import BookingCard from './BookingCard';
import SeatAvailabilityWidget from './SeatAvailability';
import {
  User, Calendar, BookOpen, Clock, Sun, Sunset, Moon,
  ChevronRight, Loader2, PlusCircle, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const SHIFT_ICONS = { morning: Sun, afternoon: Sunset, evening: Moon };

export default function UserDashboard() {
  const { user, userProfile } = useAuth();
  const { settings } = useLibrary();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'mybookings'

  // Booking form state
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedShift, setSelectedShift] = useState('');
  const [booking, setBooking] = useState(false);

  const days = getNextNDays(7);

  // Subscribe to user bookings
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserBookings(user.uid, (data) => {
      setBookings(data);
      setLoadingBookings(false);
    });
    return unsub;
  }, [user]);

  const handleBook = async () => {
    if (!selectedShift) { toast.error('Please select a shift'); return; }
    setBooking(true);
    try {
      // Check availability
      const existing = await getShiftBookings(selectedDate, selectedShift);
      const activeBookings = existing.filter((b) => b.status !== 'cancelled');

      if (activeBookings.length >= settings.totalSeats) {
        toast.error('This shift is fully booked!');
        setBooking(false);
        return;
      }

      // Check duplicate booking
      const alreadyBooked = bookings.find(
        (b) => b.date === selectedDate && b.shiftId === selectedShift && b.status === 'confirmed'
      );
      if (alreadyBooked) {
        toast.error('You already have a booking for this shift!');
        setBooking(false);
        return;
      }

      // Assign seat number
      const takenSeats = new Set(activeBookings.map((b) => b.seatNumber));
      let seatNumber = null;
      for (let i = 1; i <= settings.totalSeats; i++) {
        if (!takenSeats.has(i)) { seatNumber = i; break; }
      }

      const shift = settings.shifts.find((s) => s.id === selectedShift);
      const bookingId = await createBooking({
        uid: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        userPhoto: user.photoURL,
        date: selectedDate,
        shiftId: selectedShift,
        shiftTime: shift?.time,
        seatNumber,
        amount: shift?.price,
      });

      toast.success(`🎉 Seat #${seatNumber} booked for ${shift?.label} shift!`);
      setActiveTab('mybookings');
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const attendanceRate = bookings.length > 0
    ? Math.round((bookings.filter((b) => b.attendance !== 'not-checked-in').length / bookings.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark pt-20 pb-12">
      <div className="section-wrapper">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-6 rounded-3xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=6366f1&color=fff&size=80`}
            alt="avatar"
            className="w-16 h-16 rounded-2xl ring-2 ring-primary-500/50 object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-black font-display text-gray-900 dark:text-white">
              Welcome back, {user?.displayName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{user?.email}</p>
          </div>
          {/* Stats chips */}
          <div className="flex flex-wrap gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border">
              <div className="text-xl font-black text-primary-500">{activeBookings.length}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border">
              <div className="text-xl font-black text-emerald-500">₹{totalSpent}</div>
              <div className="text-xs text-gray-500">Spent</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border">
              <div className="text-xl font-black text-amber-500">{attendanceRate}%</div>
              <div className="text-xs text-gray-500">Attendance</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-surface-card rounded-2xl mb-8 w-fit">
          {[
            { key: 'book', label: 'Book a Seat', icon: PlusCircle },
            { key: 'mybookings', label: 'My Bookings', icon: BookOpen },
            { key: 'availability', label: 'Live Seats', icon: TrendingUp },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              id={`tab-${key}`}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white dark:bg-surface-darker text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'book' && (
          <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="space-y-6">
              <div className="bg-white dark:bg-surface-card rounded-3xl border border-gray-200/50 dark:border-surface-border p-6">
                <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-400" />
                  Select Date & Shift
                </h2>

                {/* Date Picker */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Choose Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {days.map((day) => {
                      const d = new Date(day);
                      const isSelected = day === selectedDate;
                      const isToday = day === getTodayStr();
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(day)}
                          className={`flex flex-col items-center min-w-[60px] px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 border ${
                            isSelected
                              ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/30'
                              : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary-400'
                          }`}
                        >
                          <span className="text-xs opacity-70">
                            {d.toLocaleDateString('en', { weekday: 'short' })}
                          </span>
                          <span className="text-lg font-black">{d.getDate()}</span>
                          {isToday && <span className="text-[10px] opacity-60">Today</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Shift Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Choose Shift
                  </label>
                  <div className="grid gap-3">
                    {settings.shifts?.map((shift) => {
                      const Icon = SHIFT_ICONS[shift.id] || Sun;
                      const isSelected = selectedShift === shift.id;
                      return (
                        <button
                          key={shift.id}
                          onClick={() => setSelectedShift(shift.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-gray-200 dark:border-surface-border hover:border-primary-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary-500' : 'bg-gray-100 dark:bg-white/10'}`}>
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                            </div>
                            <div>
                              <div className={`font-semibold ${isSelected ? 'text-primary-500' : 'text-gray-900 dark:text-white'}`}>
                                {shift.label}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{shift.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-lg ${isSelected ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'}`}>
                              ₹{shift.price}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBook}
                  disabled={booking || !selectedShift}
                  id="confirm-booking-btn"
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</>
                  ) : (
                    <><PlusCircle className="w-5 h-5" /> Confirm Booking</>
                  )}
                </button>
              </div>
            </div>

            {/* Right side: live availability */}
            <div>
              <SeatAvailabilityWidget />
            </div>
          </div>
        )}

        {activeTab === 'mybookings' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">
              My Bookings ({bookings.length})
            </h2>
            {loadingBookings ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-semibold mb-1">No bookings yet</p>
                <p className="text-sm">Book your first seat to get started!</p>
                <button onClick={() => setActiveTab('book')} className="btn-primary mt-4">
                  Book a Seat
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="max-w-lg animate-fade-in">
            <SeatAvailabilityWidget />
          </div>
        )}
      </div>
    </div>
  );
}
