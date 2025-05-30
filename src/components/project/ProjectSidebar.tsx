
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BarChart3, 
  Users, 
  Settings, 
  ArrowLeft,
  Target,
  TrendingUp,
  MessageSquare,
  Building2
} from "lucide-react";

interface ProjectSidebarProps {
  projectName: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  stats: {
    matches: number;
    communities: number;
    creators: number;
  };
}

const ProjectSidebar = ({ projectName, activeSection, onSectionChange, stats }: ProjectSidebarProps) => {
  const { id } = useParams();

  const workflowSections = [
    {
      id: "game-intelligence",
      label: "Game Intelligence",
      icon: Search,
      description: "Discover & analyze games",
      badge: null,
    },
    {
      id: "marketing-opportunities", 
      label: "Marketing Opportunities",
      icon: Target,
      description: "Communities & creators",
      badge: stats.communities + stats.creators,
    },
    {
      id: "analytics",
      label: "Performance Analytics", 
      icon: BarChart3,
      description: "Track your success",
      badge: null,
    }
  ];

  const otherSections = [
    {
      id: "settings",
      label: "Project Settings",
      icon: Settings,
      description: "Configure your project",
      badge: null,
    }
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Link to="/team">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Building2 className="w-4 h-4 mr-2" />
              Team Collaboration
            </Button>
          </Link>
          
          <div>
            <h2 className="font-semibold text-lg truncate" title={projectName}>
              {projectName}
            </h2>
            <p className="text-sm text-muted-foreground">Project Workspace</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workflow</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workflowSections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    isActive={activeSection === section.id}
                    onClick={() => onSectionChange(section.id)}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">{section.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {section.description}
                        </div>
                      </div>
                    </div>
                    {section.badge !== null && section.badge > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {section.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherSections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    isActive={activeSection === section.id}
                    onClick={() => onSectionChange(section.id)}
                  >
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ProjectSidebar;
