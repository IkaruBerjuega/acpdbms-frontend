'use client';

import { projectColumns } from './project-column-def';
import DataTable from '@/components/ui/general/data-table-components/data-table';
import { useProject } from '@/hooks/general/use-project';

export default function ProjectTable() {
  const { projects, isLoading, isError, error } = useProject();

  console.log('Project List:', projects);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Failed to load projects.</p>;

  return (
    <div className='w-full flex-grow flex justify-center items-center'>
      {projects && projects.length > 0 ? (
        <DataTable columns={projectColumns} data={projects} />
      ) : (
        <p>No projects</p>
      )}
    </div>
  );
}
