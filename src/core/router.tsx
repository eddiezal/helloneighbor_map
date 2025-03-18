import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Layout
import AppLayout from '../features/ui/layout/AppLayout';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import ProducerDetailPage from '../pages/ProducerDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected route wrapper
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Create router configuration
const createAppRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'producer/:id',
          element: <ProducerDetailPage />
        },
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'register',
          element: <RegisterPage />
        },
        {
          path: '/',
          element: <ProtectedRoute />,
          children: [
            {
              path: 'profile',
              element: <ProfilePage />
            }
          ]
        },
        {
          path: '*',
          element: <NotFoundPage />
        }
      ]
    }
  ]);
};

// Router component
export const Router: React.FC = () => {
  const router = createAppRouter();
  
  return <RouterProvider router={router} />;
};

export default Router;