'use client';

import { SupabaseAuthProvider } from './supabase-auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      {children}
    </SupabaseAuthProvider>
  );
} 