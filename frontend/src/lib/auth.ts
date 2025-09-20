import { User, AuthResponse } from './api';

// Token management
export const tokenManager = {
  // Store auth token
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  // Remove auth token
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  // Check if token exists
  hasToken: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Get token payload (decode JWT)
  getTokenPayload: (): Record<string, unknown> | null => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const payload = tokenManager.getTokenPayload();
    if (!payload || typeof payload.exp !== 'number') return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  },
};

// User session management
export const sessionManager = {
  // Store user data
  setUser: (user: User): void => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  // Get user data
  getUser: (): User | null => {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Remove user data
  removeUser: (): void => {
    localStorage.removeItem('user_data');
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return tokenManager.hasToken() && !tokenManager.isTokenExpired() && !!sessionManager.getUser();
  },

  // Clear all session data
  clearSession: (): void => {
    tokenManager.removeToken();
    sessionManager.removeUser();
  },
};

// Authentication helpers
export const authHelpers = {
  // Handle successful login
  handleLoginSuccess: (authResponse: AuthResponse): void => {
    tokenManager.setToken(authResponse.access_token);
    sessionManager.setUser(authResponse.user);
  },

  // Handle logout
  handleLogout: (): void => {
    sessionManager.clearSession();
    // Redirect to login page
    window.location.href = '/login';
  },

  // Check user permissions
  hasPermission: (requiredRoles: string[]): boolean => {
    const user = sessionManager.getUser();
    return user ? requiredRoles.includes(user.role) : false;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = sessionManager.getUser();
    return user?.role === 'admin';
  },

  // Check if user is core member or admin
  isCoreMember: (): boolean => {
    const user = sessionManager.getUser();
    return user ? ['admin', 'core_member'].includes(user.role) : false;
  },

  // Get user role
  getUserRole: (): string | null => {
    const user = sessionManager.getUser();
    return user?.role || null;
  },

  // Get user ID
  getUserId: (): string | null => {
    const user = sessionManager.getUser();
    return user?._id || null;
  },

  // Get user name
  getUserName: (): string | null => {
    const user = sessionManager.getUser();
    return user?.name || null;
  },

  // Get user email
  getUserEmail: (): string | null => {
    const user = sessionManager.getUser();
    return user?.email || null;
  },
};

// Route protection helpers
export const routeProtection = {
  // Protect admin routes
  requireAdmin: (): boolean => {
    if (!authHelpers.isAdmin()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  // Protect core member routes
  requireCoreMember: (): boolean => {
    if (!authHelpers.isCoreMember()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  // Protect authenticated routes
  requireAuth: (): boolean => {
    if (!sessionManager.isLoggedIn()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  // Redirect if already logged in
  redirectIfLoggedIn: (): void => {
    if (sessionManager.isLoggedIn()) {
      window.location.href = '/dashboard';
    }
  },
};

// Auto-refresh token logic
export const tokenRefresh = {
  // Check token validity and refresh if needed
  checkAndRefreshToken: async (): Promise<boolean> => {
    if (!tokenManager.hasToken()) {
      return false;
    }

    if (tokenManager.isTokenExpired()) {
      // Token is expired, redirect to login
      authHelpers.handleLogout();
      return false;
    }

    // Check if token expires soon (within 5 minutes)
    const payload = tokenManager.getTokenPayload();
    if (payload && typeof payload.exp === 'number') {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      
      if (timeUntilExpiry < 300) { // 5 minutes
        // Token expires soon, try to refresh
        return await tokenRefresh.refreshToken();
      }
    }

    return true;
  },

  // Refresh token (placeholder - implement based on your backend)
  refreshToken: async (): Promise<boolean> => {
    try {
      // This would call your refresh token endpoint
      // For now, we'll just return true if user is still logged in
      return sessionManager.isLoggedIn();
    } catch (error) {
      console.error('Token refresh failed:', error);
      authHelpers.handleLogout();
      return false;
    }
  },

  // Start automatic token checking
  startTokenCheck: (): void => {
    // Check token every 5 minutes
    setInterval(() => {
      tokenRefresh.checkAndRefreshToken();
    }, 5 * 60 * 1000);
  },
};

// Initialize auth system
export const initAuth = (): void => {
  // Start automatic token checking
  tokenRefresh.startTokenCheck();
};

// Export everything as default object
export default {
  tokenManager,
  sessionManager,
  authHelpers,
  routeProtection,
  tokenRefresh,
  initAuth,
};
