'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase-browser';
import { Session, User } from '@supabase/supabase-js';
import ErrorBoundary from '../error-boundary';

// Create a context for the auth state
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  refreshSession: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth available
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState(() => createClient());

  // Get session and user on mount
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check for active session
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          return;
        }
        
        if (activeSession) {
          setSession(activeSession);
          setUser(activeSession.user);
          
          // Store session in localStorage for persistence
          try {
            localStorage.setItem('supabase_session', JSON.stringify(activeSession));
          } catch (storageError) {
            console.error('Error storing session in localStorage:', storageError);
          }
        } else {
          // Try to recover session from localStorage
          try {
            const storedSession = localStorage.getItem('supabase_session');
            if (storedSession) {
              try {
                const parsedSession = JSON.parse(storedSession);
                setSession(parsedSession);
                setUser(parsedSession.user);
                
                // Validate the recovered session
                const { data: { user: validatedUser }, error: validationError } = 
                  await supabase.auth.getUser(parsedSession.access_token);
                
                if (validationError || !validatedUser) {
                  console.warn('Stored session is invalid, removing it');
                  localStorage.removeItem('supabase_session');
                  setSession(null);
                  setUser(null);
                }
              } catch (parseError) {
                console.error('Error parsing stored session:', parseError);
                localStorage.removeItem('supabase_session');
              }
            }
          } catch (localStorageError) {
            console.error('Error accessing localStorage:', localStorageError);
          }
        }
      } catch (error: any) {
        console.error('Unexpected error during session retrieval:', error);
        setError(error?.message || 'Failed to retrieve session');
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (newSession) {
          try {
            setSession(newSession);
            setUser(newSession.user);
            setError(null);
            
            // Update localStorage
            localStorage.setItem('supabase_session', JSON.stringify(newSession));
          } catch (error) {
            console.error('Error handling auth state change:', error);
          }
        } else {
          setSession(null);
          setUser(null);
          try {
            localStorage.removeItem('supabase_session');
          } catch (error) {
            console.error('Error removing session from localStorage:', error);
          }
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Function to sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        setError(error.message);
      } else {
        setUser(null);
        setSession(null);
        setError(null);
        try {
          localStorage.removeItem('supabase_session');
        } catch (error) {
          console.error('Error removing session from localStorage:', error);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error during sign out:', error);
      setError(error?.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh the session
  const refreshSession = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        setError(error.message);
        return;
      }
      
      if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        try {
          localStorage.setItem('supabase_session', JSON.stringify(refreshedSession));
        } catch (error) {
          console.error('Error storing refreshed session in localStorage:', error);
        }
      } else {
        // If no session was returned, clear the current session
        setSession(null);
        setUser(null);
        try {
          localStorage.removeItem('supabase_session');
        } catch (error) {
          console.error('Error removing session from localStorage:', error);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error during session refresh:', error);
      setError(error?.message || 'Failed to refresh session');
    } finally {
      setIsLoading(false);
    }
  };

  // Value to be provided by the context
  const value = {
    user,
    session,
    isLoading,
    error,
    signOut,
    refreshSession,
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </ErrorBoundary>
  );
} 