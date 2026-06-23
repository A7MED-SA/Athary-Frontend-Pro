/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AppContextType {
  cartItems: any[];
  handleAddToCart: (course: any) => void;
  handleRemoveFromCart: (id: string) => void;
  handleCheckout: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  coursesList: any[];
  setCoursesList: (courses: any[]) => void;
  globalToast: string | null;
  displayToast: (msg: string) => void;
  handleLogout: () => void;
  handleLoginSuccess: (name: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserName('');
  }, []);

  const handleLoginSuccess = useCallback((name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
  }, []);

  const value: AppContextType = {
    cartItems: [],
    handleAddToCart: () => {},
    handleRemoveFromCart: () => {},
    handleCheckout: () => {},
    cartOpen,
    setCartOpen,
    isLoggedIn,
    setIsLoggedIn,
    userName,
    setUserName,
    coursesList: [],
    setCoursesList: () => {},
    globalToast: null,
    displayToast: () => {},
    handleLogout,
    handleLoginSuccess,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
