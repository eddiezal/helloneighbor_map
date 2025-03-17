// src/pages/Login.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to HelloNeighbor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-light">
              create an account
            </Link>
          </p>
        </div>
        <div className="mt-8">
          <p className="text-center">Login form will be implemented here</p>
          <div className="mt-6">
            <Link 
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;