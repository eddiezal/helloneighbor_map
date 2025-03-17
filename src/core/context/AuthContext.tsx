// src/core/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  SocialAuthPayload 
} from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  socialLogin: (payload: SocialAuthPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await AuthService.login(credentials);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await AuthService.register(data);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const socialLogin = async (payload: SocialAuthPayload) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await AuthService.socialLogin(payload);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      register,
      socialLogin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};