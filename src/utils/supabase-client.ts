<<<<<<< HEAD
import { createBrowserClient } from "@supabase/ssr";
=======
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerClient } from "@supabase/ssr";
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
import { AgencyProfile, AgencyProfileFormData, AgencyBranding, AgencyAsset, AgencyAssetFormData, AgencyCredential, AgencyCredentialFormData, CaseStudy, CaseStudyFormData, TeamMember, TeamMemberFormData, Service, ServiceFormData, Testimonial, TestimonialFormData } from "@/types/agency";

/**
 * Creates a Supabase client that works in both client and server contexts
 * 
 * Usage:
 * - In client components: const supabase = createClient()
 * - In server components: const supabase = await createClient()
 * 
 * The function automatically detects the context and returns the appropriate client.
 */
export const createClient = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Client-side: use createClientComponentClient
    return createClientComponentClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    });
  } else {
    // Server-side: this should not be called directly from client components
    // This is a fallback that will be removed in production builds if not used
    console.warn('Server-side Supabase client should not be created in client components');
    return null;
  }
};

// Export a separate function for server components that can be tree-shaken
export const getServerClient = async () => {
  // This function should only be imported by server components
  // Dynamic import to prevent client components from bundling server-only code
  if (typeof window !== 'undefined') {
    console.error('getServerClient should only be called from server components');
    return null;
  }
  
  // Dynamic import to prevent client components from bundling server-only code
  const { cookies } = await import('next/headers');
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
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // This can happen when cookies are manipulated by server actions
          }
        },
      },
    }
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

/**
 * Fetches the agency branding for the current authenticated user
 */
export async function getAgencyBranding(): Promise<AgencyBranding | null> {
  const supabase = createClient();
  
  console.log("getAgencyBranding called");
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }
  
  // Get the agency branding for the user
  const { data, error } = await supabase
    .from("agency_branding")
    .select("*")
    .eq("user_id", user.id)
    .single();
  
  console.log("Fetched branding data:", data, "Error:", error);
  
  if (error && error.code !== "PGRST116") { // PGRST116 is the error code for "no rows returned"
    console.error("Error fetching agency branding:", error);
    return null;
  }
  
  // Ensure colors is an array
  if (data) {
    data.colors = Array.isArray(data.colors) ? data.colors : [];
    console.log("Processed colors:", data.colors);
  }
  
  return data;
}

/**
 * Creates or updates agency branding for the current authenticated user
 */
export async function upsertAgencyBranding(brandingData: Partial<AgencyBranding>): Promise<{ success: boolean; data?: AgencyBranding; error?: any }> {
  const supabase = createClient();
  
  console.log("upsertAgencyBranding called with:", brandingData);
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Check if the user already has branding
  const { data: existingBranding, error: fetchError } = await supabase
    .from("agency_branding")
    .select("id")
    .eq("user_id", user.id)
    .single();
  
  console.log("Existing branding check:", { existingBranding, fetchError });
  
  // Ensure colors is an array
  const colors = Array.isArray(brandingData.colors) ? brandingData.colors : [];
  console.log("Colors to save:", colors);
  
  // Ensure typography has the expected structure
  const defaultTypography = {
    headings: {
      fontFamily: "Montserrat",
      weights: ["600", "700"],
      sizes: { h1: "2.5rem", h2: "2rem", h3: "1.5rem", h4: "1.25rem", h5: "1rem" },
    },
    body: {
      fontFamily: "Inter",
      weights: ["400", "500"],
    },
  };
  
  const typography = brandingData.typography || defaultTypography;
  
  // Ensure all required properties exist
  const processedTypography = {
    headings: {
      fontFamily: typography.headings?.fontFamily || defaultTypography.headings.fontFamily,
      weights: Array.isArray(typography.headings?.weights) ? typography.headings.weights : defaultTypography.headings.weights,
      sizes: typography.headings?.sizes || defaultTypography.headings.sizes,
    },
    body: {
      fontFamily: typography.body?.fontFamily || defaultTypography.body.fontFamily,
      weights: Array.isArray(typography.body?.weights) ? typography.body.weights : defaultTypography.body.weights,
    },
  };
  
  console.log("Typography to save:", processedTypography);
  
  // Prepare the data with the user_id
  const data: Partial<AgencyBranding> = {
    ...brandingData,
    colors: colors,
    typography: processedTypography,
    user_id: user.id,
  };
  
  console.log("Prepared data for upsert:", data);
  
  let result;
  
  if (existingBranding) {
    // Update existing branding
    console.log("Updating existing branding with ID:", existingBranding.id);
    result = await supabase
      .from("agency_branding")
      .update(data)
      .eq("id", existingBranding.id)
      .select()
      .single();
  } else {
    // Create new branding
    console.log("Creating new branding");
    result = await supabase
      .from("agency_branding")
      .insert(data)
      .select()
      .single();
  }
  
  console.log("Upsert result:", result);
  
  if (result.error) {
    console.error("Error upserting agency branding:", result.error);
    return { success: false, error: result.error };
  }
  
  return { success: true, data: result.data };
}

