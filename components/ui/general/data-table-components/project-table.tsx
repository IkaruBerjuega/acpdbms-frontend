'use client';

import { projectColumns } from './project-column-def';
import DataTable from '@/components/ui/general/data-table-components/data-table';
import { useProject } from '@/hooks/general/use-project';

export default function ProjectTable() {
  const { projectList } = useProject();
  const { data, isLoading, error } = projectList;

  console.log('Project List:', projectList);
  console.log('Data:', data);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Failed to load projects.</p>;

  return (
    <div className='w-full flex-grow flex justify-center items-center'>
      {data && data.length > 0 ? (
        <DataTable
          columns={projectColumns}
          data={data}
        />
      ) : (
        <p>No projects</p>
      )}
    </div>
  );
}
