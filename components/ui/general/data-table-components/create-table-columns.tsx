import {
  CheckboxData,
  ColumnInterface,
  ColumnInterfaceProp,
} from "@/lib/definitions";
import { multiFilter } from "@/lib/utils";
import { CellContext, ColumnDef, Row, Table } from "@tanstack/react-table";
import { Checkbox } from "../../checkbox";
import { useCheckboxStore } from "@/hooks/states/create-store";

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
          setData(allRowData as CheckboxData[]);
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
        (rowStored) => rowStored.id === (row.original as CheckboxData).id
      )}
      onCheckedChange={(value) => {
        row.toggleSelected(!!value);
        setData((rowStored) =>
          value
            ? [...rowStored, rowData as CheckboxData]
            : rowStored.filter(
                (data) => data.id !== (row.original as CheckboxData).id
              )
        );
      }}
      aria-label="Select row"
    />
  );
};

export const useCreateTableColumns = <T,>(columns: ColumnInterfaceProp[]) => {
  return columns.map((column) => {
    let isSelect = column.id_string === "select";
    let enableHiding = column.enableHiding;
    let isAction = column.id_string === "action";

    const generatedColumn: ColumnDef<T> = {
      id: column.id_string || column.accessorKey_string,
      accessorKey: (column.accessorKey_string ?? "unknown_key") as
        | keyof T
        | string,
      header: isSelect
        ? ({ table }) => (
            <div className="">
              <SelectAllCheckbox table={table} />
            </div>
          )
        : !enableHiding
        ? () => <p>{column.header_string}</p>
        : () => <></>, // instead of `null`
      ...(column.meta && { meta: column.meta }),
      cell: isSelect
        ? ({ row }) => (
            <div className="">
              <RowCheckbox row={row} rowData={row.original} />
            </div>
          )
        : !enableHiding
        ? ({ row }: CellContext<T, unknown>) => (
            <div>{row.getValue(column.accessorKey_string as string)}</div>
          )
        : () => <></>, // instead of `null`
      ...(column.filterFn && { filterFn: multiFilter }),
    };

    return generatedColumn;
  });
};
