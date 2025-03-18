// src/core/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../features/ui/layout/AppLayout';
import MapView from '../components/Map/MapView'; // Still using the original component
import ListView from '../components/ListView/ListView'; // Still using the original component

// We'll gradually migrate to these as we move components
// import MapView from '../features/map/components/MapView';
// import ListView from '../features/listings/components/ListView';

// Create placeholder pages for future routes
const Home = () => <div>Home Page (Placeholder)</div>;
const ProducerDetail = () => <div>Producer Detail Page (Placeholder)</div>;
const Login = () => <div>Login Page (Placeholder)</div>;
const Register = () => <div>Register Page (Placeholder)</div>;
const UserProfile = () => <div>User Profile Page (Placeholder)</div>;
const Settings = () => <div>Settings Page (Placeholder)</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'map',
        element: <MapView 
          producers={[]} 
          selectedCategory="all" 
          filterAvailability="now" 
        />,
      },
      {
        path: 'browse',
        element: <ListView 
          producers={[]} 
          selectedCategory="all" 
          filterAvailability="now" 
        />,
      },
      {
        path: 'producers/:id',
        element: <ProducerDetail />,
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
      {
        path: 'settings',
        element: <Settings />,
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