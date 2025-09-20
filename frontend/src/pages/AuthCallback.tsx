import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authHelpers, sessionManager } from '../lib/auth';
import { Loader2 } from 'lucide-react';
import { useAuth } from "../lib/useAuth";
import { authApi } from "../lib/api";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(errorParam);
          return;
        }
        if (!token) {
          setError('Authentication failed: Missing token');
          return;
        }

        // Store token
        localStorage.setItem('auth_token', token);

        // Fetch user details
        const response = await authApi.getProfile();
        if (response.data) {
          setUser(response.data);
          navigate('/dashboard', { replace: true });
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        setError('Authentication failed. Please try again.');
      }
    };
    handleAuth();
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 text-destructive">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mx-auto"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we complete your login.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
