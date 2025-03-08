-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  education JSONB[] DEFAULT '{}',
  experience JSONB[] DEFAULT '{}',
  projects TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  priceRange TEXT NOT NULL,
  timeline TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  process JSONB[] DEFAULT '{}',
  faq JSONB[] DEFAULT '{}',
  testimonials JSONB[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy for selecting team members (users can only see their own team members)
CREATE POLICY "Users can view their own team members" 
  ON team_members 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for inserting team members (users can only insert their own team members)
CREATE POLICY "Users can insert their own team members" 
  ON team_members 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating team members (users can only update their own team members)
CREATE POLICY "Users can update their own team members" 
  ON team_members 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for deleting team members (users can only delete their own team members)
CREATE POLICY "Users can delete their own team members" 
  ON team_members 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy for selecting services (users can only see their own services)
CREATE POLICY "Users can view their own services" 
  ON services 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for inserting services (users can only insert their own services)
CREATE POLICY "Users can insert their own services" 
  ON services 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating services (users can only update their own services)
CREATE POLICY "Users can update their own services" 
  ON services 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for deleting services (users can only delete their own services)
CREATE POLICY "Users can delete their own services" 
  ON services 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for team member avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('team-avatars', 'team-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access to team avatars
CREATE POLICY "Public can view team avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'team-avatars');

-- Create policy to allow authenticated users to upload team avatars
CREATE POLICY "Authenticated users can upload team avatars"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'team-avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policy to allow users to update and delete their own team avatars
CREATE POLICY "Users can update their own team avatars"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'team-avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own team avatars"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'team-avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp for team_members
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON team_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update updated_at timestamp for services
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 