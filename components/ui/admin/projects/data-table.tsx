'use client';

import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import * as React from 'react';
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  flexRender,
  ExpandedState,
  Column,
} from '@tanstack/react-table';

import { Button, ButtonLink } from '@/components/ui/button';
import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import FilterPopOver from './filter-popover';
import { LuFilter } from 'react-icons/lu';
import { FilterType } from '../lib/filter-interface';
import FilterUi from './filter-ui';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import { TiPin } from 'react-icons/ti';
import { FaArrowUpLong } from 'react-icons/fa6';
import { IoArrowUpOutline } from 'react-icons/io5';
import { useCustomTable } from './custom-tanstack';

export default function DataTable({
  query,
  columns,
  data,
}: {
  query: string;
  columns: ColumnDef<any, any>[];
  data: any[];
}) {
  const { table, filterComponents, filters, pagination } = useCustomTable(
    query,
    data,
    columns
  );

  return (
    <div className='flex w-full flex-col '>
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
          {filterComponents} {/* Render FilterUi components */}
        </div>
      </div>
      <div className='rounded-md border'>
        <TableRoot className='w-full table-auto'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='text-sm'
              >
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${header.getSize()}px`,
                        height: 15,
                        // ...getCommonPinningStyles(column),
                      }}
                      className='py-1 '
                    >
                      <div
                        className={`flex flex-row border-r-[1px] ${
                          column.getIsPinned() === 'right' &&
                          'border-l-[1px] border-r-0 '
                        }gap-1 items-center px-2 ${
                          header.id === 'select'
                            ? 'justify-center'
                            : 'justify-between  '
                        }`}
                      >
                        <div className='text-xs md:text-sm'>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>{' '}
                        {!header.isPlaceholder &&
                          header.column.getCanPin() &&
                          header.id != 'select' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  className='p-0'
                                >
                                  <PiDotsThreeVerticalBold className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side='bottom'
                                align='end'
                                sideOffset={8}
                                className='text-xs md:text-sm'
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    column.toggleSorting(
                                      column.getIsSorted() === 'asc'
                                    )
                                  }
                                  className='text-xs md:text-sm'
                                >
                                  {column.getIsSorted() ? (
                                    column.getIsSorted() === 'desc' ? (
                                      <>
                                        Sort ascending{' '}
                                        <IoArrowUpOutline className='ml-5 text-lg text-maroon-600' />
                                      </>
                                    ) : (
                                      <>
                                        Sort descending
                                        <IoArrowUpOutline className='ml-5 text-lg rotate-180 text-maroon-600' />
                                      </>
                                    )
                                  ) : (
                                    <>
                                      Sort ascending{' '}
                                      <IoArrowUpOutline className='ml-5 text-lg text-maroon-600' />
                                    </>
                                  )}
                                </DropdownMenuItem>
                                {column.getIsSorted() && (
                                  <DropdownMenuItem
                                    onClick={() => column.clearSorting()}
                                    className='text-xs md:text-sm'
                                  >
                                    Unsort
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                {header.column.getIsPinned() !== 'left' ? (
                                  <DropdownMenuItem
                                    className='rounded p-2 flex text-xs md:text-sm  justify-between'
                                    onClick={() => {
                                      header.column.pin('left');
                                    }}
                                  >
                                    Pin to the left
                                    <TiPin className='ml-4 text-xl text-maroon-600' />
                                  </DropdownMenuItem>
                                ) : null}
                                {header.column.getIsPinned() ? (
                                  <DropdownMenuItem
                                    className='rounded text-xs md:text-sm px-2'
                                    onClick={() => {
                                      header.column.pin(false);
                                    }}
                                  >
                                    Unpin
                                  </DropdownMenuItem>
                                ) : null}
                                {header.column.getIsPinned() !== 'right' ? (
                                  <DropdownMenuItem
                                    className='rounded px-2 flex text-xs md:text-sm justify-between'
                                    onClick={() => {
                                      header.column.pin('right');
                                    }}
                                  >
                                    Pin to the right
                                    <TiPin className=' ml-4  -rotate-90 text-xl text-maroon-600' />
                                  </DropdownMenuItem>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
            {}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        height: 15,
                        padding: 8,
                      }}
                      // className={`${
                      //   cell.column.id === "select" && "border-x-[1px]"
                      // }`}
                    >
                      <div
                        className={`flex w-full items-center   ${
                          cell.column.id === 'select'
                            ? 'justify-center'
                            : 'justify-start'
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableRoot>
      </div>
      <div className='flex items-center flex-col md:flex-row h-auto gap-3 mt-2'>
        <div className='flex justify-between flex-grow w-full'>
          <div className='flex text-xs md:text-sm flex-row gap-1 justify-start w-full'>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex text-xs md:text-sm flex-row gap-1 justify-end w-full'>
            <p>Page</p>
            <div>
              <strong>
                {pagination.pageIndex + 1} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </div>
          </div>
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
    </div>
  );
}
