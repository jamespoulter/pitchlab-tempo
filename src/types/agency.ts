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
} 