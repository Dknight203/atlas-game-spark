-- Add plan column to organizations table
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'starter';

-- Create games table for game metadata from APIs
CREATE TABLE IF NOT EXISTS public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  igdb_id bigint,
  rawg_id bigint,
  steam_appid bigint,
  platforms jsonb DEFAULT '[]'::jsonb,
  genres jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create game_signals table for API response cache
CREATE TABLE IF NOT EXISTS public.game_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  source text NOT NULL,
  payload jsonb NOT NULL,
  fetched_at timestamptz DEFAULT now()
);

-- Create matches table for cross game match results
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  matched_game jsonb NOT NULL,
  score numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create community_opportunities table for Reddit/Discord finds
CREATE TABLE IF NOT EXISTS public.community_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  metrics jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create creators table for saved YouTube/Twitch/etc creators
CREATE TABLE IF NOT EXISTS public.creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  external_id text NOT NULL,
  handle text,
  url text,
  stats jsonb,
  last_contacted timestamptz
);

-- Create campaigns table for marketing campaign tracking
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

-- Create campaign_posts table for planned posts
CREATE TABLE IF NOT EXISTS public.campaign_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  game_id uuid REFERENCES public.games(id) ON DELETE SET NULL,
  channel text NOT NULL,
  planned_at timestamptz,
  copy text,
  status text DEFAULT 'planned'
);

-- Create activity_log table for user action tracking
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  meta jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create marketing_metrics table for ROI tracking
CREATE TABLE IF NOT EXISTS public.marketing_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  channel text,
  period_start date,
  period_end date,
  impressions bigint,
  clicks bigint,
  conversions bigint,
  revenue numeric
);

-- Create usage_counters table for plan limit tracking
CREATE TABLE IF NOT EXISTS public.usage_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  key text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- RLS policies for games table
CREATE POLICY "Users can view games in their org" ON public.games
  FOR SELECT USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create games in their org" ON public.games
  FOR INSERT WITH CHECK (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update games in their org" ON public.games
  FOR UPDATE USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete games in their org" ON public.games
  FOR DELETE USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

-- RLS policies for game_signals table
CREATE POLICY "Users can view signals for games in their org" ON public.game_signals
  FOR SELECT USING (game_id IN (
    SELECT id FROM public.games WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create signals for games in their org" ON public.game_signals
  FOR INSERT WITH CHECK (game_id IN (
    SELECT id FROM public.games WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

-- RLS policies for matches table
CREATE POLICY "Users can view matches for games in their org" ON public.matches
  FOR SELECT USING (game_id IN (
    SELECT id FROM public.games WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create matches for games in their org" ON public.matches
  FOR INSERT WITH CHECK (game_id IN (
    SELECT id FROM public.games WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

-- RLS policies for community_opportunities table
CREATE POLICY "Users can view opportunities for games in their org" ON public.community_opportunities
  FOR SELECT USING (game_id IN (
    SELECT id FROM public.games WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create opportunities for games in their org" ON public.community_opportunities
  FOR INSERT WITH CHECK (game_id IN (
    SELECT id FROM public.games WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

-- RLS policies for creators table
CREATE POLICY "Users can view creators in their org" ON public.creators
  FOR SELECT USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create creators in their org" ON public.creators
  FOR INSERT WITH CHECK (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update creators in their org" ON public.creators
  FOR UPDATE USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete creators in their org" ON public.creators
  FOR DELETE USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

-- RLS policies for campaigns table
CREATE POLICY "Users can view campaigns in their org" ON public.campaigns
  FOR SELECT USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create campaigns in their org" ON public.campaigns
  FOR INSERT WITH CHECK (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update campaigns in their org" ON public.campaigns
  FOR UPDATE USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete campaigns in their org" ON public.campaigns
  FOR DELETE USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

-- RLS policies for campaign_posts table
CREATE POLICY "Users can view campaign posts in their org" ON public.campaign_posts
  FOR SELECT USING (campaign_id IN (
    SELECT id FROM public.campaigns WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create campaign posts in their org" ON public.campaign_posts
  FOR INSERT WITH CHECK (campaign_id IN (
    SELECT id FROM public.campaigns WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update campaign posts in their org" ON public.campaign_posts
  FOR UPDATE USING (campaign_id IN (
    SELECT id FROM public.campaigns WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete campaign posts in their org" ON public.campaign_posts
  FOR DELETE USING (campaign_id IN (
    SELECT id FROM public.campaigns WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

-- RLS policies for activity_log table
CREATE POLICY "Users can view activity in their org" ON public.activity_log
  FOR SELECT USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create activity in their org" ON public.activity_log
  FOR INSERT WITH CHECK (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

-- RLS policies for marketing_metrics table
CREATE POLICY "Users can view metrics for campaigns in their org" ON public.marketing_metrics
  FOR SELECT USING (campaign_id IN (
    SELECT id FROM public.campaigns WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create metrics for campaigns in their org" ON public.marketing_metrics
  FOR INSERT WITH CHECK (campaign_id IN (
    SELECT id FROM public.campaigns WHERE org_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  ));

-- RLS policies for usage_counters table
CREATE POLICY "Users can view usage counters for their org" ON public.usage_counters
  FOR SELECT USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage usage counters for their org" ON public.usage_counters
  FOR ALL USING (org_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_games_org_id ON public.games(org_id);
CREATE INDEX IF NOT EXISTS idx_game_signals_game_id ON public.game_signals(game_id);
CREATE INDEX IF NOT EXISTS idx_matches_game_id ON public.matches(game_id);
CREATE INDEX IF NOT EXISTS idx_community_opportunities_game_id ON public.community_opportunities(game_id);
CREATE INDEX IF NOT EXISTS idx_creators_org_id ON public.creators(org_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org_id ON public.campaigns(org_id);
CREATE INDEX IF NOT EXISTS idx_campaign_posts_campaign_id ON public.campaign_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_org_id ON public.activity_log(org_id);
CREATE INDEX IF NOT EXISTS idx_marketing_metrics_campaign_id ON public.marketing_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_usage_counters_org_id ON public.usage_counters(org_id);
CREATE INDEX IF NOT EXISTS idx_usage_counters_period ON public.usage_counters(org_id, key, period_start, period_end);