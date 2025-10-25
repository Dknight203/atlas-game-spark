import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('organization_invitations')
        .select('*, organizations(name)')
        .eq('token', token)
        .is('accepted_at', null)
        .single();

      if (fetchError) throw new Error('Invitation not found or already accepted');

      // Check if expired
      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        throw new Error('Invitation has expired');
      }

      setInvitation(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!user) {
      toast({
        title: 'Sign in Required',
        description: 'Please sign in to accept this invitation',
        variant: 'destructive'
      });
      navigate(`/login?redirect=/accept-invitation?token=${token}`);
      return;
    }

    if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
      toast({
        title: 'Email Mismatch',
        description: 'Please sign in with the invited email address',
        variant: 'destructive'
      });
      return;
    }

    setAccepting(true);

    try {
      // Add user to organization
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: invitation.organization_id,
          user_id: user.id,
          role: invitation.role,
          invited_by: invitation.invited_by
        });

      if (memberError) throw memberError;

      // Mark invitation as accepted
      const { error: updateError } = await supabase
        .from('organization_invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('activity_log').insert({
        org_id: invitation.organization_id,
        type: 'team_member_joined',
        meta: {
          user_email: user.email,
          role: invitation.role
        }
      });

      toast({
        title: 'Invitation Accepted',
        description: `Welcome to ${invitation.organizations.name}!`
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Accept error:', err);
      toast({
        title: 'Failed to Accept Invitation',
        description: err.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-md">
          {loading ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                <p>Loading invitation...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  Invalid Invitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Team Invitation
                </CardTitle>
                <CardDescription>
                  You have been invited to join an organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Organization</span>
                    <span className="text-sm">{invitation?.organizations?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Role</span>
                    <span className="text-sm capitalize">{invitation?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Invited Email</span>
                    <span className="text-sm">{invitation?.email}</span>
                  </div>
                </div>

                {user ? (
                  user.email?.toLowerCase() === invitation?.email.toLowerCase() ? (
                    <Button
                      onClick={handleAccept}
                      disabled={accepting}
                      className="w-full"
                    >
                      {accepting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Accepting
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Invitation
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-destructive">
                        You are signed in as {user.email}. Please sign in with {invitation?.email} to accept this invitation.
                      </p>
                      <Button
                        onClick={() => navigate(`/login?redirect=/accept-invitation?token=${token}`)}
                        variant="outline"
                        className="w-full"
                      >
                        Sign in with Different Account
                      </Button>
                    </div>
                  )
                ) : (
                  <Button
                    onClick={() => navigate(`/login?redirect=/accept-invitation?token=${token}`)}
                    className="w-full"
                  >
                    Sign in to Accept
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
