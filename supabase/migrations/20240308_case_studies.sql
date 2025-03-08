-- Create case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  industry TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  challenge TEXT,
  solution TEXT,
  results TEXT,
  testimonial_quote TEXT,
  testimonial_author TEXT,
  testimonial_title TEXT,
  team_members TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for case_studies
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Policy for selecting case studies (users can only see their own)
CREATE POLICY "Users can view their own case studies"
  ON case_studies
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for inserting case studies
CREATE POLICY "Users can insert their own case studies"
  ON case_studies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating case studies
CREATE POLICY "Users can update their own case studies"
  ON case_studies
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for deleting case studies
CREATE POLICY "Users can delete their own case studies"
  ON case_studies
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for case study images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('case_study_images', 'case_study_images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for case study images
CREATE POLICY "Public can view case study images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'case_study_images');

CREATE POLICY "Authenticated users can upload case study images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'case_study_images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own case study images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'case_study_images' AND
    auth.uid() = owner
  );

CREATE POLICY "Users can delete their own case study images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'case_study_images' AND
    auth.uid() = owner
  ); 