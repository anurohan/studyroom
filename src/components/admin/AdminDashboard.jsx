// src/components/admin/AdminDashboard.jsx
// Main admin panel — tabs: Overview, Bookings, Seat Map, Users, Settings
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, Grid3X3, Users, Settings,
  TrendingUp, IndianRupee, Calendar, UserCheck,
  Loader2, Sun, Sunset, Moon, CheckCircle, XCircle, Clock
} from 'lucide-react';
import {
  subscribeAllBookings,
  subscribeAllUsers,
  markAttendance,
  getAllBookings,
} from '../../firebase/firestore';
import { useLibrary } from '../../contexts/LibraryContext';
import { getTodayStr, formatDate, formatTimestamp } from '../../utils/dateHelpers';
import SeatMap from './SeatMap';
import LibrarySettings from './LibrarySettings';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { key: 'bookings',  label: 'Bookings',  icon: BookOpen },
  { key: 'seatmap',   label: 'Seat Map',  icon: Grid3X3 },
  { key: 'users',     label: 'Users',     icon: Users },
  { key: 'settings',  label: 'Settings',  icon: Settings },
];

export default function AdminDashboard() {
  const { settings } = useLibrary();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seatMapShift, setSeatMapShift] = useState('morning');
  const [seatMapDate, setSeatMapDate] = useState(getTodayStr());

  useEffect(() => {
    const unsub1 = subscribeAllBookings((data) => { setBookings(data); setLoading(false); });
    const unsub2 = subscribeAllUsers(setUsers);
    return () => { unsub1(); unsub2(); };
  }, []);

  const today = getTodayStr();
  const todayBookings = bookings.filter((b) => b.date === today && b.status !== 'cancelled');
  const todayRevenue = todayBookings.reduce((s, b) => s + (b.amount || 0), 0);

  const thisMonthStr = today.slice(0, 7);
  const monthRevenue = bookings
    .filter((b) => b.date?.startsWith(thisMonthStr) && b.status !== 'cancelled')
    .reduce((s, b) => s + (b.amount || 0), 0);

  const checkedInToday = todayBookings.filter((b) => b.attendance === 'checked-in').length;

  const shiftCounts = {};
  settings.shifts?.forEach((s) => {
    shiftCounts[s.id] = todayBookings.filter((b) => b.shiftId === s.id).length;
  });

  const handleMarkAttendance = async (bookingId, status) => {
    try {
      await markAttendance(bookingId, status);
      toast.success(`Marked as ${status.replace('-', ' ')}`);
    } catch {
      toast.error('Failed to update attendance');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark pt-20 pb-12">
      <div className="section-wrapper">
        <div className="mb-8">
          <h1 className="text-3xl font-black font-display text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage {settings.libraryName}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-surface-card rounded-2xl mb-8 overflow-x-auto no-scrollbar w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              id={`admin-tab-${key}`}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
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

        {/* ─── Overview Tab ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today's Bookings", value: todayBookings.length, icon: BookOpen, color: 'text-primary-400', bg: 'bg-primary-500/10' },
                { label: "Today's Revenue", value: `₹${todayRevenue}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: "Monthly Revenue", value: `₹${monthRevenue}`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { label: "Checked In Today", value: checkedInToday, icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="stat-card bg-white dark:bg-surface-card border border-gray-200/50 dark:border-surface-border">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shift Occupancy */}
            <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-400" /> Today's Shift Occupancy
              </h3>
              <div className="space-y-4">
                {settings.shifts?.map((shift) => {
                  const count = shiftCounts[shift.id] || 0;
                  const pct = Math.round((count / settings.totalSeats) * 100);
                  const Icon = { morning: Sun, afternoon: Sunset, evening: Moon }[shift.id] || Sun;
                  return (
                    <div key={shift.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Icon className="w-4 h-4 text-primary-400" />
                          {shift.label} — {shift.time}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{count}/{settings.totalSeats}</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Student</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Shift</th>
                      <th className="pb-3 font-semibold">Seat</th>
                      <th className="pb-3 font-semibold">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {bookings.slice(0, 8).map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3">
                          <div className="font-medium text-gray-900 dark:text-white">{b.userName}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[140px]">{b.userEmail}</div>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{b.date}</td>
                        <td className="py-3 capitalize text-gray-600 dark:text-gray-400">{b.shiftId}</td>
                        <td className="py-3">
                          <span className="badge-blue">#{b.seatNumber}</span>
                        </td>
                        <td className="py-3">
                          <span className={
                            b.attendance === 'checked-in' ? 'badge-green' :
                            b.attendance === 'checked-out' ? 'badge bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                            b.status === 'cancelled' ? 'badge-red' :
                            'badge-yellow'
                          }>
                            {b.status === 'cancelled' ? 'Cancelled' :
                             b.attendance === 'checked-in' ? 'Checked In' :
                             b.attendance === 'checked-out' ? 'Checked Out' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── Bookings Tab ─── */}
        {activeTab === 'bookings' && (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">All Bookings ({bookings.length})</h3>
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Student</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Shift</th>
                        <th className="pb-3 font-semibold">Seat</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Attendance</th>
                        <th className="pb-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                          <td className="py-3">
                            <div className="font-medium text-gray-900 dark:text-white">{b.userName}</div>
                            <div className="text-xs text-gray-400">{b.userEmail}</div>
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{b.date}</td>
                          <td className="py-3 capitalize text-gray-600 dark:text-gray-400">{b.shiftId}</td>
                          <td className="py-3"><span className="badge-blue">#{b.seatNumber}</span></td>
                          <td className="py-3 font-semibold text-emerald-500">₹{b.amount}</td>
                          <td className="py-3">
                            <span className={
                              b.attendance === 'checked-in' ? 'badge-green' :
                              b.attendance === 'checked-out' ? 'badge bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                              b.status === 'cancelled' ? 'badge-red' :
                              'badge-yellow'
                            }>
                              {b.status === 'cancelled' ? 'Cancelled' :
                               b.attendance === 'checked-in' ? 'In' :
                               b.attendance === 'checked-out' ? 'Out' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3">
                            {b.status !== 'cancelled' && b.attendance === 'not-checked-in' && (
                              <button
                                onClick={() => handleMarkAttendance(b.id, 'checked-in')}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all"
                              >
                                <CheckCircle className="w-3 h-3" /> Check In
                              </button>
                            )}
                            {b.attendance === 'checked-in' && (
                              <button
                                onClick={() => handleMarkAttendance(b.id, 'checked-out')}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-all"
                              >
                                <Clock className="w-3 h-3" /> Check Out
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Seat Map Tab ─── */}
        {activeTab === 'seatmap' && (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    className="input-field text-sm"
                    value={seatMapDate}
                    onChange={(e) => setSeatMapDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Shift</label>
                  <select
                    className="input-field text-sm"
                    value={seatMapShift}
                    onChange={(e) => setSeatMapShift(e.target.value)}
                  >
                    {settings.shifts?.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <SeatMap date={seatMapDate} shiftId={seatMapShift} />
            </div>
          </div>
        )}

        {/* ─── Users Tab ─── */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">All Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Total Bookings</th>
                      <th className="pb-3 font-semibold">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {users.map((u) => {
                      const userBookings = bookings.filter((b) => b.uid === u.uid && b.status !== 'cancelled');
                      const spent = userBookings.reduce((s, b) => s + (b.amount || 0), 0);
                      return (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={u.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=6366f1&color=fff`}
                                alt=""
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                          <td className="py-3">
                            <span className={u.role === 'admin' ? 'badge-yellow' : 'badge-blue'}>{u.role || 'student'}</span>
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{userBookings.length}</td>
                          <td className="py-3 font-semibold text-emerald-500">₹{spent}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── Settings Tab ─── */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <LibrarySettings />
          </div>
        )}
      </div>
    </div>
  );
}
