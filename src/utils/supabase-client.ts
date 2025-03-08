import { createBrowserClient } from "@supabase/ssr";
import { AgencyProfile, AgencyProfileFormData, AgencyBranding, AgencyAsset, AgencyAssetFormData, AgencyCredential, AgencyCredentialFormData, CaseStudy, CaseStudyFormData } from "@/types/agency";

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
  
  // Prepare the data with the user_id
  const data: Partial<AgencyBranding> = {
    ...brandingData,
    colors: colors,
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
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      console.error("No authenticated user found");
      return [];
    }
    
    const { data, error } = await supabase
      .from("agency_credentials")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching agency credentials:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAgencyCredentials:", error);
    return [];
  }
}

export async function getAgencyCredentialById(credentialId: string): Promise<AgencyCredential | null> {
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      console.error("No authenticated user found");
      return null;
    }
    
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
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      console.error("No authenticated user found");
      return { success: false, error: "No authenticated user found" };
    }
    
    const { data, error } = await supabase
      .from("agency_credentials")
      .insert({
        ...credentialData,
        user_id: user.data.user.id,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating agency credential:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error in createAgencyCredential:", error);
    return { success: false, error };
  }
}

export async function updateAgencyCredential(credentialId: string, credentialData: Partial<AgencyCredentialFormData>): Promise<{ success: boolean; data?: AgencyCredential; error?: any }> {
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      console.error("No authenticated user found");
      return { success: false, error: "No authenticated user found" };
    }
    
    const { data, error } = await supabase
      .from("agency_credentials")
      .update(credentialData)
      .eq("id", credentialId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating agency credential:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateAgencyCredential:", error);
    return { success: false, error };
  }
}

export async function deleteAgencyCredential(credentialId: string): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      console.error("No authenticated user found");
      return { success: false, error: "No authenticated user found" };
    }
    
    const { error } = await supabase
      .from("agency_credentials")
      .delete()
      .eq("id", credentialId);
    
    if (error) {
      console.error("Error deleting agency credential:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteAgencyCredential:", error);
    return { success: false, error };
  }
}

export async function uploadCredentialImage(file: File): Promise<{ success: boolean; url?: string; error?: any }> {
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      console.error("No authenticated user found");
      return { success: false, error: "No authenticated user found" };
    }
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${user.data.user.id}/credentials/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('agency-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading credential image:", error);
      return { success: false, error };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('agency-assets')
      .getPublicUrl(filePath);
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error in uploadCredentialImage:", error);
    return { success: false, error };
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