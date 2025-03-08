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
  -- New fields for additional details
  start_date DATE,
  end_date DATE,
  awards TEXT[] DEFAULT '{}',
  project_url TEXT,
  budget TEXT,
  client_logo_url TEXT,
  key_features TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  gallery_images TEXT[] DEFAULT '{}',
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add new columns if they don't exist (for existing tables)
DO $$
BEGIN
  -- Check if start_date column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'start_date') THEN
    ALTER TABLE case_studies ADD COLUMN start_date DATE;
  END IF;
  
  -- Check if end_date column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'end_date') THEN
    ALTER TABLE case_studies ADD COLUMN end_date DATE;
  END IF;
  
  -- Check if awards column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'awards') THEN
    ALTER TABLE case_studies ADD COLUMN awards TEXT[] DEFAULT '{}';
  END IF;
  
  -- Check if project_url column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'project_url') THEN
    ALTER TABLE case_studies ADD COLUMN project_url TEXT;
  END IF;
  
  -- Check if budget column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'budget') THEN
    ALTER TABLE case_studies ADD COLUMN budget TEXT;
  END IF;
  
  -- Check if client_logo_url column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'client_logo_url') THEN
    ALTER TABLE case_studies ADD COLUMN client_logo_url TEXT;
  END IF;
  
  -- Check if key_features column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'key_features') THEN
    ALTER TABLE case_studies ADD COLUMN key_features TEXT[] DEFAULT '{}';
  END IF;
  
  -- Check if metrics column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'metrics') THEN
    ALTER TABLE case_studies ADD COLUMN metrics JSONB DEFAULT '{}';
  END IF;
  
  -- Check if gallery_images column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'gallery_images') THEN
    ALTER TABLE case_studies ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
  END IF;
  
  -- Check if video_url column exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'video_url') THEN
    ALTER TABLE case_studies ADD COLUMN video_url TEXT;
  END IF;
END $$;

-- Create RLS policies for case_studies
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Check and create policies if they don't exist
DO $$
BEGIN
  -- Check if select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'case_studies' 
    AND policyname = 'Users can view their own case studies'
  ) THEN
    -- Policy for selecting case studies (users can only see their own)
    CREATE POLICY "Users can view their own case studies"
      ON case_studies
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  -- Check if insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'case_studies' 
    AND policyname = 'Users can insert their own case studies'
  ) THEN
    -- Policy for inserting case studies
    CREATE POLICY "Users can insert their own case studies"
      ON case_studies
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  -- Check if update policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'case_studies' 
    AND policyname = 'Users can update their own case studies'
  ) THEN
    -- Policy for updating case studies
    CREATE POLICY "Users can update their own case studies"
      ON case_studies
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  -- Check if delete policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'case_studies' 
    AND policyname = 'Users can delete their own case studies'
  ) THEN
    -- Policy for deleting case studies
    CREATE POLICY "Users can delete their own case studies"
      ON case_studies
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create storage bucket for case study images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('case_study_images', 'case_study_images', true)
ON CONFLICT (id) DO NOTHING;

-- Check and create storage policies if they don't exist
DO $$
BEGIN
  -- Check if select policy exists for storage
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public can view case study images'
  ) THEN
    -- Policy for viewing case study images
    CREATE POLICY "Public can view case study images"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'case_study_images');
  END IF;
  
  -- Check if insert policy exists for storage
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload case study images'
  ) THEN
    -- Policy for uploading case study images
    CREATE POLICY "Authenticated users can upload case study images"
      ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'case_study_images' AND
        auth.role() = 'authenticated'
      );
  END IF;
  
  -- Check if update policy exists for storage
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update their own case study images'
  ) THEN
    -- Policy for updating case study images
    CREATE POLICY "Users can update their own case study images"
      ON storage.objects
      FOR UPDATE
      USING (
        bucket_id = 'case_study_images' AND
        auth.uid() = owner
      );
  END IF;
  
  -- Check if delete policy exists for storage
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own case study images'
  ) THEN
    -- Policy for deleting case study images
    CREATE POLICY "Users can delete their own case study images"
      ON storage.objects
      FOR DELETE
      USING (
        bucket_id = 'case_study_images' AND
        auth.uid() = owner
      );
  END IF;
END $$; 