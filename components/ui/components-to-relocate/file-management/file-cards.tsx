'use client';
import { useSearchParams } from 'next/navigation';
import { useFilesList } from '@/hooks/general/use-files';
import { useCreateTableColumns } from '../../general/data-table-components/create-table-columns';
import { useCustomTable } from '../../general/data-table-components/custom-tanstack';
import { Pagination } from '../../general/data-table-components/Pagination';
import FilterPopOver from '../../general/data-table-components/filter-components/filter-popover';
import { LuFilter } from 'react-icons/lu';
import FileCard from './file-card';
import type { FileListResponseInterface } from '@/lib/definitions';
import { filecolumns } from './file-columns';

interface FormattedFileListResponse
  extends Omit<FileListResponseInterface, 'uploaded_at' | 'type' | 'size'> {
  uploaded_at: string;
  type: string;
  size: string;
}

export default function FileCards<T extends FileListResponseInterface>({
  isArchived,
  initialData,
  projectId,
}: {
  isArchived: boolean;
  initialData: T[];
  projectId?: string;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || ''; // Extract query parameter for filtering

  // Transform columns for the table
  const transformedColumns = useCreateTableColumns<T>(filecolumns, 'Projects');

  // Fetch files using the custom hook
  const { data: filesList, isLoading } = useFilesList<T>({
    projectId: projectId,
    isArchived: isArchived,
    initialData: initialData,
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!filesList || filesList.length === 0) {
    return <div>{isArchived ? 'No Archived Files Yet' : 'No Files Yet'}</div>;
  }

  // Set up table with pagination and filtering
  const { table, filterComponents, filters, pagination } = useCustomTable(
    query,
    filesList,
    transformedColumns,
    8, // Items per page
    searchParams
  );

  return (
    <div className='flex w-full flex-col gap-2'>
      {/* Filter Section */}
      <div className='flex flex-wrap flex-col w-full h-auto gap-2'>
        <div>
          <FilterPopOver
            width='w-auto'
            content={filters}
            popoverName='Add Filter'
            icon={<LuFilter className='text-xs md:text-lg' />}
          />
        </div>
        <div className='flex flex-wrap flex-row gap-2 w-full h-auto'>
          {filterComponents} {/* Render FilterUi components */}
        </div>
      </div>

      {/* File Cards Grid */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-12 sm:gap-4'>
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <FileCard key={row.original.id} file={row.original} />
            ))
        ) : (
          <div className='w-full h-full col-span-full flex justify-center items-center'>
            No files.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination table={table} pagination={pagination} />
    </div>
  );
}
