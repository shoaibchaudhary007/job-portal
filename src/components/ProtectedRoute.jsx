import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect wrong role to appropriate landing page
    if (user.role === 'seeker') {
      return <Navigate to="/dashboard/seeker" replace />;
    } else if (user.role === 'employer') {
      return <Navigate to="/dashboard/employer" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;
