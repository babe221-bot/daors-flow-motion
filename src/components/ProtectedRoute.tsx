 feature/document-and-gps-tracking
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/lib/types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = hasRole(allowedRoles);

  if (!isAuthorized) {
    // If authenticated but not authorized, redirect to a not-found page
    // In a real app, you might have a dedicated "403 Unauthorized" page
    return <Navigate to="/not-found" replace />;
  }

  // If authenticated and authorized, render the child components

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

 main
  return <Outlet />;
};

export default ProtectedRoute;
