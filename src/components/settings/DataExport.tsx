import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Download, Database, FileText, BarChart3, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";

const DataExport = () => {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [exportFormat, setExportFormat] = useState<string>("json");
  const [dataTypes, setDataTypes] = useState({
    projects: true,
    analytics: true,
    profiles: false,
    organizations: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();
  const { projects } = useProjects();

  const handleDataTypeChange = (type: string, checked: boolean) => {
    setDataTypes(prev => ({ ...prev, [type]: checked }));
  };

  const exportData = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const exportData: any = {};
      const totalSteps = Object.values(dataTypes).filter(Boolean).length;
      let currentStep = 0;

      // Export projects
      if (dataTypes.projects) {
        setExportProgress(Math.round((currentStep / totalSteps) * 100));
        const query = supabase.from('projects').select('*');
        
        if (selectedProject !== "all") {
          query.eq('id', selectedProject);
        }
        
        const { data: projectsData, error: projectsError } = await query;
        if (projectsError) throw projectsError;
        
        exportData.projects = projectsData;
        currentStep++;
      }

      // Export analytics
      if (dataTypes.analytics) {
        setExportProgress(Math.round((currentStep / totalSteps) * 100));
        const query = supabase.from('analytics_data').select('*');
        
        if (selectedProject !== "all") {
          query.eq('project_id', selectedProject);
        }
        
        const { data: analyticsData, error: analyticsError } = await query;
        if (analyticsError) throw analyticsError;
        
        exportData.analytics = analyticsData;
        currentStep++;
      }

      // Export profiles
      if (dataTypes.profiles) {
        setExportProgress(Math.round((currentStep / totalSteps) * 100));
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) throw profilesError;
        exportData.profiles = profilesData;
        currentStep++;
      }

      // Export organizations
      if (dataTypes.organizations) {
        setExportProgress(Math.round((currentStep / totalSteps) * 100));
        const { data: orgsData, error: orgsError } = await supabase
          .from('organizations')
          .select('*');
        
        if (orgsError) throw orgsError;
        exportData.organizations = orgsData;
        currentStep++;
      }

      setExportProgress(100);

      // Create and download file
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `gameatlas-export-${timestamp}.${exportFormat}`;
      
      let content: string;
      let mimeType: string;

      if (exportFormat === 'json') {
        content = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
      } else {
        // CSV export (simplified, just projects for now)
        const csvRows = [];
        if (exportData.projects) {
          csvRows.push('Project Name,Description,Genre,Platform,Status,Created At');
          exportData.projects.forEach((project: any) => {
            csvRows.push([
              project.name,
              project.description || '',
              project.genre || '',
              project.platform || '',
              project.status || '',
              project.created_at
            ].join(','));
          });
        }
        content = csvRows.join('\n');
        mimeType = 'text/csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Your data has been exported as ${filename}`,
      });

    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const deleteAllData = async () => {
    if (!confirm("Are you sure you want to delete ALL your data? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete in correct order due to foreign key constraints
      await supabase.from('analytics_data').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('signal_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('notification_preferences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      toast({
        title: "Data Deleted",
        description: "All your data has been permanently deleted",
      });

    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting your data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Data to Export</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="projects"
                  checked={dataTypes.projects}
                  onCheckedChange={(checked) => handleDataTypeChange('projects', checked as boolean)}
                />
                <label htmlFor="projects" className="flex items-center gap-2 text-sm">
                  <Database className="w-4 h-4" />
                  Projects
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics"
                  checked={dataTypes.analytics}
                  onCheckedChange={(checked) => handleDataTypeChange('analytics', checked as boolean)}
                />
                <label htmlFor="analytics" className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profiles"
                  checked={dataTypes.profiles}
                  onCheckedChange={(checked) => handleDataTypeChange('profiles', checked as boolean)}
                />
                <label htmlFor="profiles" className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  Profile Data
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organizations"
                  checked={dataTypes.organizations}
                  onCheckedChange={(checked) => handleDataTypeChange('organizations', checked as boolean)}
                />
                <label htmlFor="organizations" className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  Organizations
                </label>
              </div>
            </div>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Export Progress</Label>
                <span className="text-sm text-muted-foreground">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          <Button 
            onClick={exportData} 
            disabled={isExporting || !Object.values(dataTypes).some(Boolean)}
            className="w-full"
          >
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Delete All Data</Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete all your projects, analytics, and associated data. This action cannot be undone.
            </p>
          </div>

          <Button 
            variant="destructive" 
            onClick={deleteAllData}
            className="w-full"
          >
            Delete All Data
          </Button>
        </CardContent>
      </Card>

      {/* Backup Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Automatic Backups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure automatic data backups to ensure your information is safely stored.
          </p>
          
          <div className="space-y-2">
            <Label>Backup Frequency</Label>
            <Select defaultValue="weekly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            🚧 Automatic backups are coming soon! For now, please use the manual export feature above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExport;