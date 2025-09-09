import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get token from URL params
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          console.error('Authentication error:', errorParam);
          setError(errorParam);
          return;
        }

        if (!token || !userParam) {
          setError('Authentication failed: Missing token or user data');
          return;
        }

        // Parse user data
        let userData;
        try {
          // The backend sends JSON as a string
          userData = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('Failed to parse user data:', e, userParam);
          setError('Authentication failed: Invalid user data format');
          return;
        }

        console.log("Successfully parsed user data:", userData);
        
        // Store token and user data
        // Save token in localStorage for API requests
        localStorage.setItem('auth_token', token);
        
        // Use the login function from auth context
        login(token, userData);
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleAuth();
  }, [searchParams, login, navigate]);

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
