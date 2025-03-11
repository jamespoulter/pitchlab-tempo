-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_role TEXT,
  client_image_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  project_name TEXT,
  project_date TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for testimonials if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'testimonials' AND policyname = 'Users can view their own testimonials'
  ) THEN
    -- Policy for selecting testimonials (users can only see their own testimonials)
    CREATE POLICY "Users can view their own testimonials" 
      ON testimonials 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'testimonials' AND policyname = 'Users can insert their own testimonials'
  ) THEN
    -- Policy for inserting testimonials (users can only insert their own testimonials)
    CREATE POLICY "Users can insert their own testimonials" 
      ON testimonials 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'testimonials' AND policyname = 'Users can update their own testimonials'
  ) THEN
    -- Policy for updating testimonials (users can only update their own testimonials)
    CREATE POLICY "Users can update their own testimonials" 
      ON testimonials 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'testimonials' AND policyname = 'Users can delete their own testimonials'
  ) THEN
    -- Policy for deleting testimonials (users can only delete their own testimonials)
    CREATE POLICY "Users can delete their own testimonials" 
      ON testimonials 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Enable RLS on testimonials table if not already enabled
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_testimonials_updated_at'
  ) THEN
    CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Create storage bucket for testimonial client images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('testimonial-images', 'testimonial-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow authenticated users to upload testimonial client images'
  ) THEN
    -- Create policy to allow authenticated users to upload testimonial client images
    CREATE POLICY "Allow authenticated users to upload testimonial client images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'testimonial-images' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow authenticated users to update their own testimonial client images'
  ) THEN
    -- Create policy to allow authenticated users to update their own testimonial client images
    CREATE POLICY "Allow authenticated users to update their own testimonial client images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'testimonial-images' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow authenticated users to delete their own testimonial client images'
  ) THEN
    -- Create policy to allow authenticated users to delete their own testimonial client images
    CREATE POLICY "Allow authenticated users to delete their own testimonial client images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'testimonial-images' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow public access to testimonial client images'
  ) THEN
    -- Create policy to allow public access to testimonial client images
    CREATE POLICY "Allow public access to testimonial client images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'testimonial-images');
  END IF;
END
$$; 