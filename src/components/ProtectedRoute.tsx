import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User, UserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  requiredRole: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
