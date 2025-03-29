'use client';

import { filecolumns } from './file-columns';
import { useFilesList } from '@/hooks/general/use-files';
import { useCreateTableColumns } from '../../general/data-table-components/create-table-columns';
import DataTable from '../../general/data-table-components/data-table';

export default function FilesTable<T>({
  isArchived,
  initialData,
  projectId,
}: {
  isArchived: boolean;
  initialData: T[];
  projectId?: string;
}) {
  const transformedColumns = useCreateTableColumns<T>(filecolumns, 'Projects');

  const { data: filesList, isLoading } = useFilesList<T>({
    projectId: projectId,
    isArchived: isArchived,
    initialData: initialData,
  });

  if (isLoading) {
    return <>Loading</>;
  }

  if (!filesList || filesList.length === 0) {
    return <>{isArchived ? 'No Archived Files Yet' : 'No Files Yet'} </>;
  }

  return <DataTable columns={transformedColumns} data={filesList} />;
}
