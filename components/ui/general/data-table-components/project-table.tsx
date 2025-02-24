'use client';

import { useEffect, useMemo } from 'react';
import { projectColumns } from './project-column-def';
import DataTable from '@/components/ui/general/data-table-components/data-table';
import { useProject } from '@/hooks/general/use-project';
import { useProjectContext } from '@/lib/context/project-context';

export default function ProjectTable({ query }: { query: string }) {
  const { projects, isLoading, isError, error } = useProject();
  const { setProjects } = useProjectContext();

  // Update context when data is available
  useEffect(() => {
    if (projects?.length) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  // Memoize columns and data to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => projectColumns, []);
  const memoizedData = useMemo(() => projects || [], [projects]);

  if (isLoading) return <p>Loading projects...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div className='w-full flex flex-grow justify-center items-center'>
      {memoizedData.length > 0 ? (
        <DataTable columns={memoizedColumns} data={memoizedData} />
      ) : (
        <p>No projects</p>
      )}
    </div>
  );
}
