import React from 'react';
import { useAppContext } from '../core/context/AppContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAppContext();
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-primary-light flex items-center justify-center text-2xl text-primary">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Email</h3>
              <p className="mt-1 text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Password</h3>
              <p className="mt-1 text-sm text-gray-600">••••••••</p>
              <button className="mt-1 text-sm text-primary hover:text-primary-dark">
                Change password
              </button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    id="notifications-email"
                    name="notifications-email"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="notifications-email" className="ml-2 block text-sm text-gray-900">
                    Email notifications
                  </label>
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    id="notifications-push"
                    name="notifications-push"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="notifications-push" className="ml-2 block text-sm text-gray-900">
                    Push notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-gray-600 text-sm">Favorite Producers</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-gray-600 text-sm">Messages</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-gray-600 text-sm">Orders</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <button
            onClick={logout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;