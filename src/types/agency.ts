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
  start_date: string | null;
  end_date: string | null;
  awards: string[];
  project_url: string | null;
  budget: string | null;
  client_logo_url: string | null;
  key_features: string[];
  metrics: Record<string, string> | null;
  gallery_images: string[];
  video_url: string | null;
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
  start_date?: string | null;
  end_date?: string | null;
  awards?: string[];
  project_url?: string | null;
  budget?: string | null;
  client_logo_url?: string | null;
  key_features?: string[];
  metrics?: Record<string, string> | null;
  gallery_images?: string[];
  video_url?: string | null;
}

// Team Member Types
export interface TeamMember {
  id?: string;
  user_id?: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  skills: string[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience?: {
    position: string;
    company: string;
    duration: string;
  }[];
  projects?: string[];
  certifications?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TeamMemberFormData {
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  skills: string[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience?: {
    position: string;
    company: string;
    duration: string;
  }[];
  projects?: string[];
  certifications?: string[];
}

// Service Types
export interface Service {
  id?: string;
  user_id?: string;
  name: string;
  description: string;
  features: string[];
  priceRange: string;
  timeline: string;
  category: string;
  icon: string;
  deliverables: string[];
  process?: {
    name: string;
    description: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  testimonials?: {
    quote: string;
    author: string;
    title: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  features: string[];
  priceRange: string;
  timeline: string;
  category: string;
  icon: string;
  deliverables: string[];
  process?: {
    name: string;
    description: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  testimonials?: {
    quote: string;
    author: string;
    title: string;
  }[];
}

// Testimonial Types
export interface Testimonial {
  id?: string;
  user_id?: string;
  client_name: string;
  client_position?: string;
  client_company?: string;
  content: string;
  rating?: number;
  image_url?: string;
  date?: string;
  project_type?: string;
  featured?: boolean;
  contact_info?: {
    email?: string;
    phone?: string;
  };
  project_details?: {
    start_date?: string;
    end_date?: string;
    services?: string[];
    results?: string[];
  };
  related_case_studies?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TestimonialFormData {
  client_name: string;
  client_position?: string;
  client_company?: string;
  content: string;
  rating?: number;
  image_url?: string;
  date?: string;
  project_type?: string;
  featured?: boolean;
  contact_info?: {
    email?: string;
    phone?: string;
  };
  project_details?: {
    start_date?: string;
    end_date?: string;
    services?: string[];
    results?: string[];
  };
  related_case_studies?: string[];
} 