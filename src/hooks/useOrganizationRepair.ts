import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that runs organization repair on mount
 * This ensures existing users without organizations get one created
 */
export function useOrganizationRepair() {
  const { user } = useAuth();

  useEffect(() => {
    const repairOrganization = async () => {
      if (!user) return;

      try {
        // Check if user has organization
        const { data: membership } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (!membership?.organization_id) {
          console.log('Repairing: Creating organization for existing user');
          await supabase.rpc('ensure_user_has_organization', {
            _user_id: user.id
          });
        }
      } catch (error) {
        console.error('Organization repair failed:', error);
      }
    };

    repairOrganization();
  }, [user]);
}
