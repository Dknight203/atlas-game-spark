
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminBadge } from "@/components/admin/AdminBadge";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if we're on a dashboard/app page to show different navigation
  const isAppPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/project') || location.pathname.startsWith('/discovery') || location.pathname.startsWith('/analytics') || location.pathname.startsWith('/team') || location.pathname.startsWith('/settings');

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Signed out successfully",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to={isAppPage ? "/dashboard" : "/"} className="flex items-center">
              <span className="text-2xl font-bold text-atlas-purple">Game<span className="text-atlas-teal">Atlas</span></span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAppPage ? (
              // App navigation
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-atlas-purple px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/discovery" className="text-gray-600 hover:text-atlas-purple px-3 py-2 rounded-md text-sm font-medium">
                  Discovery
                </Link>
                <Link to="/analytics" className="text-gray-600 hover:text-atlas-purple px-3 py-2 rounded-md text-sm font-medium">
                  Analytics
                </Link>
                <AdminBadge />
                <Button variant="outline" className="ml-4" onClick={handleProfileClick}>
                  Settings
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              // Marketing site navigation
              <>
                <Link to="/pricing" className="text-gray-600 hover:text-atlas-purple px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
                <Link to="/features" className="text-gray-600 hover:text-atlas-purple px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-atlas-purple px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="ml-4">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-atlas-purple hover:bg-opacity-90">Sign up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-atlas-purple hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAppPage ? (
              // Mobile app navigation
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-atlas-purple block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                <Link to="/discovery" className="text-gray-600 hover:text-atlas-purple block px-3 py-2 rounded-md text-base font-medium">
                  Discovery
                </Link>
                <Link to="/analytics" className="text-gray-600 hover:text-atlas-purple block px-3 py-2 rounded-md text-base font-medium">
                  Analytics
                </Link>
                <Button variant="outline" className="w-full my-2" onClick={handleProfileClick}>
                  Settings
                </Button>
                <Button variant="outline" className="w-full my-2" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              // Mobile marketing navigation
              <>
                <Link to="/pricing" className="text-gray-600 hover:text-atlas-purple block px-3 py-2 rounded-md text-base font-medium">
                  Pricing
                </Link>
                <Link to="/features" className="text-gray-600 hover:text-atlas-purple block px-3 py-2 rounded-md text-base font-medium">
                  Features
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-atlas-purple block px-3 py-2 rounded-md text-base font-medium">
                  About
                </Link>
                <Link to="/login" className="block w-full">
                  <Button variant="outline" className="w-full my-2">Log in</Button>
                </Link>
                <Link to="/signup" className="block w-full">
                  <Button className="bg-atlas-purple w-full my-2">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
