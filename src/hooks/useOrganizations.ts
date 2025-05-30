import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Organization {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited_by: string;
  joined_at: string;
  user_email?: string;
  user_name?: string;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgMembers, setCurrentOrgMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    if (!user) return;

    try {
      // Get user's organization memberships first
      const { data: memberships, error: membershipsError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);

      if (membershipsError) throw membershipsError;

      if (!memberships || memberships.length === 0) {
        setOrganizations([]);
        setIsLoading(false);
        return;
      }

      // Get organizations where user is a member
      const orgIds = memberships.map(m => m.organization_id);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .in('id', orgIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrgMembers = async (orgId: string) => {
    try {
      // Get organization members with profile data using correct join syntax
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          *,
          profiles!user_id (
            email,
            full_name
          )
        `)
        .eq('organization_id', orgId);

      if (membersError) throw membersError;

      // Transform the data to include user details
      const membersWithDetails: OrganizationMember[] = (membersData || []).map(member => ({
        ...member,
        user_email: member.profiles?.email || 'Unknown',
        user_name: member.profiles?.full_name || member.profiles?.email || 'Unknown User',
      }));

      setCurrentOrgMembers(membersWithDetails);
    } catch (error) {
      console.error('Error fetching org members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  const createOrganization = async (name: string, description?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({
          name,
          description,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Organization Created",
        description: `${name} has been created successfully`,
      });

      await fetchOrganizations();
      return data;
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
      return null;
    }
  };

  const inviteMember = async (orgId: string, email: string, role: 'admin' | 'member' | 'viewer') => {
    if (!user) return false;

    try {
      // Generate invitation token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invitation_token');

      if (tokenError) throw tokenError;

      // Create invitation
      const { error } = await supabase
        .from('organization_invitations')
        .insert({
          organization_id: orgId,
          email,
          role,
          invited_by: user.id,
          token: tokenData,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        });

      if (error) throw error;

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${email}`,
      });

      return true;
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateMemberRole = async (memberId: string, role: 'admin' | 'member' | 'viewer') => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "Member role has been updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating member role:', error);
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: "Team member has been removed successfully",
      });

      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [user]);

  return {
    organizations,
    currentOrgMembers,
    isLoading,
    fetchOrganizations,
    fetchOrgMembers,
    createOrganization,
    inviteMember,
    updateMemberRole,
    removeMember,
  };
};