/**
 * Uploads a branding asset file to Supabase storage and returns the public URL
 */
export async function uploadBrandingAsset(file: File, type: 'logo' | 'logo_dark' | 'icon' | 'asset'): Promise<{ success: boolean; url?: string; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("agency-branding")
    .upload(`${user.id}/${type}/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  
  if (error) {
    console.error(`Error uploading ${type}:`, error);
    return { success: false, error };
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from("agency-branding")
    .getPublicUrl(data.path);
  
  return { success: true, url: publicUrl };
}

/**
 * Fetches all agency assets for the current authenticated user
 */
export async function getAgencyAssets(): Promise<AgencyAsset[]> {
  const supabase = createClient();
  
  console.log("getAgencyAssets called");
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return [];
  }
  
  // Get the agency assets for the user
  const { data, error } = await supabase
    .from("agency_assets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  console.log("Fetched agency assets:", data, "Error:", error);
  
  if (error) {
    console.error("Error fetching agency assets:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Fetches a single agency asset by ID
 */
export async function getAgencyAssetById(assetId: string): Promise<AgencyAsset | null> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }
  
  // Get the agency asset
  const { data, error } = await supabase
    .from("agency_assets")
    .select("*")
    .eq("id", assetId)
    .eq("user_id", user.id)
    .single();
  
  if (error) {
    console.error("Error fetching agency asset:", error);
    return null;
  }
  
  return data;
}

/**
 * Creates a new agency asset
 */
export async function createAgencyAsset(assetData: AgencyAssetFormData): Promise<{ success: boolean; data?: AgencyAsset; error?: any }> {
  const supabase = createClient();
  
  console.log("createAgencyAsset called with:", assetData);
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Prepare the data with the user_id
  const data: Partial<AgencyAsset> = {
    ...assetData,
    user_id: user.id,
  };
  
  // Create the asset
  const { data: newAsset, error } = await supabase
    .from("agency_assets")
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating agency asset:", error);
    return { success: false, error };
  }
  
  return { success: true, data: newAsset };
}

/**
 * Updates an existing agency asset
 */
export async function updateAgencyAsset(assetId: string, assetData: Partial<AgencyAssetFormData>): Promise<{ success: boolean; data?: AgencyAsset; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Update the asset
  const { data, error } = await supabase
    .from("agency_assets")
    .update(assetData)
    .eq("id", assetId)
    .eq("user_id", user.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating agency asset:", error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

/**
 * Deletes an agency asset
 */
export async function deleteAgencyAsset(assetId: string): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Delete the asset
  const { error } = await supabase
    .from("agency_assets")
    .delete()
    .eq("id", assetId)
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Error deleting agency asset:", error);
    return { success: false, error };
  }
  
  return { success: true };
}

/**
 * Uploads an asset file to Supabase storage and returns the public URL
 */
export async function uploadAgencyAssetFile(file: File): Promise<{ success: boolean; url?: string; fileInfo?: { size: number; type: string }; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Determine file type category
  let fileType: 'image' | 'document' | 'video' | 'other' = 'other';
  if (file.type.startsWith('image/')) {
    fileType = 'image';
  } else if (file.type.startsWith('video/')) {
    fileType = 'video';
  } else if (
    file.type === 'application/pdf' ||
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-powerpoint' ||
    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    file.type === 'text/plain'
  ) {
    fileType = 'document';
  }
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("agency-assets")
    .upload(`${user.id}/${fileType}/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  
  if (error) {
    console.error("Error uploading asset:", error);
    return { success: false, error };
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from("agency-assets")
    .getPublicUrl(data.path);
  
  return { 
    success: true, 
    url: publicUrl,
    fileInfo: {
      size: file.size,
      type: file.type
    }
  };
}

// Agency Credentials Functions

export async function getAgencyCredentials(): Promise<AgencyCredential[]> {
  const supabase = createClient();
  
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

export async function getAgencyCredentialById(credentialId: string): Promise<AgencyCredential | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from("agency_credentials")
      .select("*")
      .eq("id", credentialId)
      .single();
    
    if (error) {
      console.error("Error fetching agency credential:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getAgencyCredentialById:", error);
    return null;
  }
}

export async function createAgencyCredential(credentialData: AgencyCredentialFormData): Promise<{ success: boolean; data?: AgencyCredential; error?: any }> {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('agency_credentials')
      .insert({
        ...credentialData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating agency credential:', error);
    return {
      success: false,
      error
    };
  }
}

export async function updateAgencyCredential(credentialId: string, credentialData: Partial<AgencyCredentialFormData>): Promise<{ success: boolean; data?: AgencyCredential; error?: any }> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('agency_credentials')
      .update({
        ...credentialData,
        updated_at: new Date().toISOString()
      })
      .eq('id', credentialId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error updating agency credential:', error);
    return {
      success: false,
      error
    };
  }
}

export async function deleteAgencyCredential(credentialId: string): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('agency_credentials')
      .delete()
      .eq('id', credentialId);
    
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting agency credential:', error);
    return {
      success: false,
      error
    };
  }
}

