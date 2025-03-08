-- Create a storage bucket for agency assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-assets', 'agency-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the agency-assets bucket
-- Allow public access to view assets
CREATE POLICY "Public Access to Agency Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'agency-assets');

-- Allow authenticated users to insert their own assets
CREATE POLICY "Users can upload their own agency assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agency-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own assets
CREATE POLICY "Users can update their own agency assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'agency-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own assets
CREATE POLICY "Users can delete their own agency assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agency-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);