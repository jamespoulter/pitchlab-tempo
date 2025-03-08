import { createBrowserClient } from "@supabase/ssr";
import { AgencyProfile, AgencyProfileFormData } from "@/types/agency";

// Create a Supabase client for browser-side operations
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

/**
 * Fetches the agency profile for the current authenticated user
 */
export async function getAgencyProfile(): Promise<AgencyProfile | null> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }
  
  // Get the agency profile for the user
  const { data, error } = await supabase
    .from("agency_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  
  if (error && error.code !== "PGRST116") { // PGRST116 is the error code for "no rows returned"
    console.error("Error fetching agency profile:", error);
    return null;
  }
  
  return data;
}

/**
 * Creates or updates an agency profile for the current authenticated user
 */
export async function upsertAgencyProfile(profileData: AgencyProfileFormData): Promise<{ success: boolean; data?: AgencyProfile; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Check if the user already has a profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from("agency_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  
  // Prepare the data with the user_id
  const agencyData: Partial<AgencyProfile> = {
    ...profileData,
    user_id: user.id,
  };
  
  let result;
  
  if (existingProfile) {
    // Update existing profile
    result = await supabase
      .from("agency_profiles")
      .update(agencyData)
      .eq("id", existingProfile.id)
      .select()
      .single();
  } else {
    // Create new profile
    result = await supabase
      .from("agency_profiles")
      .insert(agencyData)
      .select()
      .single();
  }
  
  if (result.error) {
    console.error("Error upserting agency profile:", result.error);
    return { success: false, error: result.error };
  }
  
  return { success: true, data: result.data };
}

/**
 * Updates the agency logo URL for the current authenticated user
 */
export async function updateAgencyLogo(logoUrl: string): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Update the logo URL
  const { error } = await supabase
    .from("agency_profiles")
    .update({ logo_url: logoUrl })
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Error updating agency logo:", error);
    return { success: false, error };
  }
  
  return { success: true };
}

/**
 * Uploads a logo file to Supabase storage and returns the public URL
 */
export async function uploadAgencyLogo(file: File): Promise<{ success: boolean; url?: string; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("agency-logos")
    .upload(`${user.id}/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  
  if (error) {
    console.error("Error uploading logo:", error);
    return { success: false, error };
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from("agency-logos")
    .getPublicUrl(data.path);
  
  return { success: true, url: publicUrl };
} 