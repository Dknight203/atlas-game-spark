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
        .maybeSingle();

      if (membershipError) throw membershipError;

      // If no organization found, try to create one (repair function)
      if (!membership?.organizations) {
        const { data: orgId, error: repairError } = await supabase.rpc('ensure_user_has_organization', {
          _user_id: user.id
        });

        if (repairError || !orgId) {
          throw new Error('Failed to create organization');
        }

        // Fetch the newly created organization
        const { data: newMembership, error: newMembershipError } = await supabase
          .from('organization_members')
          .select('organization_id, organizations(id, name, plan)')
          .eq('user_id', user.id)
          .single();

        if (newMembershipError || !newMembership?.organizations) {
          throw new Error('Failed to fetch organization after creation');
        }

        return {
          id: newMembership.organizations.id,
          name: newMembership.organizations.name,
          plan: newMembership.organizations.plan as 'starter' | 'professional' | 'studio' | 'enterprise'
        };
      }

      return {
        id: membership.organizations.id,
        name: membership.organizations.name,
        plan: membership.organizations.plan as 'starter' | 'professional' | 'studio' | 'enterprise'
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
