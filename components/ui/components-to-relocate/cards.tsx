import { ColumnInterfaceProp } from '@/lib/definitions';
import { useCreateTableColumns } from '../general/data-table-components/create-table-columns';
import { useProjectList } from '@/hooks/general/use-project';
import ProjectCards from '../general/data-table-components/project-cards';

export default function Cards<T>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  const columns: ColumnInterfaceProp[] = [
    { id: 'select', filterFn: false },
    { accessorKey: 'id', enableHiding: true },
    { accessorKey: 'project_title', header: 'Project Title' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'client_name', header: 'Client Name' },
    { accessorKey: 'project_manager', header: 'Project Manager' },
    { accessorKey: 'start_date', header: 'Start Date' },
    { accessorKey: 'end_date', header: 'End Date' },
    { accessorKey: 'finish_date', header: 'Finish Date' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'image_url', header: 'Image', enableHiding: true },
    { id: 'actions', header: 'Actions' },
  ];
  const transformedColumns = useCreateTableColumns<T>(columns, 'Projects');

  const { data: ProjectList, isLoading } = useProjectList<T>({
    isArchived: isArchived,
    initialData: initialData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!ProjectList) return <>No Projects Yet</>;
  return <ProjectCards columns={transformedColumns} data={ProjectList} />;
}
