import { ColumnInterfaceProp } from '@/lib/definitions';

export const filecolumns: ColumnInterfaceProp[] = [
  {
    id: 'select',
    filterFn: false,
  },
  {
    accessorKey: 'id',
    enableHiding: true,
  },

  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      filter_name: 'Name',
      filter_type: 'text',
      filter_columnAccessor: 'name',
    },
    filterFn: true,
  },
  {
    accessorKey: 'task_version_number',
    header: 'Task Version',
    meta: {
      filter_name: 'Task Version',
      filter_type: 'text',
      filter_columnAccessor: 'task_version',
    },
    filterFn: true,
  },
  {
    accessorKey: 'size',
    header: 'Size',
    meta: {
      filter_name: 'Size',
      filter_type: 'text',
      filter_columnAccessor: 'size',
    },
    filterFn: true,
  },
  {
    accessorKey: 'type',
    header: 'File Type',
    meta: {
      filter_name: 'File Type',
      filter_type: 'text',
      filter_columnAccessor: 'type',
    },
    filterFn: true,
  },
  {
    accessorKey: 'uploaded_by',
    header: 'Uploaded By',
    meta: {
      filter_name: 'Uploaded By',
      filter_type: 'text',
      filter_columnAccessor: 'uploaded_by',
    },
    filterFn: true,
  },
  {
    accessorKey: 'uploaded_at',
    header: 'Uploaded At',
    meta: {
      filter_name: 'Uploaded At',
      filter_type: 'text',
      filter_columnAccessor: 'uploaded_at',
    },
    filterFn: true,
  },
];
