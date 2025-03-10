import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Create a Supabase client for browser-side operations
export const createClient = () => {
  return createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  });
}; 