export async function uploadCredentialImage(file: File): Promise<{ success: boolean; url?: string; error?: any }> {
  const supabase = createClient();
  
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `credential_images/${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('agency-credentials')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('agency-credentials')
      .getPublicUrl(filePath);
    
    return {
      success: true,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading credential image:', error);
    return {
      success: false,
      error
    };
  }
}

/**
 * Fetches all case studies for the current authenticated user
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const supabase = createClient();
  
  console.log("Fetching case studies...");
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return [];
  }
  
  console.log("Current user ID:", user.id);
  
  // Get all case studies for the user
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
  
  console.log("Case studies fetched:", data ? data.length : 0);
  console.log("First case study (if any):", data && data.length > 0 ? data[0] : "No case studies found");
  
  return data || [];
}

/**
 * Fetches a single case study by ID
 */
export async function getCaseStudyById(caseStudyId: string): Promise<CaseStudy | null> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }
  
  // Get the case study
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", caseStudyId)
    .eq("user_id", user.id)
    .single();
  
  if (error) {
    console.error("Error fetching case study:", error);
    return null;
  }
  
  return data;
}

/**
 * Creates a new case study
 */
export async function createCaseStudy(caseStudyData: CaseStudyFormData): Promise<{ success: boolean; data?: CaseStudy; error?: any }> {
  const supabase = createClient();
  
  console.log("Creating case study with data:", caseStudyData);
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  console.log("Current user ID for case study creation:", user.id);
  
  try {
    // Prepare data - ensure date fields are properly formatted
    const preparedData = {
      ...caseStudyData,
      user_id: user.id,
      // Ensure date fields are valid
      date: caseStudyData.date || new Date().toISOString().split("T")[0],
      start_date: caseStudyData.start_date || null,
      end_date: caseStudyData.end_date || null
    };
    
    console.log("Prepared data for case study creation:", preparedData);
    
    // Create the case study
    const { data, error } = await supabase
      .from("case_studies")
      .insert(preparedData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating case study:", error);
      return { success: false, error };
    }
    
    console.log("Case study created successfully:", data);
    
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error creating case study:", error);
    return { success: false, error };
  }
}

/**
 * Updates an existing case study
 */
export async function updateCaseStudy(caseStudyId: string, caseStudyData: Partial<CaseStudyFormData>): Promise<{ success: boolean; data?: CaseStudy; error?: any }> {
  const supabase = createClient();
  
  console.log("Updating case study with ID:", caseStudyId);
  console.log("Update data:", caseStudyData);
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  try {
    // Prepare data - ensure date fields are properly formatted
    const preparedData = {
      ...caseStudyData,
      // Ensure date fields are valid if they exist in the update data
      ...(caseStudyData.date !== undefined && { date: caseStudyData.date || new Date().toISOString().split("T")[0] }),
      ...(caseStudyData.start_date !== undefined && { start_date: caseStudyData.start_date || null }),
      ...(caseStudyData.end_date !== undefined && { end_date: caseStudyData.end_date || null })
    };
    
    console.log("Prepared data for case study update:", preparedData);
    
    // Update the case study
    const { data, error } = await supabase
      .from("case_studies")
      .update(preparedData)
      .eq("id", caseStudyId)
      .eq("user_id", user.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating case study:", error);
      return { success: false, error };
    }
    
    console.log("Case study updated successfully:", data);
    
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error updating case study:", error);
    return { success: false, error };
  }
}

/**
 * Deletes a case study
 */
export async function deleteCaseStudy(caseStudyId: string): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Delete the case study
  const { error } = await supabase
    .from("case_studies")
    .delete()
    .eq("id", caseStudyId)
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Error deleting case study:", error);
    return { success: false, error };
  }
  
  return { success: true };
}

/**
 * Uploads a case study image to storage
 */
export async function uploadCaseStudyImage(file: File): Promise<{ success: boolean; url?: string; error?: any }> {
  const supabase = createClient();
  
  console.log("Uploading case study image:", file.name);
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return { success: false, error: userError };
    }
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log("Uploading to path:", filePath);
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('case_study_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading case study image:", error);
      return { success: false, error };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('case_study_images')
      .getPublicUrl(filePath);
    
    console.log("Image uploaded successfully, public URL:", publicUrl);
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Unexpected error uploading case study image:", error);
    return { success: false, error };
  }
}

// Team Member Functions

/**
 * Fetches all team members for the current authenticated user
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return [];
  }
  
  // Get all team members for the user
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Fetches a team member by ID for the current authenticated user
 */
export async function getTeamMemberById(teamMemberId: string): Promise<TeamMember | null> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }
  
  // Get the team member
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", teamMemberId)
    .eq("user_id", user.id)
    .single();
  
  if (error) {
    console.error("Error fetching team member:", error);
    return null;
  }
  
  return data;
}

/**
 * Creates a new team member for the current authenticated user
 */
export async function createTeamMember(teamMemberData: TeamMemberFormData): Promise<{ success: boolean; data?: TeamMember; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Prepare the data with the user_id
  const data = {
    ...teamMemberData,
    user_id: user.id,
  };
  
  // Create the team member
  const { data: newTeamMember, error } = await supabase
    .from("team_members")
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating team member:", error);
    return { success: false, error };
  }
  
  return { success: true, data: newTeamMember };
}

/**
 * Updates a team member for the current authenticated user
 */
export async function updateTeamMember(teamMemberId: string, teamMemberData: Partial<TeamMemberFormData>): Promise<{ success: boolean; data?: TeamMember; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Update the team member
  const { data, error } = await supabase
    .from("team_members")
    .update(teamMemberData)
    .eq("id", teamMemberId)
    .eq("user_id", user.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating team member:", error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

/**
 * Deletes a team member for the current authenticated user
 */
export async function deleteTeamMember(teamMemberId: string): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Delete the team member
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", teamMemberId)
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Error deleting team member:", error);
    return { success: false, error };
  }
  
  return { success: true };
}

/**
 * Uploads a team member avatar to Supabase storage and returns the public URL
 */
export async function uploadTeamMemberAvatar(file: File): Promise<{ success: boolean; url?: string; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("team-avatars")
    .upload(`${user.id}/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  
  if (error) {
    console.error("Error uploading avatar:", error);
    return { success: false, error };
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from("team-avatars")
    .getPublicUrl(data.path);
  
  return { success: true, url: publicUrl };
}

// Service Functions

/**
 * Fetches all services for the current authenticated user
 */
export async function getServices(): Promise<Service[]> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return [];
  }
  
  // Get all services for the user
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  
  if (!data) return [];
  
  // Map database column names to frontend camelCase
  return data.map(service => {
    if (service.pricerange) {
      return {
        ...service,
        priceRange: service.pricerange
      };
    }
    return service;
  }) as Service[];
}

