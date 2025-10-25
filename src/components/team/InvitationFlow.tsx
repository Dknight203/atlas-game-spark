import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, UserPlus, Loader2 } from 'lucide-react';

interface InvitationFlowProps {
  organizationId: string;
  organizationName: string;
}

export function InvitationFlow({ organizationId, organizationName }: InvitationFlowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setIsInviting(true);

    try {
      // Generate invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      // Create invitation
      const { error: inviteError } = await supabase
        .from('organization_invitations')
        .insert({
          organization_id: organizationId,
          email: email.toLowerCase().trim(),
          role,
          invited_by: user!.id,
          token,
          expires_at: expiresAt.toISOString()
        });

      if (inviteError) throw inviteError;

      // Log activity
      await supabase.from('activity_log').insert({
        org_id: organizationId,
        type: 'team_invitation_sent',
        meta: {
          email,
          role,
          invited_by: user!.email
        }
      });

      toast({
        title: 'Invitation Sent',
        description: `An invitation has been sent to ${email}`
      });

      setEmail('');
      setRole('member');
    } catch (error: any) {
      console.error('Invitation error:', error);
      toast({
        title: 'Failed to Send Invitation',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Invite Team Member
        </CardTitle>
        <CardDescription>
          Add team members to {organizationName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isInviting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(v: any) => setRole(v)} disabled={isInviting}>
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {role === 'admin' ? 'Can manage team and settings' : 'Can view and edit projects'}
          </p>
        </div>

        <Button
          onClick={handleInvite}
          disabled={isInviting || !email}
          className="w-full"
        >
          {isInviting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Invitation
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
