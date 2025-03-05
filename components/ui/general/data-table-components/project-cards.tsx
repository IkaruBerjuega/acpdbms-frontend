'use client';

import { useMemo } from 'react';
import FilterPopOver from './filter-components/filter-popover';
import { LuFilter } from 'react-icons/lu';
import Card from '../../project-card';
import { projectColumns as columns } from './project-column-def';
import { useCustomTable } from './custom-tanstack';
import { useProject } from '@/hooks/general/use-project';
import { useRouter } from 'next/navigation';
import { ButtonLink } from '@/components/ui/button';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function ProjectCards({ query }: { query: string }) {
  const { projects = [], isLoading, isError, error } = useProject();

  const memoizedColumns = useMemo(() => columns, []);
  const memoizedProjects = useMemo(() => projects, [projects]);

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  const { table, filterComponents, filters, pagination } = useCustomTable(
    query,
    memoizedProjects,
    memoizedColumns,
    12
  );

  const router = useRouter();

  return (
    <div className='flex flex-grow w-full flex-col gap-2'>
      <div className='flex flex-wrap flex-col w-full h-auto gap-2'>
        <div>
          <FilterPopOver
            width='w-auto'
            content={filters}
            tableName='Projects'
            popoverName='Add Filter'
            icon={<LuFilter className='text-xs md:text-lg' />}
          />
        </div>

        <div className='flex flex-wrap flex-row gap-2 w-full h-auto'>
          {filterComponents}
        </div>
      </div>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-12 sm:gap-4 '>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card
              key={row.id}
              row={row}
              isClient={false}
              fn={() => {
                router.push(
                  `/admin/projects/${row.getValue('id') as string}/view`
                );
              }}
            />
          ))
        ) : (
          <div className='w-full h-full col-span-full flex justify-center items-center'>
            No projects.
          </div>
        )}
      </div>
      <div className='flex flex-row gap-2 justify-end w-full md:w-auto'>
        <ButtonLink
          variant='outline'
          onClick={() => table.setPageIndex(0)}
          href=''
          id='first'
          disabled={!table.getCanPreviousPage()}
        >
          <MdKeyboardDoubleArrowLeft className='text-xs md:text-lg' />
        </ButtonLink>
        <ButtonLink
          variant='outline'
          href=''
          onClick={() => table.previousPage()}
          id='previous'
          disabled={!table.getCanPreviousPage()}
          className='text-xs md:text-sm'
        >
          Previous
        </ButtonLink>
        <ButtonLink
          variant='outline'
          href=''
          onClick={() => table.nextPage()}
          id='next'
          disabled={!table.getCanNextPage()}
          className='text-xs md:text-sm'
        >
          Next
        </ButtonLink>
        <ButtonLink
          variant='outline'
          href=''
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          id='last'
          disabled={!table.getCanNextPage()}
        >
          <MdKeyboardDoubleArrowRight className='text-xs md:text-lg' />
        </ButtonLink>
      </div>
    </div>
  );
}