/**
 * Fetches a service by ID for the current authenticated user
 */
export async function getServiceById(serviceId: string): Promise<Service | null> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }
  
  // Get the service
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .eq("user_id", user.id)
    .single();
  
  if (error) {
    console.error("Error fetching service:", error);
    return null;
  }
  
  if (!data) return null;
  
  // Map database column names to frontend camelCase
  if (data.pricerange) {
    return {
      ...data,
      priceRange: data.pricerange
    } as Service;
  }
  
  return data as Service;
}

/**
 * Creates a new service for the current authenticated user
 */
export async function createService(serviceData: ServiceFormData): Promise<{ success: boolean; data?: Service; error?: any }> {
  const supabase = createClient();
  
  console.log("Creating service with data:", JSON.stringify(serviceData, null, 2));
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return { success: false, error: userError };
    }
    
    console.log("User authenticated:", user.id);
    
    // Map frontend camelCase to database lowercase column names
    const formattedData = {
      name: serviceData.name,
      description: serviceData.description,
      features: Array.isArray(serviceData.features) ? serviceData.features : [],
      pricerange: serviceData.priceRange, // Match the actual database column name
      timeline: serviceData.timeline,
      category: serviceData.category,
      icon: serviceData.icon,
      deliverables: Array.isArray(serviceData.deliverables) ? serviceData.deliverables : [],
      process: Array.isArray(serviceData.process) ? serviceData.process : [],
      faq: Array.isArray(serviceData.faq) ? serviceData.faq : [],
      testimonials: Array.isArray(serviceData.testimonials) ? serviceData.testimonials : [],
      user_id: user.id
    };
    
    console.log("Prepared data for insert:", JSON.stringify(formattedData, null, 2));
    
    // Create the service
    const { data: newService, error } = await supabase
      .from("services")
      .insert(formattedData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating service:", error);
      return { success: false, error };
    }
    
    console.log("Service created successfully:", newService);
    
    // Map database column names back to frontend camelCase
    if (newService && newService.pricerange) {
      (newService as any).priceRange = newService.pricerange;
    }
    
    return { success: true, data: newService as Service };
  } catch (error) {
    console.error("Unexpected error in createService:", error);
    return { success: false, error };
  }
}

