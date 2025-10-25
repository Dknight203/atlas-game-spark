-- Add workflow progress tracking to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS workflow_progress JSONB DEFAULT '{
  "profileComplete": false,
  "discoveryComplete": false,
  "analysisViewed": false
}'::jsonb;

-- Update existing projects with default workflow progress
UPDATE projects 
SET workflow_progress = '{
  "profileComplete": false,
  "discoveryComplete": false,
  "analysisViewed": false
}'::jsonb 
WHERE workflow_progress IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_workflow_progress ON projects USING gin(workflow_progress);