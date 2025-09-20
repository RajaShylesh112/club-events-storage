import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const dateUtils = {
  // Format date for display
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString(undefined, { ...defaultOptions, ...options });
  },

  // Format date and time for display
  formatDateTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  },

  // Check if date is in the past
  isPast: (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
  },

  // Check if date is in the future
  isFuture: (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj > new Date();
  },

  // Get time until date
  getTimeUntil: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

    if (diffInSeconds < 0) return 'Past';
    if (diffInSeconds < 60) return `${diffInSeconds} seconds`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months`;
    return `${Math.floor(diffInSeconds / 31536000)} years`;
  },
};

// File utilities
export const fileUtils = {
  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file extension
  getFileExtension: (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  },

  // Check if file is image
  isImage: (filename: string): boolean => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    return imageExtensions.includes(fileUtils.getFileExtension(filename));
  },

  // Check if file is document
  isDocument: (filename: string): boolean => {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    return docExtensions.includes(fileUtils.getFileExtension(filename));
  },

  // Check if file is video
  isVideo: (filename: string): boolean => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    return videoExtensions.includes(fileUtils.getFileExtension(filename));
  },

  // Get file icon based on type
  getFileIcon: (filename: string): string => {
    const ext = fileUtils.getFileExtension(filename);
    
    if (fileUtils.isImage(filename)) return '🖼️';
    if (fileUtils.isDocument(filename)) return '📄';
    if (fileUtils.isVideo(filename)) return '🎥';
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) return '🎵';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
    
    return '📁';
  },
};

// String utilities
export const stringUtils = {
  // Truncate string
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  // Capitalize first letter
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Convert to title case
  toTitleCase: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Generate slug from string
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Extract initials from name
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },
};

// Validation utilities
export const validationUtils = {
  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  },

  // Validate URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate date string
  isValidDate: (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },
};

// Array utilities
export const arrayUtils = {
  // Remove duplicates from array
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  // Group array by key
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  // Sort array by key
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Chunk array into smaller arrays
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

// Object utilities
export const objectUtils = {
  // Deep clone object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Check if object is empty
  isEmpty: (obj: any): boolean => {
    return Object.keys(obj).length === 0;
  },

  // Pick specific keys from object
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  // Omit specific keys from object
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },
};

// Error handling utilities
export const errorUtils = {
  // Get error message from error object
  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return 'An unknown error occurred';
  },

  // Log error to console
  logError: (error: any, context?: string): void => {
    const message = errorUtils.getErrorMessage(error);
    console.error(context ? `${context}: ${message}` : message, error);
  },
};

// Local storage utilities
export const storageUtils = {
  // Set item in localStorage
  setItem: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  },

  // Get item from localStorage
  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue || null;
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  },

  // Clear all localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Export all utilities
export default {
  cn,
  dateUtils,
  fileUtils,
  stringUtils,
  validationUtils,
  arrayUtils,
  objectUtils,
  errorUtils,
  storageUtils,
};