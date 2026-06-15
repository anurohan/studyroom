// src/utils/qrcode.js
// QR code data helpers

/** Generate the QR payload for a booking */
export const generateQRPayload = (booking) => {
  return JSON.stringify({
    bookingId: booking.id,
    uid: booking.uid,
    name: booking.userName,
    date: booking.date,
    shift: booking.shiftId,
    seat: booking.seatNumber,
    token: `FN-${booking.id?.slice(0, 8).toUpperCase()}`,
  });
};

/** Parse a scanned QR payload string */
export const parseQRPayload = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
