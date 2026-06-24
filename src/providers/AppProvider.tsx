/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { tokenStorage } from '@/lib/token-storage';
import type { UserInfoDto } from '@/types/api/auth';

type Role = 'Admin' | 'Instructor' | 'Student';

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
  userRoles: Role[];
  setUserRoles: (roles: Role[]) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  coursesList: any[];
  setCoursesList: (courses: any[]) => void;
  globalToast: string | null;
  displayToast: (msg: string) => void;
  handleLogout: () => void;
  handleLoginSuccess: (user: UserInfoDto) => void;
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
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      const userInfo = tokenStorage.getUserInfo();
      if (userInfo) {
        setIsLoggedIn(true);
        setUserName(userInfo.fullName);
        setUserRoles(userInfo.roles as Role[]);
        setUserId(userInfo.id);
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    tokenStorage.clearTokens();
    setIsLoggedIn(false);
    setUserName('');
    setUserRoles([]);
    setUserId(null);
  }, []);

  const handleLoginSuccess = useCallback((user: UserInfoDto) => {
    tokenStorage.setUserInfo(user);
    setIsLoggedIn(true);
    setUserName(user.fullName);
    setUserRoles(user.roles as Role[]);
    setUserId(user.id);
  }, []);

  const hasRole = useCallback((role: Role) => userRoles.includes(role), [userRoles]);

  const hasAnyRole = useCallback((roles: Role[]) => roles.some((r) => userRoles.includes(r)), [userRoles]);

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
    userRoles,
    setUserRoles,
    userId,
    setUserId,
    hasRole,
    hasAnyRole,
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
