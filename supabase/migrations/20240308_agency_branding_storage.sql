-- Create a storage bucket for agency branding assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-branding', 'agency-branding', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the agency-branding bucket
-- Allow public access to view branding assets
CREATE POLICY "Public Access to Branding Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'agency-branding');

-- Allow authenticated users to insert their own branding assets
CREATE POLICY "Users can upload their own branding assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agency-branding' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own branding assets
CREATE POLICY "Users can update their own branding assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'agency-branding' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own branding assets
CREATE POLICY "Users can delete their own branding assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agency-branding' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 