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
    {"name": "Primary Pink", "color": "#FF3366", "variable": "--primary"},
    {"name": "Dark Grey", "color": "#333333", "variable": "--secondary"},
    {"name": "Light Grey", "color": "#F5F5F5", "variable": "--background"},
    {"name": "White", "color": "#FFFFFF", "variable": "--white"},
    {"name": "Text", "color": "#333333", "variable": "--text"}
  ]',
  '{
    "headings": {
      "fontFamily": "Helvetica, sans-serif",
      "weights": ["600", "700"],
      "sizes": {
        "h1": "2.5rem",
        "h2": "2rem",
        "h3": "1.5rem",
        "h4": "1.25rem",
        "h5": "1rem"
      }
    },
    "body": {
      "fontFamily": "Helvetica, sans-serif",
      "weights": ["400", "500"]
    }
  }',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de46800fa67627c8c9b43d_DarkGrey%2BPink.svg',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64df2e37cc50773e850896eb_White%2BPink.svg',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/65019716d5d3076461632264_Bubble.svg'
);

END $$; 