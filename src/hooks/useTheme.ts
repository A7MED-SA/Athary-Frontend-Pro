import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'default' | 'theme-gold' | 'theme-forest' | 'theme-graphite';

// Global function to apply theme mode and colors to documentElement
export function applyTheme(mode: ThemeMode, color: ThemeColor) {
  if (typeof window === 'undefined') return;

  // 1. Handle Dark/Light mode
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 2. Handle Color Palette
  const classList = document.documentElement.classList;
  classList.remove('theme-gold', 'theme-forest', 'theme-graphite');
  
  if (color !== 'default') {
    classList.add(color);
  }
}

export function useTheme() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme-mode') as ThemeMode) || 'light';
  });

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return 'default';
    const saved = localStorage.getItem('theme-color') || 'default';
    // Backwards compatibility/normalization
    if (saved === 'gold') return 'theme-gold';
    if (saved === 'forest') return 'theme-forest';
    if (saved === 'graphite') return 'theme-graphite';
    return saved as ThemeColor;
  });

  // Listener to react when the theme is changed in another component or tab
  useEffect(() => {
    const handleSync = () => {
      const currentMode = (localStorage.getItem('theme-mode') as ThemeMode) || 'light';
      const storedColor = localStorage.getItem('theme-color') || 'default';
      
      let currentColor: ThemeColor = 'default';
      if (storedColor === 'gold' || storedColor === 'theme-gold') currentColor = 'theme-gold';
      else if (storedColor === 'forest' || storedColor === 'theme-forest') currentColor = 'theme-forest';
      else if (storedColor === 'graphite' || storedColor === 'theme-graphite') currentColor = 'theme-graphite';

      setThemeModeState(currentMode);
      setThemeColorState(currentColor);
    };

    window.addEventListener('theme-changed', handleSync);
    return () => {
      window.removeEventListener('theme-changed', handleSync);
    };
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem('theme-mode', mode);
    setThemeModeState(mode);
    applyTheme(mode, themeColor);
    window.dispatchEvent(new Event('theme-changed'));
  };

  const setThemeColor = (color: ThemeColor) => {
    // Normalize storage key matching standard structure or storing direct classname
    let keyToStore = 'default';
    if (color === 'theme-gold') keyToStore = 'gold';
    else if (color === 'theme-forest') keyToStore = 'forest';
    else if (color === 'theme-graphite') keyToStore = 'graphite';

    localStorage.setItem('theme-color', keyToStore);
    setThemeColorState(color);
    applyTheme(themeMode, color);
    window.dispatchEvent(new Event('theme-changed'));
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return {
    themeMode,
    themeColor,
    setThemeMode,
    setThemeColor,
    toggleThemeMode,
  };
}
