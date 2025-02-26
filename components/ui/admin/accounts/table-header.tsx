"use client";

import { useCallback, useState } from "react";
import DataTableHeader from "../../general/data-table-components/table-header";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Tabs from "../../general/tabs";

export default function AccountsTableHeaderActions() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const parameter = "role";

  const params = new URLSearchParams(searchParams);

  const [role, setRole] = useState<string | null>(params?.get(parameter));

  //functions for account data table header
  let isClient = role === "client";
  let tableName = isClient ? "Client" : "Employee";

  const createQueryString = useCallback(
    (value: string) => {
      params.set(parameter, value);

      const newUrl = `${pathname}?${params.toString()}`; //  Assignment before use
      replace(newUrl);
      setRole(value); //set new role, this is for the activeTab prop
    },
    [searchParams]
  );

  const tabItems = [
    {
      item: "employee",
      action: () => {
        createQueryString("employee");
      },
    },
    {
      item: "client",
      action: () => {
        createQueryString("client");
      },
    },
  ];

  return (
    <DataTableHeader
      tableName={tableName}
      onArchive={() => {}}
      onShowArchive={() => {}}
      onGenerateReport={() => {}}
      additionalElement={<Tabs activeTab={role} tabItems={tabItems} />}
    />
  );
}
