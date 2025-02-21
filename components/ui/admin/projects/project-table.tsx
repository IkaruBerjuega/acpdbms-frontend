'use client';

import { projectColumns } from './project-column-def';
import { projects as data } from '@/lib/placeholder-data';
import DataTable from '@/components/ui/general/data-table-components/data-table';

export default function ProjectTable() {
  return (
    <div className='w-full flex-grow flex justify-center items-center'>
      {data.length > 0 ? (
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
