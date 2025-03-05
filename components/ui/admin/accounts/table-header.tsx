"use client";

import { useCallback } from "react";
import DataTableHeader from "../../general/data-table-components/table-header";
import { usePathname, useRouter } from "next/navigation";
import Tabs from "../../general/tabs";
import { useQueryParams } from "@/hooks/use-query-params";
import { useCheckboxStore } from "@/hooks/states/create-store";
import { AccountsTableType } from "@/lib/definitions";
import { useAccountActions } from "@/hooks/api-calls/admin/use-account";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AddBtn } from "../../button";
import { titleCase } from "@/lib/utils";

export default function AccountsTableHeaderActions<T>() {
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const tabParameter = "role";
  const role = paramsKey[tabParameter] || "employee";
  const isClient = role === "client";
  const tableName = isClient ? "Client" : "Employee";
  const isArchived = paramsKey["archived"] === "true";

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      if (parameter === "role") {
        params.delete("add");
        params.delete("grant_access");
      }

      const newParams = new URLSearchParams(params.toString());
      newParams.set(parameter, value);
      replace(`${pathname}?${newParams.toString()}`);
    },
    [pathname, params, replace]
  );

  const tabItems = [
    {
      item: "employee",
      action: () => createQueryString(tabParameter, "employee"),
    },
    { item: "client", action: () => createQueryString(tabParameter, "client") },
  ];

  // Archive accounts logic
  const { data, resetData } = useCheckboxStore();
  const { archiveAcc } = useAccountActions();
  const { mutate } = archiveAcc;

  return (
    <DataTableHeader
      tableName={tableName}
      onArchive={{
        fn: () => {
          const userIds = data.map(
            (account: AccountsTableType) => account.user_id
          );
          mutate(
            { user_ids: userIds },
            {
              onSuccess: (response: { message: string }) => {
                toast({
                  title: "Archive Accounts",
                  description:
                    response?.message ||
                    "Successfully archived the selected accounts.",
                });

                queryClient.invalidateQueries({
                  queryKey: [
                    isClient
                      ? !isArchived
                        ? "clients"
                        : "clients-archived"
                      : !isArchived
                      ? "employees"
                      : "employees-archived",
                  ],
                });
                resetData();
              },
              onError: (error: { message: string }) => {
                toast({
                  title: "Archive Accounts",
                  description:
                    error?.message ||
                    "An error occurred while processing the request.",
                });
              },
            }
          );
        },
        archiveDialogContent: (
          <div className="flex-col-center-start max-h-[200px] overflow-y-auto">
            {data.map((account: AccountsTableType, index) => (
              <p key={index} className="text-xs">
                - {account.full_name}
              </p>
            ))}
          </div>
        ),
      }}
      onShowArchive={true}
      onGenerateReport={true}
      additionalElement={
        <>
          {!isClient && (
            <AddBtn
              label="Grant Access"
              onClick={() => {
                params.delete("add");
                createQueryString("grant_access", "true");
              }}
              dark={false}
              variant="outline"
            />
          )}
          <AddBtn
            label={`Add ${titleCase(role)}`}
            onClick={() => {
              params.delete("grant_access");
              createQueryString("add", "true");
            }}
            dark={true}
          />
          <Tabs activeTab={role} tabItems={tabItems} />
        </>
      }
    />
  );
}
