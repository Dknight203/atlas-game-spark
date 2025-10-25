import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useOrganizationWithLimits() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['organization-with-limits', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      // Get user's organization
      const { data: membership, error: membershipError } = await supabase
        .from('organization_members')
        .select('organization_id, organizations(id, name, plan)')
        .eq('user_id', user.id)
        .single();

      if (membershipError) throw membershipError;
      if (!membership?.organizations) throw new Error('No organization found');

      return {
        id: membership.organizations.id,
        name: membership.organizations.name,
        plan: membership.organizations.plan as 'starter' | 'professional' | 'studio' | 'enterprise'
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
