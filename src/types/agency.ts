export interface AgencyProfile {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  founded: string;
  employees: string;
  industries: string[];
  mission: string;
  vision: string;
  logo_url?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    [key: string]: string | undefined;
  };
  values?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AgencyProfileFormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  founded: string;
  employees: string;
  industries: string[];
  mission: string;
  vision: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    [key: string]: string | undefined;
  };
  values?: string[];
}

export interface ColorItem {
  name: string;
  color: string;
  variable: string;
}

export interface Typography {
  headings: {
    fontFamily: string;
    weights: string[];
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
    };
  };
  body: {
    fontFamily: string;
    weights: string[];
    sizes?: {
      base: string;
      small: string;
      large: string;
    };
  };
}

export interface AgencyBranding {
  id?: string;
  user_id?: string;
  colors: ColorItem[];
  typography: Typography;
  logo_url?: string;
  logo_dark_url?: string;
  icon_url?: string;
  assets?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AgencyAsset {
  id?: string;
  user_id?: string;
  name: string;
  file_url: string;
  file_type: 'image' | 'document' | 'video' | 'other';
  file_size?: number;
  mime_type?: string;
  description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AgencyAssetFormData {
  name: string;
  file_url: string;
  file_type: 'image' | 'document' | 'video' | 'other';
  file_size?: number;
  mime_type?: string;
  description?: string;
  tags?: string[];
}

export interface AgencyCredential {
  id?: string;
  user_id?: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  description?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AgencyCredentialFormData {
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  description?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
}

// Case Study Types
export interface CaseStudy {
  id: string;
  user_id: string;
  title: string;
  client: string;
  industry: string;
  date: string;
  image_url: string | null;
  tags: string[];
  challenge: string | null;
  solution: string | null;
  results: string | null;
  testimonial_quote: string | null;
  testimonial_author: string | null;
  testimonial_title: string | null;
  team_members: string[];
  technologies: string[];
  timeline: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyFormData {
  title: string;
  client: string;
  industry: string;
  date: string;
  image_url?: string | null;
  tags: string[];
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  testimonial_quote?: string | null;
  testimonial_author?: string | null;
  testimonial_title?: string | null;
  team_members: string[];
  technologies: string[];
  timeline?: string | null;
} 