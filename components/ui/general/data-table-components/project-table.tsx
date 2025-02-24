'use client';

import { useEffect, useMemo } from 'react';
import { projectColumns } from './project-column-def';
import DataTable from '@/components/ui/general/data-table-components/data-table';
import { useProject } from '@/hooks/general/use-project';
import { useProjectContext } from '@/lib/context/project-context';

export default function ProjectTable() {
  const { projectList } = useProject();
  const { data, isLoading, error } = projectList;
  const { setProjects } = useProjectContext();

  // Update context when data is available
  useEffect(() => {
    if (data?.length) {
      setProjects(data);
    }
  }, [data, setProjects]);

  // Memoize columns and data to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => projectColumns, []);
  const memoizedData = useMemo(() => data || [], [data]);

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Failed to load projects.</p>;

  return (
    <div className='w-full flex-grow flex justify-center items-center'>
      {memoizedData.length > 0 ? (
        <DataTable
          columns={memoizedColumns}
          data={memoizedData}
        />
      ) : (
        <p>No projects</p>
      )}
    </div>
  );
}
