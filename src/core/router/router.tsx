// src/core/router/router.tsx
import { createBrowserRouter } from 'react-router-dom';

// Import layouts
import AppLayout from '../../features/ui/layout/AppLayout';

// Import pages
import HomePage from '../../pages/HomePage';
import ProducerDetailPage from '../../pages/ProducerDetailPage';
import ProfilePage from '../../pages/ProfilePage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import NotFoundPage from '../../pages/NotFoundPage';
import SettingsPage from '../../pages/SettingsPage';

// Import auth protection component
import ProtectedRoute from '../../features/auth/components/ProtectedRoute';

/**
 * Define application routes
 */
const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'producer/:id',
        element: <ProducerDetailPage />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: 'settings',
        element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

/**
 * Create and export the router
 */
export const router = createBrowserRouter(routes);