/**
 * Updates a service for the current authenticated user
 */
export async function updateService(serviceId: string, serviceData: Partial<ServiceFormData>): Promise<{ success: boolean; data?: Service; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Map frontend camelCase to database lowercase column names
  const formattedData: Record<string, any> = {};
  
  // Map each property with the correct case
  if (serviceData.name !== undefined) formattedData.name = serviceData.name;
  if (serviceData.description !== undefined) formattedData.description = serviceData.description;
  if (serviceData.features !== undefined) formattedData.features = serviceData.features;
  if (serviceData.priceRange !== undefined) formattedData.pricerange = serviceData.priceRange;
  if (serviceData.timeline !== undefined) formattedData.timeline = serviceData.timeline;
  if (serviceData.category !== undefined) formattedData.category = serviceData.category;
  if (serviceData.icon !== undefined) formattedData.icon = serviceData.icon;
  if (serviceData.deliverables !== undefined) formattedData.deliverables = serviceData.deliverables;
  if (serviceData.process !== undefined) formattedData.process = serviceData.process;
  if (serviceData.faq !== undefined) formattedData.faq = serviceData.faq;
  if (serviceData.testimonials !== undefined) formattedData.testimonials = serviceData.testimonials;
  
  // Update the service
  const { data: updatedService, error } = await supabase
    .from("services")
    .update(formattedData)
    .eq("id", serviceId)
    .eq("user_id", user.id) // Ensure the user can only update their own services
    .select()
    .single();
  
  if (error) {
    console.error("Error updating service:", error);
    return { success: false, error };
  }
  
  // Map database column names back to frontend camelCase
  if (updatedService && updatedService.pricerange) {
    (updatedService as any).priceRange = updatedService.pricerange;
  }
  
  return { success: true, data: updatedService as Service };
}

