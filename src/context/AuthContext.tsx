import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Role } from '@/lib/types';
import { findUserById, mockUsers } from '@/lib/mock-users';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for logged-in user in localStorage on initial load
    const storedUserId = localStorage.getItem('loggedInUserId');
    if (storedUserId) {
      const loggedInUser = findUserById(storedUserId);
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    }
  }, []);

  const login = (userId: string) => {
    const userToLogin = findUserById(userId);
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem('loggedInUserId', userToLogin.id);
    } else {
        // For simplicity, if no user is found, we can log in the first mock user
        const defaultUser = mockUsers[0];
        setUser(defaultUser);
        localStorage.setItem('loggedInUserId', defaultUser.id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUserId');
  };

  const hasRole = (roles: Role | Role[]) => {
    if (!user) return false;
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
