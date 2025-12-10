-- Update public_profiles view to include new color columns
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  tagline,
  avatar_url,
  background_url,
  slug,
  created_at,
  updated_at,
  box_color,
  box_text_color,
  icon_color,
  icon_bg_color
FROM public.profiles;