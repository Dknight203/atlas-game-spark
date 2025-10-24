import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AdminBadge = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check if user has super_admin or admin role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['super_admin', 'admin']);

      setIsAdmin(roles && roles.length > 0);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <Badge variant="default" className="bg-atlas-purple/10 text-atlas-purple border-atlas-purple/20 hover:bg-atlas-purple/20">
      <Shield className="w-3 h-3 mr-1" />
      Admin
    </Badge>
  );
};
