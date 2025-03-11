import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AgencyProfile, AgencyProfileFormData, AgencyBranding, AgencyAsset, AgencyAssetFormData, AgencyCredential, AgencyCredentialFormData, CaseStudy, CaseStudyFormData, TeamMember, TeamMemberFormData, Service, ServiceFormData, Testimonial, TestimonialFormData } from "@/types/agency";

/**
 * Creates a Supabase client for browser-side operations
 * Use this in client components only
 */
export const createClient = () => {
  return createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  });
};

// Client-side utility functions that use the Supabase client

export async function getAgencyProfile(): Promise<AgencyProfile | null> {
  const supabase = createClient();
  
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

export async function upsertAgencyProfile(profileData: AgencyProfileFormData): Promise<{ success: boolean; data?: AgencyProfile; error?: any }> {
  const supabase = createClient();
  
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('agency_profiles')
      .select('id')
      .single();
    
    const profile = {
      ...profileData,
      updated_at: new Date().toISOString(),
      user_id: user.id
    };
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('agency_profiles')
        .update(profile)
        .eq('id', existingProfile.id)
        .select('*')
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from('agency_profiles')
        .insert({
          ...profile,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single();
    }
    
    if (result.error) throw result.error;
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('Error upserting agency profile:', error);
    return {
      success: false,
      error
    };
  }
}

// Add other client-side functions as needed, following the same pattern
// This keeps the file size manageable while providing the necessary client-side functionality 