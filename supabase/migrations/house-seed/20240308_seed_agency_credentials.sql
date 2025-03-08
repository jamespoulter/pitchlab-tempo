-- Seed file for House337 agency_credentials data

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert agency credentials
INSERT INTO agency_credentials (
  id, user_id, title, issuer, issue_date, description, credential_url, image_url
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Cannes Lions Award Winner',
  'Cannes Lions International Festival of Creativity',
  '2023-06-22',
  'Awarded 1 Titanium, 1 Gold, 2 Silver, and 4 Bronze Lions for creative excellence',
  'https://www.canneslions.com/',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de1ed9bdc6608fe06e8376_White.svg'
),
(
  uuid_generate_v4(),
  user_uuid,
  'Creative Circle Award Winner',
  'Creative Circle',
  '2023-05-15',
  'Named Most Creative Company with 22 Gold, 9 Silver, and 10 Bronze awards',
  'https://www.creativecircle.co.uk/',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de1ee92c3d66ea6133963f_Black.svg'
),
(
  uuid_generate_v4(),
  user_uuid,
  'British Arrows Award Winner',
  'British Arrows',
  '2023-03-10',
  'Received 1 Special, 4 Gold, 3 Silver, and 4 Bronze awards',
  'https://www.britisharrows.com/',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64f9d838ec1468911af77c03_British-arrows.svg'
);

END $$; 