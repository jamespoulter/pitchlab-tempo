-- Seed file for House337 agency_branding data

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert agency branding data
INSERT INTO agency_branding (
  id, user_id, colors, typography, logo_url, logo_dark_url, icon_url
) VALUES (
  uuid_generate_v4(),
  user_uuid,
  '[
    {"name": "Primary Pink", "hex": "#FF3366"},
    {"name": "Dark Grey", "hex": "#333333"},
    {"name": "Light Grey", "hex": "#F5F5F5"},
    {"name": "White", "hex": "#FFFFFF"}
  ]',
  '{
    "headings": "Montserrat, sans-serif",
    "body": "Roboto, sans-serif"
  }',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de46800fa67627c8c9b43d_DarkGrey%2BPink.svg',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64df2e37cc50773e850896eb_White%2BPink.svg',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/65019716d5d3076461632264_Bubble.svg'
);

END $$; 