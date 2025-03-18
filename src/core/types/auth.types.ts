// Create src/core/types/auth.types.ts
export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface SocialAuthPayload {
    provider: 'google' | 'facebook' | 'apple';
    token: string;
  }
  