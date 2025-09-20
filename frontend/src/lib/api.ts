// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
  created_at: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  organizer_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'archived';
  created_at: string;
  updated_at: string;
  approved_by?: string;
  archived_at?: string;
}

export interface EventFile {
  _id: string;
  event_id: string;
  uploader_id: string;
  filename: string;
  storage_key: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      return { error: errorData.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
};

// Authentication API functions
export const authApi = {
  // Google OAuth login
  googleLogin: async (redirectUri: string = 'http://localhost:8080/auth-callback'): Promise<ApiResponse<{ auth_url: string }>> => {
    return apiRequest<{ auth_url: string }>(`/auth/login?redirect_uri=${encodeURIComponent(redirectUri)}`);
  },

  // Password login
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/auth/password-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register new user
  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/auth/me');
  },

  // Logout
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};

// Events API functions
export const eventsApi = {
  // Get all events with optional status filter
  getAll: async (status?: string): Promise<ApiResponse<Event[]>> => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiRequest<Event[]>(`/events${query}`);
  },

  // Get single event by ID
  getById: async (eventId: string): Promise<ApiResponse<Event>> => {
    return apiRequest<Event>(`/events/${eventId}`);
  },

  // Create new event
  create: async (eventData: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
  }): Promise<ApiResponse<Event>> => {
    return apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Update event
  update: async (eventId: string, eventData: {
    title?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
  }): Promise<ApiResponse<Event>> => {
    return apiRequest<Event>(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  },

  // Approve event (admin only)
  approve: async (eventId: string): Promise<ApiResponse<Event>> => {
    return apiRequest<Event>(`/events/${eventId}/approve`, {
      method: 'PATCH',
    });
  },

  // Archive event (core member or admin)
  archive: async (eventId: string): Promise<ApiResponse<Event>> => {
    return apiRequest<Event>(`/events/${eventId}/archive`, {
      method: 'PATCH',
    });
  },

  // Delete event (admin only)
  delete: async (eventId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};

// Files API functions
export const filesApi = {
  // Upload file
  upload: async (file: File, eventId?: string): Promise<ApiResponse<EventFile>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (eventId) {
      formData.append('event_id', eventId);
    }

    const token = getAuthToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        return { error: errorData.message || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload error' };
    }
  },

  // Get file by ID
  getById: async (fileId: string): Promise<ApiResponse<EventFile>> => {
    return apiRequest<EventFile>(`/files/${fileId}`);
  },

  // Get files by event ID
  getByEventId: async (eventId: string): Promise<ApiResponse<EventFile[]>> => {
    return apiRequest<EventFile[]>(`/files?event_id=${eventId}`);
  },

  // Get all files
  getAll: async (): Promise<ApiResponse<EventFile[]>> => {
    return apiRequest<EventFile[]>('/files');
  },

  // Delete file
  delete: async (fileId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/files/${fileId}`, {
      method: 'DELETE',
    });
  },

  // Download file
  download: async (fileId: string): Promise<ApiResponse<Blob>> => {
    const token = getAuthToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}/download`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        return { error: `Download failed: HTTP ${response.status}` };
      }

      const blob = await response.blob();
      return { data: blob };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Download error' };
    }
  },
};

// Users API functions (admin only)
export const usersApi = {
  // Get all users
  getAll: async (): Promise<ApiResponse<User[]>> => {
    return apiRequest<User[]>('/users');
  },

  // Update user role
  updateRole: async (userId: string, role: 'admin' | 'core_member' | 'user'): Promise<ApiResponse<User>> => {
    return apiRequest<User>(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};

// Utility functions
export const apiUtils = {
  // Check if user has required role
  hasRole: (user: User | null, requiredRoles: string[]): boolean => {
    return user ? requiredRoles.includes(user.role) : false;
  },

  // Check if user is admin
  isAdmin: (user: User | null): boolean => {
    return user?.role === 'admin';
  },

  // Check if user is core member or admin
  isCoreMember: (user: User | null): boolean => {
    return user ? ['admin', 'core_member'].includes(user.role) : false;
  },

  // Format date for API
  formatDateForApi: (date: Date): string => {
    return date.toISOString();
  },

  // Parse API date
  parseApiDate: (dateString: string): Date => {
    return new Date(dateString);
  },

  // Handle API errors
  handleError: (error: string, fallback: string = 'An error occurred'): string => {
    return error || fallback;
  },
};

export default {
  auth: authApi,
  events: eventsApi,
  files: filesApi,
  users: usersApi,
  utils: apiUtils,
};
