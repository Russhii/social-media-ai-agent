CREATE TABLE IF NOT EXISTS public.campaign (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  icon TEXT NOT NULL DEFAULT '✦',
  office_image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaign_owner_select ON public.campaign;
CREATE POLICY campaign_owner_select ON public.campaign
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS campaign_owner_insert ON public.campaign;
CREATE POLICY campaign_owner_insert ON public.campaign
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE ALL ON public.campaign FROM anon, authenticated;
GRANT SELECT, INSERT ON public.campaign TO authenticated;
