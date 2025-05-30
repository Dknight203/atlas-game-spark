
import { useState, useEffect } from "react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserPlus, MoreHorizontal, Mail, Crown, Shield, User, Eye, Trash2 } from "lucide-react";

interface TeamManagementProps {
  organizationId: string;
}

const TeamManagement = ({ organizationId }: TeamManagementProps) => {
  const { currentOrgMembers, fetchOrgMembers, inviteMember, updateMemberRole, removeMember } = useOrganizations();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (organizationId) {
      fetchOrgMembers(organizationId);
    }
  }, [organizationId]);

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    const success = await inviteMember(organizationId, inviteEmail, inviteRole);
    
    if (success) {
      setShowInviteDialog(false);
      setInviteEmail("");
      setInviteRole('member');
    }
    setIsInviting(false);
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member' | 'viewer') => {
    const success = await updateMemberRole(memberId, newRole);
    if (success) {
      fetchOrgMembers(organizationId);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const success = await removeMember(memberId);
    if (success) {
      fetchOrgMembers(organizationId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'member': return <User className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button onClick={() => setShowInviteDialog(true)} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentOrgMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {member.profiles?.full_name?.charAt(0) || member.profiles?.email?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {member.profiles?.full_name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.profiles?.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getRoleColor(member.role)}>
                  {getRoleIcon(member.role)}
                  <span className="ml-1 capitalize">{member.role}</span>
                </Badge>
                
                {member.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                        <Shield className="w-4 h-4 mr-2" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                        <User className="w-4 h-4 mr-2" />
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'viewer')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}

          {currentOrgMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No team members yet</p>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={(value: 'admin' | 'member' | 'viewer') => setInviteRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin - Full access except billing</SelectItem>
                  <SelectItem value="member">Member - Can edit projects</SelectItem>
                  <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleInviteMember}
                disabled={!inviteEmail.trim() || isInviting}
              >
                {isInviting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TeamManagement;
