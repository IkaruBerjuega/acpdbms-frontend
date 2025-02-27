'use client';

import {
  ColumnInterfaceProp,
  ProjectListResponseInterface,
} from '@/lib/definitions';

import { useProject } from '@/hooks/general/use-project';
import { useCreateTableColumns } from '../general/data-table-components/create-table-columns';
import DataTable from '../general/data-table-components/data-table';

export default function Table() {
  const { projects, isLoading } = useProject();

  const columns: ColumnInterfaceProp[] = [
    {
      id_string: 'select',
      filterFn: false,
    },
    {
      accessorKey_string: 'id',
      enableHiding: true,
    },

    {
      accessorKey_string: 'project_title',
      header_string: 'Project Title',
      meta: {
        filter_name: 'Project Title',
        filter_type: 'text',
        filter_columnAccessor: 'project_title',
      },
      filterFn: true,
    },
    {
      accessorKey_string: 'location',
      header_string: 'Location',
      meta: {
        filter_name: 'Location',
        filter_type: 'text',
        filter_columnAccessor: 'location',
      },
      filterFn: true,
    },
    {
      accessorKey_string: 'client_name',
      header_string: 'Client Name',
      meta: {
        filter_name: 'Client Name',
        filter_type: 'text',
        filter_columnAccessor: 'client_name',
      },
      filterFn: true,
    },
    {
      accessorKey_string: 'project_manager',
      header_string: 'Project Manager',
      meta: {
        filter_name: 'Project Manager',
        filter_type: 'text',
        filter_columnAccessor: 'project_manager',
      },
      filterFn: true,
    },
    {
      accessorKey_string: 'start_date',
      header_string: 'Start Date',
    },

    {
      accessorKey_string: 'end_date',
      header_string: 'End Date',
    },
    {
      accessorKey_string: 'finish_date',
      header_string: 'Finish Date',
    },
    {
      accessorKey_string: 'status',
      header_string: 'Status',
      meta: {
        filter_name: 'Status',
        filter_type: 'select',
        filter_columnAccessor: 'status',
        filter_options: [
          'finished',
          'on-hold',
          'ongoing',
          'cancelled',
          'archived',
        ],
      },
      filterFn: true,
    },
    {
      accessorKey_string: 'image_url',
      header_string: 'Image',
      enableHiding: true,
    },
  ];
  const transformedColumns =
    useCreateTableColumns<ProjectListResponseInterface>(columns);

  if (isLoading) {
    return <>Loading</>;
  }

  if (!projects) {
    return <>No Projects Yet</>;
  }

  return (
    <DataTable
      columns={transformedColumns}
      data={projects}
    />
  );
}
