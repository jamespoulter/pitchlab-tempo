'use client';

import { SupabaseAuthProvider } from './supabase-auth-provider';
import SubscriptionRedirect from '../subscription-redirect';
import ErrorBoundary from '../error-boundary';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SupabaseAuthProvider>
        <Suspense fallback={<div>Loading subscription status...</div>}>
          <SubscriptionRedirect />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
          }}
        />
      </SupabaseAuthProvider>
    </ErrorBoundary>
  );
} 