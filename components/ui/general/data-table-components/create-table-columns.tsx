"use client";

import {
  SupportedTableTypes,
  ColumnInterfaceProp,
  SupportedTableName,
  AccountsTableType,
  ProjectListResponseInterface,
} from "@/lib/definitions";
import { multiFilter } from "@/lib/utils";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Checkbox } from "../../checkbox";
import { useCheckboxStore } from "@/hooks/states/create-store";
import React from "react";
import AccountActions from "../../admin/accounts/table-actions";
import ProjectActions from "../../admin/projects/table-actions";

interface TableActionsInterface<T extends SupportedTableTypes> {
  tableName: SupportedTableName;
  attrs: T;
}

const TableActions = <T extends SupportedTableTypes>({
  tableName,
  attrs,
}: TableActionsInterface<T>): JSX.Element => {
  if (tableName === "Accounts") {
    return (
      <AccountActions<AccountsTableType> attrs={attrs as AccountsTableType} />
    );
  }

  if (tableName === "Projects") {
    return (
      <ProjectActions<ProjectListResponseInterface>
        attrs={attrs as ProjectListResponseInterface}
      />
    );
  }
  return <div>There is no table {tableName}</div>;
};

export default TableActions;

interface SelectAllCheckboxProps<T> {
  table: Table<T>; // Adjust type as needed
}

const SelectAllCheckbox = <T,>({ table }: SelectAllCheckboxProps<T>) => {
  const { data, setData, resetData } = useCheckboxStore();
  return (
    <Checkbox
      checked={
        data.length > 0 &&
        (table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"))
      }
      onCheckedChange={(value) => {
        table.toggleAllPageRowsSelected(!!value);
        if (value) {
          const allRowData: T[] =
            table
              .getRowModel()
              .rows.filter((row) => row.id !== "select" && row.id !== "actions")
              .map((row) => row.original as T) || [];
          setData(allRowData as SupportedTableTypes[]);
        } else {
          resetData();
        }
      }}
      aria-label="Select all"
    />
  );
};

interface RowCheckboxProps<T> {
  row: Row<T>;
  rowData: T;
}

const RowCheckbox = <T,>({ row, rowData }: RowCheckboxProps<T>) => {
  const { data, setData } = useCheckboxStore();
  return (
    <Checkbox
      checked={data.some(
        (rowStored) => rowStored.id === (row.original as SupportedTableTypes).id
      )}
      onCheckedChange={(value) => {
        row.toggleSelected(!!value);
        setData((rowStored) =>
          value
            ? [...rowStored, rowData as SupportedTableTypes]
            : rowStored.filter(
                (data) => data.id !== (row.original as SupportedTableTypes).id
              )
        );
      }}
      aria-label="Select row"
    />
  );
};

const getStatusColor = (status: string) => {
  const green = "bg-green-200 text-green-700";
  const lightGray = "bg-gray-200 text-gray-700";
  const dark = "bg-black-secondary text-white-secondary";
  const yellow = "bg-yellow-200 text-yellow-700";
  const red = "bg-red-200 text-red-700";

  const colorMap: Record<string, string> = {
    //account statuses
    activated: green,
    deactivated: lightGray,
    archived: dark,

    //project statuses
    finished: green,
    ongoing: yellow,
    cancelled: red,
    paused: lightGray,
  };

  return colorMap[status] || "bg-gray-200 text-gray-700";
};

export const useCreateTableColumns = <T,>(
  columns: ColumnInterfaceProp[],
  tableName: SupportedTableName
) => {
  return columns.map((column) => {
    const isSelect = column.id === "select";
    const isActions = column.id == "actions";
    const enableHiding = column.enableHiding;
    const isStatus = column.accessorKey === "status";

    const generatedColumn: ColumnDef<T> = {
      id: column.id || column.accessorKey,
      accessorKey: column.accessorKey as keyof T | string,
      header: (() => {
        if (isSelect) {
          return ({ table }) => (
            <div>
              <SelectAllCheckbox table={table} />
            </div>
          );
        }

        if (!enableHiding) {
          return () => <p>{column.header}</p>;
        }

        return () => <></>;
      })(),
      ...(column.meta && { meta: column.meta }),
      cell: !enableHiding
        ? ({ row }) => {
            if (isSelect) {
              return (
                <div>
                  <RowCheckbox row={row} rowData={row.original} />
                </div>
              );
            }
            const value: string = column.accessorKey
              ? row.getValue(column.accessorKey)
              : column.id
              ? row.getValue(column.id)
              : "N/A";

            if (isStatus) {
              return (
                <div
                  className={`${getStatusColor(
                    value
                  )} py-1 px-2 text-xs rounded-md `}
                >
                  {value}
                </div>
              );
            }

            const rowData = row.original as SupportedTableTypes;

            if (isActions) {
              return (
                <div className="w-full h-full flex-row-end-center px-2 space-x-1">
                  <TableActions tableName={tableName} attrs={rowData} />
                </div>
              );
            }

            return <div>{value || "N/A"}</div>;
          }
        : undefined,

      ...(column.filterFn && { filterFn: multiFilter<T> }),
    };

    return generatedColumn;
  });
};
