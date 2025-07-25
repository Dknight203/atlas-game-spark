-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.user_can_access_org(org_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_organization_member(org_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id AND user_id = user_id
  );
$function$;

CREATE OR REPLACE FUNCTION public.can_manage_organization(org_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = user_id 
    AND role IN ('owner', 'admin')
  );
$function$;

CREATE OR REPLACE FUNCTION public.generate_invitation_token()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_org_role(org_id uuid, user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT role::text FROM public.organization_members 
  WHERE organization_id = org_id AND user_id = user_id
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_organization()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.organization_members (organization_id, user_id, role, invited_by)
  VALUES (NEW.id, NEW.created_by, 'owner', NEW.created_by);
  RETURN NEW;
END;
$function$;