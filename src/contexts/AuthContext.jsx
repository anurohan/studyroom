// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '../firebase/auth';
import { getUser } from '../firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUser(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const isAdmin = user?.email === (import.meta.env.VITE_ADMIN_EMAIL || 'admin@focusnest.com');

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
