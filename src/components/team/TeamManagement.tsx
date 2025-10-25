import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Crown, Shield, User } from "lucide-react";
import { InvitationFlow } from "@/components/team/InvitationFlow";

interface TeamManagementProps {
  organizationId: string;
}

const TeamManagement = ({ organizationId }: TeamManagementProps) => {
  const { data: organization } = useQuery({
    queryKey: ["organization", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", organizationId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });

  const { data: members, isLoading } = useQuery({
    queryKey: ["organization-members", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_members")
        .select(`
          id,
          role,
          joined_at,
          user_id
        `)
        .eq("organization_id", organizationId);

      if (error) throw error;

      // Fetch user profiles
      const membersWithProfiles = await Promise.all(
        (data || []).map(async (member) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", member.user_id)
            .single();

          return {
            ...member,
            user_email: profile?.email,
            user_name: profile?.full_name,
          };
        })
      );

      return membersWithProfiles;
    },
    enabled: !!organizationId,
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-6">
      <InvitationFlow
        organizationId={organizationId}
        organizationName={organization?.name || "Your Organization"}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            {members?.length || 0} members in this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading team members...
            </div>
          ) : members && members.length > 0 ? (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.user_name?.charAt(0) ||
                          member.user_email?.charAt(0) ||
                          "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.user_name || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.user_email}
                      </p>
                    </div>
                  </div>

                  <Badge className={getRoleColor(member.role)}>
                    {getRoleIcon(member.role)}
                    <span className="ml-1 capitalize">{member.role}</span>
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No team members yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
