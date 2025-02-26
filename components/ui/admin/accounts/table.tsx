"use client";

import {
  ClientListResponseInterface,
  ColumnInterfaceProp,
} from "@/lib/definitions";
import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import DataTable from "../../general/data-table-components/data-table";
import { useCallback } from "react";
import { useAccount } from "@/hooks/api-calls/admin/use-account";

export default function Table() {
  const {
    employeeAccounts,
    archivedEmployeeAccounts,
    clientAccounts,
    archivedClientAccounts,
  } = useAccount();

  const { data, isLoading } = clientAccounts;

  let columns: ColumnInterfaceProp[] = [
    {
      id_string: "select",
      filterFn: false,
    },
    {
      accessorKey_string: "id",
      enableHiding: true,
    },
    {
      accessorKey_string: "user_id",
      enableHiding: true,
    },
    {
      accessorKey_string: "full_name",
      header_string: "Full Name",
      meta: {
        filter_name: "Full Name",
        filter_type: "text",
        filter_columnAccessor: "full_name",
      },
      filterFn: true,
    },
    {
      accessorKey_string: "first_name",
      enableHiding: true,
    },
    {
      accessorKey_string: "middle_name",
      enableHiding: true,
    },
    {
      accessorKey_string: "last_name",
      enableHiding: true,
    },
    {
      accessorKey_string: "status",
      header_string: "status",
    },
    {
      accessorKey_string: "email",
      header_string: "Email",
      meta: {
        filter_name: "Email",
        filter_type: "text",
        filter_columnAccessor: "email",
      },
      filterFn: true,
    },
  ];

  const transformedColumns =
    useCreateTableColumns<ClientListResponseInterface>(columns);

  if (isLoading) {
    return <>Loading</>;
  }

  if (!data) {
    return <>No Client Accounts Yet</>;
  }

  return <DataTable columns={transformedColumns} data={data} />;
}
