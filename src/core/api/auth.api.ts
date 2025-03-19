// src/core/api/auth.api.ts
import { LoginCredentials, RegisterData, SocialAuthPayload } from '../types/auth.types';
import { apiClient } from './client';

/**
 * Auth API service
 * Handles authentication-related API requests
 */
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials) => {
    // In a real app, you would make an actual API call
    // return apiClient.post('/auth/login', credentials);
    
    // Mock implementation
    return Promise.resolve({
      data: {
        token: 'mock-auth-token',
        user: {
          id: '1',
          name: 'Demo User',
          email: credentials.email,
          createdAt: new Date()
        }
      }
    });
  },
  
  /**
   * Register a new user
   */
  register: async (data: RegisterData) => {
    // In a real app, you would make an actual API call
    // return apiClient.post('/auth/register', data);
    
    // Mock implementation
    return Promise.resolve({
      data: {
        token: 'mock-auth-token',
        user: {
          id: '1',
          name: data.name,
          email: data.email,
          createdAt: new Date()
        }
      }
    });
  },
  
  /**
   * Authenticate with social provider
   */
  socialAuth: async (payload: SocialAuthPayload) => {
    // In a real app, you would make an actual API call
    // return apiClient.post('/auth/social', payload);
    
    // Mock implementation
    return Promise.resolve({
      data: {
        token: 'mock-auth-token',
        user: {
          id: '1',
          name: 'Social User',
          email: `user@${payload.provider}.com`,
          createdAt: new Date()
        }
      }
    });
  },
  
  /**
   * Logout the current user
   */
  logout: async () => {
    // In a real app, you would make an actual API call
    // return apiClient.post('/auth/logout');
    
    // Mock implementation
    return Promise.resolve({
      data: { success: true }
    });
  },
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser: async () => {
    // In a real app, you would make an actual API call
    // return apiClient.get('/auth/me');
    
    // Mock implementation
    return Promise.resolve({
      data: {
        id: '1',
        name: 'Demo User',
        email: 'user@example.com',
        createdAt: new Date()
      }
    });
  }
};