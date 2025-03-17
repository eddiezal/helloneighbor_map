// src/features/auth/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    // Show a loading indicator while checking auth status
    return <div>Loading...</div>;
  }
  
  if (requireAuth && !isAuthenticated) {
    // Redirect to login if authentication is required but user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    // Redirect to home if user is already authenticated (for login/register pages)
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;