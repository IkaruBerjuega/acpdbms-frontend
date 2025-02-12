"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "@tanstack/react-table";
import FilterUi from "./filter-components/filter-cards";
import { FilterType } from "@/lib/types";

export const useCustomTable = (
  query: any,
  data: any[],
  columns: any[],
  pageSize?: number,
  searchParams?: URLSearchParams // new parameter
) => {
  const columnsToExclude = {
    image_url: false,
    employee_id: false,
    client_id: false,
    username: false,
    id: false,
    supplier_id: false,
    user_id: false,
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
    getSubRows: (row) => row.items || [],
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
  });

  // Debug to confirm rows are populated initially
  useEffect(() => {
    console.log("Initial row data in table:", table.getRowModel().rows);
  }, [table]);

  const columnsWithFilters = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    );

  const filters: FilterType[] = columnsWithFilters
    .filter((column) => column.columnDef.meta)
    .map((column) => {
      const meta = column.columnDef.meta as {
        filter_name: string;
        filter_type?: string;
        options?: string[];
        column_name?: string;
      };
      return {
        name: meta.filter_name,
        type: meta.filter_type || "text",
        options: meta.options || [],
        columnAccessor: meta.column_name || "",
      };
    });

  // Memoized filter components
  const newFilterComponents = useMemo(() => {
    const components: JSX.Element[] = [];
    const newFilters: ColumnFiltersState = [];

    searchParams?.forEach((paramValue, paramName) => {
      const column = columns.find(
        (col: { accessorKey: string; id: string }) =>
          ("accessorKey" in col && col.accessorKey === paramName) ||
          col.id === paramName
      );

      if (column) {
        const existingFilter = newFilters.find((f) => f.id === paramName);
        if (existingFilter) {
          existingFilter.value = Array.isArray(existingFilter.value)
            ? [...existingFilter.value, paramValue]
            : [existingFilter.value, paramValue];
        } else {
          newFilters.push({ id: paramName, value: [paramValue] });
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

    setColumnFilters(newFilters);
    return components;
  }, [searchParams, columns]);

  useEffect(() => {
    setFilterComponents(newFilterComponents);
  }, [newFilterComponents]);

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
