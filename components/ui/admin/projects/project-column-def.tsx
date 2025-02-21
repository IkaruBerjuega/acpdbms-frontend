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

export interface Project {
  id: number;
  project_title: string;
  client_name: string;
  location: string;
  start_date: string;
  end_date: string;
  project_status: 'finished' | 'on-hold' | 'ongoing' | 'cancelled' | 'archived';
  image_url?: string;
}

export const projectColumns: ColumnDef<Project>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            table.getIsSomePageRowsSelected()
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label='Select all'
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      );
    },
    size: 15,
  },
  {
    accessorKey: 'id',
    header: () => <p>Project ID</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('id')}</div>
    ),
    filterFn: multiFilter,
    enableHiding: true,
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
    accessorKey: 'start_date',
    meta: {
      filter_name: 'Start Date',
      filter_type: 'date',
      column_name: 'start_date',
    },
    header: () => <p>Date Start</p>,
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
    accessorKey: 'project_status',
    meta: {
      filter_name: 'Project Status',
      filter_type: 'select',
      options: ['ongoing', 'on-hold', 'finished', 'cancelled', 'archived'],
      column_name: 'project_status',
    },
    header: () => <p>Project Status</p>,
    cell: ({ row }) => {
      const status = row.getValue('project_status');
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
    cell: () => null,
    enableHiding: true,
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => 'Actions',
    cell: ({ row }) => {
      const project = row.original;
      const id = project.id;

      return (
        <div className='w-full justify-center items-center flex gap-2'>
          <BtnWithinView
            label={'View Project'}
            href={`/admin/projects/${id}/view?edit=false`}
          />
          <BtnWithinEdit
            label={'Edit Project'}
            href={`/admin/projects/${id}/view?edit=true`}
          />
          <BtnWithinArchive label={'Archive Project'} />
        </div>
      );
    },
  },
];
