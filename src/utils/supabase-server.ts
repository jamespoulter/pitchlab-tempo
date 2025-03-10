import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AgencyProfile, AgencyBranding, AgencyAsset, AgencyCredential, CaseStudy, TeamMember, Service, Testimonial } from "@/types/agency";

/**
 * Creates a Supabase client for server-side operations
 * Use this in server components and server actions only
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This can happen when cookies are manipulated by server actions
            // We can safely ignore this error
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // This can happen when cookies are manipulated by server actions
            // We can safely ignore this error
          }
        },
      },
    }
  );
};

// Server-side utility functions

export async function getAgencyProfileServer(): Promise<AgencyProfile | null> {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('agency_profiles')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agency profile:', error);
    return null;
  }
}

export async function getAgencyBrandingServer(): Promise<AgencyBranding | null> {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('agency_branding')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agency branding:', error);
    return null;
  }
}

export async function getAgencyAssetsServer(): Promise<AgencyAsset[]> {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('agency_assets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agency assets:', error);
    return [];
  }
}

export async function getAgencyCredentialsServer(): Promise<AgencyCredential[]> {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('agency_credentials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agency credentials:', error);
    return [];
  }
}

export async function getCaseStudiesServer(): Promise<CaseStudy[]> {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

// Add other server-side functions as needed 