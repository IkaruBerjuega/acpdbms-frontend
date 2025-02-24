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
import { Project } from '@/lib/definitions';

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
    accessorKey: 'client_id',
    meta: {
      filter_name: 'Client ID',
      filter_type: 'number',
      column_name: 'client_id',
    },
    header: () => <p>Client ID</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('client_id')}</div>
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
    accessorKey: 'street',
    meta: {
      filter_name: 'Street',
      filter_type: 'text',
      column_name: 'street',
    },
    header: () => <p>Street</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('street')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'city_town',
    meta: {
      filter_name: 'City/Town',
      filter_type: 'text',
      column_name: 'city_town',
    },
    header: () => <p>City/Town</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('city_town')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'state',
    meta: {
      filter_name: 'State',
      filter_type: 'text',
      column_name: 'state',
    },
    header: () => <p>State</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('state')}</div>
    ),
    filterFn: multiFilter,
  },
  {
    accessorKey: 'zip_code',
    meta: {
      filter_name: 'Zip Code',
      filter_type: 'text',
      column_name: 'zip_code',
    },
    header: () => <p>Zip Code</p>,
    cell: ({ row }) => (
      <div className='text-xs md:text-sm'>{row.getValue('zip_code')}</div>
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
              ['finished', 'bg-green'],
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
      const client_id = project.client_id;

      return (
        <div className='w-full justify-center items-center flex gap-2'>
          <BtnWithinView
            label={'View Project'}
            href={`/admin/projects/${client_id}/view?edit=false`}
          />
          <BtnWithinEdit
            label={'Edit Project'}
            href={`/admin/projects/${client_id}/view?edit=true`}
          />
          <BtnWithinArchive label={'Archive Project'} />
        </div>
      );
    },
  },
];
