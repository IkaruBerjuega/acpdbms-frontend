'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Project {
  id: number;
  project_title: string;
}

interface FileFiltersProps {
  onFilterChange: (filters: {
    projectId: number | null;
    project_title: string | null;
  }) => void;
  currentFilters: { projectId: number | null };
  projects: Project[];
  className?: string;
}

export default function FileFilters({
  onFilterChange,
  currentFilters,
  projects,
  className,
}: FileFiltersProps) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  // Get projectId from URL (default to currentFilters.projectId)
  const projectIdFromUrl = searchParams.get('projectId')
    ? Number(searchParams.get('projectId'))
    : currentFilters.projectId;

  // Find the project title dynamically
  const activeProject = projects.find((p) => p.id === projectIdFromUrl);
  const activeProjectId = activeProject ? activeProject.id.toString() : '';

  const handleProjectChange = (value: string) => {
    const selectedProject = projects.find((p) => p.id.toString() === value);
    const projectId = selectedProject ? selectedProject.id : null;

    // Update URL with projectId
    const params = new URLSearchParams(searchParams);
    if (projectId) {
      params.set('projectId', projectId.toString());
    } else {
      params.delete('projectId');
    }
    replace(`${pathname}?${params.toString()}`);

    // Pass projectId to parent
    onFilterChange({
      projectId,
      project_title: selectedProject ? selectedProject.project_title : null,
    });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('projectId');
    replace(`${pathname}?${params.toString()}`);

    onFilterChange({ projectId: null, project_title: null });
  };

  return (
    <div className={cn('w-full h-full space-y-4', className)}>
      <div className='space-y-2'>
        <Label htmlFor='project-filter' className='font-medium'>
          Project
        </Label>
        <Select value={activeProjectId} onValueChange={handleProjectChange}>
          <SelectTrigger id='project-filter'>
            <SelectValue placeholder='Select Project' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none'>Select Project</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.project_title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant='outline'
        size='sm'
        onClick={resetFilters}
        className='w-full flex items-center justify-center mt-4'
      >
        <X className='h-4 w-4 mr-2' />
        Clear Selection
      </Button>
    </div>
  );
}
