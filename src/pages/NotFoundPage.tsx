import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-primary mb-4">404</h2>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark inline-flex items-center"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;