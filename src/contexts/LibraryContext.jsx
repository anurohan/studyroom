// src/contexts/LibraryContext.jsx
// Provides live library settings (name, seats, pricing, shifts) from Firestore
import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeSettings, seedDefaultSettings } from '../firebase/firestore';

const DEFAULT_SETTINGS = {
  libraryName: 'FocusNest Library',
  address: '123 Study Lane, Knowledge City, India',
  totalSeats: 51,
  shifts: [
    { id: 'morning',   label: 'Morning',   time: '10:00 AM – 2:00 PM',  price: 300 },
    { id: 'afternoon', label: 'Afternoon',  time: '2:00 PM – 6:00 PM',   price: 300 },
    { id: 'evening',   label: 'Evening',    time: '6:00 PM – 10:00 PM',  price: 300 },
  ],
  facilities: [
    'High-Speed WiFi', 'Air Conditioning', 'Quiet Zone',
    'Power Sockets', 'Purified Water', 'CCTV Security',
    'Locker Facility', 'Printing Service',
  ],
  whatsapp: '919999999999',
};

const LibraryContext = createContext(DEFAULT_SETTINGS);

export const LibraryProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    // Seed defaults on first load if Firestore is empty
    seedDefaultSettings().catch(() => {});

    const unsub = subscribeSettings((data) => {
      setSettings({ ...DEFAULT_SETTINGS, ...data });
      setLoadingSettings(false);
    });

    // Fallback: if no Firestore data within 3s, use defaults
    const timer = setTimeout(() => setLoadingSettings(false), 3000);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return (
    <LibraryContext.Provider value={{ settings, loadingSettings }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
