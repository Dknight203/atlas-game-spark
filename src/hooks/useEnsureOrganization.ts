import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useEnsureOrganization() {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const ensureOrganization = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        // Check if user has an organization
        const { data: membership, error: membershipError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (membershipError) throw membershipError;

        if (membership?.organization_id) {
          setOrganizationId(membership.organization_id);
          setIsChecking(false);
          return;
        }

        // No organization found - call repair function
        console.log('No organization found for user, creating one...');
        
        const { data, error } = await supabase.rpc('ensure_user_has_organization', {
          _user_id: user.id
        });

        if (error) throw error;

        setOrganizationId(data);
        
      } catch (error) {
        console.error('Error ensuring organization:', error);
        toast({
          title: 'Setup Error',
          description: 'Failed to set up your workspace. Please refresh the page.',
          variant: 'destructive'
        });
      } finally {
        setIsChecking(false);
      }
    };

    ensureOrganization();
  }, [user, toast]);

  return { organizationId, isChecking };
}
