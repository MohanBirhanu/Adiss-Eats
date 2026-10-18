export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  defaultArea?: string;
  role: 'customer' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
