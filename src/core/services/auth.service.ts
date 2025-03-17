// src/core/services/auth.service.ts
import { authApi } from '../api/auth.api';
import { 
  LoginCredentials, 
  RegisterData, 
  User, 
  SocialAuthPayload 
} from '../types/auth.types';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    const response = await authApi.login(credentials);
    localStorage.setItem('auth_token', response.data.token);
    return response.data.user;
  }
  
  static async register(data: RegisterData): Promise<User> {
    const response = await authApi.register(data);
    localStorage.setItem('auth_token', response.data.token);
    return response.data.user;
  }
  
  static async socialLogin(payload: SocialAuthPayload): Promise<User> {
    const response = await authApi.socialAuth(payload);
    localStorage.setItem('auth_token', response.data.token);
    return response.data.user;
  }
  
  static async logout(): Promise<void> {
    await authApi.logout();
    localStorage.removeItem('auth_token');
  }
  
  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await authApi.getCurrentUser();
      return response.data;
    } catch (error) {
      return null;
    }
  }
  
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}