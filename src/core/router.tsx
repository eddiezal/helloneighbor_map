// src/core/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Map from '../pages/Map';
import Browse from '../pages/Browse';
import ProducerDetail from '../pages/ProducerDetail';
import UserProfile from '../pages/UserProfile';
import Settings from '../pages/Settings';
import MainLayout from '../features/ui/layout/MainLayout';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';

// Create the browser router
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'browse',
        element: <Browse />,
      },
      {
        path: 'map',
        element: <Map />,
      },
      {
        path: 'producers/:id',
        element: <ProducerDetail />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;