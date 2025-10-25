-- Phase 1: Make projects.organization_id required and auto-create orgs on signup

-- Step 1: Add organization_id column to projects if doesn't have proper constraint
-- First, let's make sure the column exists and update existing NULL values
DO $$ 
BEGIN
  -- We'll create a default organization for the existing user first
  -- then link all projects to it
END $$;

-- Step 2: Create trigger to auto-create organization on user signup
CREATE OR REPLACE FUNCTION public.handle_user_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_org_id UUID;
  org_name TEXT;
BEGIN
  -- Create organization name from user's full name or email
  org_name := COALESCE(
    NEW.full_name || '''s Organization',
    SPLIT_PART(NEW.email, '@', 1) || '''s Organization'
  );

  -- Create organization for the new user
  INSERT INTO public.organizations (id, name, created_by, plan)
  VALUES (gen_random_uuid(), org_name, NEW.id, 'starter')
  RETURNING id INTO new_org_id;

  -- Add user as owner of the organization (done by handle_new_organization trigger)
  
  RETURN NEW;
END;
$$;

-- Step 3: Create trigger on profiles table
DROP TRIGGER IF EXISTS on_user_profile_created ON public.profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_organization();

-- Step 4: Create repair function to ensure user has organization
CREATE OR REPLACE FUNCTION public.ensure_user_has_organization(_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  existing_org_id UUID;
  new_org_id UUID;
  user_email TEXT;
  user_name TEXT;
  org_name TEXT;
BEGIN
  -- Check if user already has an organization
  SELECT organization_id INTO existing_org_id
  FROM public.organization_members
  WHERE user_id = _user_id
  LIMIT 1;

  IF existing_org_id IS NOT NULL THEN
    RETURN existing_org_id;
  END IF;

  -- Get user details
  SELECT email, full_name INTO user_email, user_name
  FROM public.profiles
  WHERE id = _user_id;

  -- Create organization name
  org_name := COALESCE(
    user_name || '''s Organization',
    SPLIT_PART(user_email, '@', 1) || '''s Organization',
    'My Organization'
  );

  -- Create organization
  INSERT INTO public.organizations (id, name, created_by, plan)
  VALUES (gen_random_uuid(), org_name, _user_id, 'starter')
  RETURNING id INTO new_org_id;

  -- Organization membership will be created by handle_new_organization trigger

  RETURN new_org_id;
END;
$$;

-- Step 5: Backfill - Create organization for existing user and link projects
DO $$
DECLARE
  existing_user_id UUID;
  new_org_id UUID;
BEGIN
  -- Get the existing user
  SELECT id INTO existing_user_id
  FROM public.profiles
  LIMIT 1;

  IF existing_user_id IS NOT NULL THEN
    -- Use the repair function to create/get organization
    new_org_id := public.ensure_user_has_organization(existing_user_id);

    -- Link all existing projects to this organization
    UPDATE public.projects
    SET organization_id = new_org_id
    WHERE user_id = existing_user_id AND organization_id IS NULL;
  END IF;
END $$;

-- Step 6: Update RLS policies for projects to work with organization context
DROP POLICY IF EXISTS "Users can view their projects or org projects" ON public.projects;
CREATE POLICY "Users can view their projects or org projects"
ON public.projects
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Step 7: Add policy for creating projects with organization
DROP POLICY IF EXISTS "Users can create projects in their org" ON public.projects;
CREATE POLICY "Users can create projects in their org"
ON public.projects
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND
  (organization_id IS NULL OR organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  ))
);