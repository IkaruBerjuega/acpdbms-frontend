"use client";

import { useEffect, useState, useMemo, useLayoutEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
  ExpandedState,
  ColumnDef,
} from "@tanstack/react-table";
import FilterUi from "./filter-components/filter-cards";
import { FilterType } from "@/lib/filter-types";

export const useCustomTable = <T,>(
  query: string,
  data: T[],
  columns: ColumnDef<T>[],
  pageSize: number = 10,
  searchParams?: URLSearchParams
) => {
  const columnsToExclude = {
    image_url: false,
    employee_id: false,
    client_id: false,
    username: false,
    id: false,
    supplier_id: false,
    user_id: false,
    first_name: false,
    middle_name: false,
    last_name: false,
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(columnsToExclude);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize || 10,
  });
  const [filterComponents, setFilterComponents] = useState<JSX.Element[]>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter: query,

      expanded,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getSubRows: (row: T) => (row as { items?: T[] }).items || [],
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    autoResetPageIndex: false,
  });

  const columnsWithFilters = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    );

  const filters: FilterType[] = columnsWithFilters
    .filter((column) => column.columnDef.meta)
    .map((column) => {
      const meta = column.columnDef.meta as FilterType;
      return {
        filter_name: meta.filter_name,
        filter_type: meta.filter_type || "text",
        filter_options: meta.filter_options || [],
        filter_columnAccessor: meta.filter_columnAccessor || "",
      };
    });

  // Memoized filter components
  const newFilters = useMemo(() => {
    const filters: ColumnFiltersState = [];
    const components: JSX.Element[] = [];

    searchParams?.forEach((paramValue, paramName) => {
      const column = columns.find(
        (col) =>
          ("accessorKey" in col && col.accessorKey === paramName) ||
          ("id" in col && col.id === paramName)
      );

      if (column) {
        const existingFilter = filters.find((f) => f.id === paramName);
        if (existingFilter) {
          existingFilter.value = Array.isArray(existingFilter.value)
            ? [...existingFilter.value, paramValue]
            : [existingFilter.value, paramValue];
        } else {
          filters.push({ id: paramName, value: [paramValue] });
        }

        if (paramName !== "tab") {
          components.push(
            <FilterUi
              key={`${paramName}-${paramValue}`}
              columnName={paramName}
              value={paramValue}
            />
          );
        }
      }
    });

    return { filters, components };
  }, [searchParams, columns]);

  // Update state inside `useEffect()` instead of `useMemo()`
  useEffect(() => {
    setColumnFilters(newFilters.filters);
    setFilterComponents(newFilters.components);
  }, [newFilters]);

  return {
    table,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    pagination,
    expanded,
    filters,
    filterComponents,
  };
};
