// src/contexts/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('focusnest-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('focusnest-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('focusnest-theme', 'light');
    }
  }, [dark]);

  const toggleTheme = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
