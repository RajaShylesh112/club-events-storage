import { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User, AuthResponse } from './api';
import { authHelpers } from './auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  initiateGoogleLogin: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const response = await authApi.getProfile();
        if (response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  function isApiError(err: unknown): err is { response: { data: { message: string } } } {
    return (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: unknown }).response === 'object' &&
      (err as { response: { data?: unknown } }).response.data !== undefined &&
      typeof (err as { response: { data: { message?: unknown } } }).response.data.message === 'string'
    );
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(email, password);
      if (response.data) {
        authHelpers.handleLoginSuccess(response.data);
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.response.data.message);
      } else {
        setError('Login failed');
      }
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const regResponse = await authApi.register(name, email, password);
      // Auto-login after registration
      if (regResponse.data) {
        const loginResponse = await authApi.login(email, password);
        if (loginResponse.data) {
          authHelpers.handleLoginSuccess(loginResponse.data);
          setUser(loginResponse.data.user);
        } else {
          setUser(null);
        }
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const clearError = () => setError(null);

  const initiateGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || (window.location.origin + '/auth-callback');
      const response = await authApi.googleLogin(redirectUri);
      if (response.data?.auth_url) {
        window.location.href = response.data.auth_url;
      } else {
        setError('Failed to initiate Google login');
      }
    } catch (err: unknown) {
      setError('Failed to initiate Google login');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
    clearError,
    initiateGoogleLogin,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
