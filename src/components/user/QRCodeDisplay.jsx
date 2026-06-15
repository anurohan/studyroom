// src/components/user/QRCodeDisplay.jsx
// Shows the unique QR code for a booking, with download option
import { QRCodeSVG } from 'qrcode.react';
import { generateQRPayload } from '../../utils/qrcode';
import { Download, X, CheckCircle, Clock } from 'lucide-react';
import { useRef } from 'react';

export default function QRCodeDisplay({ booking, onClose }) {
  const qrRef = useRef(null);
  const payload = generateQRPayload(booking);

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusnest-booking-${booking.id?.slice(0, 8)}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isCheckedIn = booking.attendance === 'checked-in';
  const isCheckedOut = booking.attendance === 'checked-out';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-surface-card rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">Your Entry Pass</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Show QR at the library entrance</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Booking info */}
        <div className="bg-primary-500/10 rounded-2xl p-4 mb-6 border border-primary-500/20">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Seat</div>
              <div className="font-bold text-gray-900 dark:text-white text-lg">#{booking.seatNumber}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Shift</div>
              <div className="font-bold text-gray-900 dark:text-white capitalize">{booking.shiftId}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Date</div>
              <div className="font-semibold text-gray-900 dark:text-white">{booking.date}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
              <div className={`font-semibold ${isCheckedIn ? 'text-emerald-400' : isCheckedOut ? 'text-gray-400' : 'text-amber-400'}`}>
                {isCheckedIn ? '✓ Checked In' : isCheckedOut ? 'Checked Out' : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div ref={qrRef} className="flex items-center justify-center mb-6">
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
            <QRCodeSVG
              value={payload}
              size={200}
              bgColor="#ffffff"
              fgColor="#1e1b4b"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Attendance status */}
        <div className={`flex items-center gap-2.5 p-3 rounded-xl mb-4 text-sm font-medium ${
          isCheckedIn ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          isCheckedOut ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {isCheckedIn ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {isCheckedIn ? 'You are checked in!' : isCheckedOut ? 'Session completed' : 'Scan to check in at library'}
        </div>

        <button
          onClick={downloadQR}
          className="w-full btn-primary justify-center"
        >
          <Download className="w-4 h-4" />
          Download QR Pass
        </button>
      </div>
    </div>
  );
}
