"use client";

import {
  AccountsTableType,
  ColumnInterfaceProp,
  SupportedTableName,
} from "@/lib/definitions";
import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import DataTable from "../../general/data-table-components/data-table";
import { useAccounts } from "@/hooks/api-calls/admin/use-account";

export default function Table<T extends AccountsTableType>({
  initialData,
  role,
  isArchived,
}: {
  initialData: T[];
  role: "employee" | "client";
  isArchived: boolean;
}) {
  const accountStatuses = ["activated", "deactivated", "archived"];
  const hasOngoinTasksOptions = ["true", "false"];

  const employeeColumns: ColumnInterfaceProp[] = [
    {
      id: "select",
      filterFn: false,
    },
    {
      accessorKey: "id",
      enableHiding: true,
    },
    {
      accessorKey: "user_id",
      enableHiding: true,
    },
    {
      accessorKey: "full_name",
      header: "Full Name",
      meta: {
        filter_name: "Full Name",
        filter_type: "text",
        filter_columnAccessor: "full_name",
      },
      filterFn: true,
    },
    {
      accessorKey: "position",
      header: "Position",
      meta: {
        filter_name: "Position",
        filter_type: "text",
        filter_columnAccessor: "position",
      },
      filterFn: true,
    },
    {
      accessorKey: "first_name",
      enableHiding: true,
    },
    {
      accessorKey: "middle_name",
      enableHiding: true,
    },
    {
      accessorKey: "last_name",
      enableHiding: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: {
        filter_name: "Email",
        filter_type: "text",
        filter_columnAccessor: "email",
      },
      filterFn: true,
    },
    ...(!isArchived
      ? [
          {
            accessorKey: "has_ongoing_task",
            header: "Has Ongoing Tasks",
            meta: {
              filter_name: "Has Ongoing Task",
              filter_type: "select" as const,
              filter_options: hasOngoinTasksOptions,
              filter_columnAccessor: "status",
            },
            filterFn: true,
          },
        ]
      : []),

    {
      accessorKey: "status",
      header: "Status",
      meta: {
        filter_name: "Status",
        filter_type: "select",
        filter_options: accountStatuses,
        filter_columnAccessor: "status",
      },
      filterFn: true,
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  const clientColumns: ColumnInterfaceProp[] = [
    {
      id: "select",
      filterFn: false,
    },
    {
      accessorKey: "id",
      enableHiding: true,
    },
    {
      accessorKey: "user_id",
      enableHiding: true,
    },
    {
      accessorKey: "full_name",
      header: "Full Name",
      meta: {
        filter_name: "Full Name",
        filter_type: "text",
        filter_columnAccessor: "full_name",
      },
      filterFn: true,
    },
    {
      accessorKey: "first_name",
      enableHiding: true,
    },
    {
      accessorKey: "middle_name",
      enableHiding: true,
    },
    {
      accessorKey: "last_name",
      enableHiding: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: {
        filter_name: "Email",
        filter_type: "text",
        filter_columnAccessor: "email",
      },
      filterFn: true,
    },

    {
      accessorKey: "status",
      header: "Status",
      meta: {
        filter_name: "Status",
        filter_type: "select",
        filter_options: accountStatuses,
        filter_columnAccessor: "status",
      },
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  //dynamically set columns based on role
  const columns = role === "employee" ? employeeColumns : clientColumns;
  const tableName: SupportedTableName = "Accounts";

  const transformedColumns = useCreateTableColumns<T>(columns, tableName);

  //dynamically set useAccounts hook argument to
  const { data, isPending } = useAccounts<T>({
    role: role,
    isArchived: isArchived,
    initialData: initialData,
  });

  if (!role) return <>Please select a role</>;

  if (isPending) {
    return <>Loading...</>;
  }

  if (!data || data.length === 0) {
    return (
      <>
        No {isArchived && "Archived "}
        {role === "employee" ? "Employee" : "Client"} Accounts Yet
      </>
    );
  }

  return <DataTable columns={transformedColumns} data={data} />;
}
