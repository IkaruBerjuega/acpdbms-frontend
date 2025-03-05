'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { multiFilter } from '@/lib/utils';

import {
  BtnWithinArchive,
  BtnWithinEdit,
  BtnWithinView,
} from './table-buttons';
import Status from './status';
import { ProjectListResponseInterface } from '@/lib/definitions';
import { useProjectContext } from '@/lib/context/project-context';

export const projectColumns: ColumnDef<ProjectListResponseInterface>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const { itemSelectedRows, setItemSelectedRows } = useProjectContext();
      return (
        <Checkbox
          checked={
            itemSelectedRows.length > 0 &&
            (table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate'))
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const allRowData = table
                .getRowModel()
                .rows.map((row) => row.getValue('id') as string);
              setItemSelectedRows(allRowData);
              console.log('All selected rows:', allRowData);
            } else {
              // If unchecked, clear the empSelectedRows
              setItemSelectedRows([]);
              console.log('No selected rows');
            }
          }}
          aria-label='Select all'
        />
      );
    },
    cell: ({ row }) => {
      const { itemSelectedRows, setItemSelectedRows } = useProjectContext();
      React.useEffect(() => {
        console.log('Real-time updated selected rows:', itemSelectedRows);
      }, [itemSelectedRows]);
      return (
        <Checkbox
          checked={itemSelectedRows.includes(row.getValue('id') as string)}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            // Update empSelectedRows based on selection state
            setItemSelectedRows((prev) => {
              const id = row.getValue('id') as string;
              const updatedEmpSelectedRows = value
                ? [...prev, id]
                : prev.filter(
                    (data) => data !== id // Compare by id
                  );
              return updatedEmpSelectedRows;
            });
          }}
          aria-label='Select row'
        />
      );
    },
    size: 15,
  },
  {
    accessorKey: 'id',
    meta: {
      filter_name: 'Project ID',
      filter_type: 'number',
      column_name: 'project_id',
    },
    header: () => <p>Project ID</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('id')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <p>Project Title</p>;
    },
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('project_title')}</div>
    ),
    filterFn: multiFilter,
    enableHiding: true,
  },
  {
    accessorKey: 'client_name',
    meta: {
      filter_name: 'Client Name',
      filter_type: 'text',
      column_name: 'client_name',
    },
    header: () => <p>Client Name</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('client_name')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'project_title',
    meta: {
      filter_name: 'Project Title',
      filter_type: 'text',
      column_name: 'project_title',
    },
    header: () => <p>Project Title</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('project_title')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'location',
    meta: {
      filter_name: 'Location',
      filter_type: 'text',
      column_name: 'location',
    },
    header: () => <p>Location</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('location')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'start_date',
    meta: {
      filter_name: 'Start Date',
      filter_type: 'date',
      column_name: 'start_date',
    },
    header: () => <p>Start Date</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('start_date')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'end_date',
    meta: {
      filter_name: 'End Date',
      filter_type: 'date',
      column_name: 'end_date',
    },
    header: () => <p>End Date</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('end_date')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'finish_date',
    meta: {
      filter_name: 'Finish Date',
      filter_type: 'date',
      column_name: 'finish_date',
    },
    header: () => <p>Finish Date</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>
        {row.getValue('finish_date') || 'N/A'}
      </div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'status',
    meta: {
      filter_name: 'Project Status',
      filter_type: 'select',
      options: ['ongoing', 'on-hold', 'finished', 'cancelled', 'archived'],
      column_name: 'status',
    },
    header: () => <p>Project Status</p>,
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <div className='flex justify-center w-full'>
          <Status
            statuses={[
              ['finished', 'bg-green-500'],
              ['ongoing', 'bg-yellow-500'],
              ['on-hold', 'bg-gray-500'],
              ['cancelled', 'bg-red-500'],
              ['archived', 'bg-red-200'],
            ]}
            value={status as string}
          />
        </div>
      );
    },
    filterFn: multiFilter,
  },
  {
    accessorKey: 'image_url',
    header: () => <div className='text-xs md:text-sm'>Project Image</div>,
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string | null;
      return imageUrl ? (
        <img
          src={imageUrl}
          alt='Project'
          className='h-10 w-10 object-cover rounded'
        />
      ) : (
        <p className='text-xs text-gray-500'>No Image</p>
      );
    },
    enableHiding: true,
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => 'Actions',
    cell: ({ row }) => {
      const project = row.original;
      const client_name = project.client_name;

      return (
        <div className='w-full justify-center items-center flex gap-2'>
          <BtnWithinView
            label={'View Project'}
            href={`/admin/projects/${client_name}/view?edit=false`}
          />
          <BtnWithinEdit
            label={'Edit Project'}
            href={`/admin/projects/${client_name}/view?edit=true`}
          />
          <BtnWithinArchive label={'Archive Project'} />
        </div>
      );
    },
  },
];