/**
 * Deletes a service for the current authenticated user
 */
export async function deleteService(serviceId: string): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Delete the service
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId)
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Error deleting service:", error);
    return { success: false, error };
  }
  
  return { success: true };
}

<<<<<<< HEAD
// Testimonial Functions
export async function getTestimonials(userId: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }

  return data as Testimonial[];
}

export async function getTestimonialById(id: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching testimonial:', error);
    throw error;
  }

  return data as Testimonial;
}

export async function createTestimonial(userId: string, testimonial: TestimonialFormData) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('testimonials')
    .insert([
      {
        user_id: userId,
        client_name: testimonial.client_name,
        client_position: testimonial.client_position,
        client_company: testimonial.client_company,
        content: testimonial.content,
        rating: testimonial.rating,
        image_url: testimonial.image_url,
        date: testimonial.date,
        project_type: testimonial.project_type,
        featured: testimonial.featured,
        contact_info: testimonial.contact_info,
        project_details: testimonial.project_details,
        related_case_studies: testimonial.related_case_studies
      }
    ])
    .select();

  if (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }

  return data[0] as Testimonial;
}

export async function updateTestimonial(id: string, testimonial: TestimonialFormData) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('testimonials')
    .update({
      client_name: testimonial.client_name,
      client_position: testimonial.client_position,
      client_company: testimonial.client_company,
      content: testimonial.content,
      rating: testimonial.rating,
      image_url: testimonial.image_url,
      date: testimonial.date,
      project_type: testimonial.project_type,
      featured: testimonial.featured,
      contact_info: testimonial.contact_info,
      project_details: testimonial.project_details,
      related_case_studies: testimonial.related_case_studies
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }

  return data[0] as Testimonial;
}

export async function deleteTestimonial(id: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }

  return true;
=======
/**
 * Fetches all testimonials for the current authenticated user
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return [];
  }
  
  // Get all testimonials for the user
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Fetches a specific testimonial by ID for the current authenticated user
 */
export async function getTestimonialById(testimonialId: string): Promise<Testimonial | null> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }
  
  // Get the testimonial
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", testimonialId)
    .eq("user_id", user.id)
    .single();
  
  if (error) {
    console.error("Error fetching testimonial:", error);
    return null;
  }
  
  return data;
}

/**
 * Creates a new testimonial for the current authenticated user
 */
export async function createTestimonial(testimonialData: TestimonialFormData): Promise<{ success: boolean; data?: Testimonial; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Prepare the data with the user_id
  const data = {
    ...testimonialData,
    user_id: user.id,
  };
  
  // Create the testimonial
  const { data: newTestimonial, error } = await supabase
    .from("testimonials")
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error };
  }
  
  return { success: true, data: newTestimonial };
}

/**
 * Updates a testimonial for the current authenticated user
 */
export async function updateTestimonial(testimonialId: string, testimonialData: Partial<TestimonialFormData>): Promise<{ success: boolean; data?: Testimonial; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Update the testimonial
  const { data, error } = await supabase
    .from("testimonials")
    .update(testimonialData)
    .eq("id", testimonialId)
    .eq("user_id", user.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

/**
 * Deletes a testimonial for the current authenticated user
 */
export async function deleteTestimonial(testimonialId: string): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Delete the testimonial
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", testimonialId)
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error };
  }
  
  return { success: true };
}

/**
 * Uploads a client image for a testimonial
 */
export async function uploadTestimonialClientImage(file: File): Promise<{ success: boolean; url?: string; error?: any }> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("testimonial-images")
    .upload(`${user.id}/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  
  if (error) {
    console.error("Error uploading testimonial client image:", error);
    return { success: false, error };
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from("testimonial-images")
    .getPublicUrl(data.path);
  
  return { success: true, url: publicUrl };
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
} 