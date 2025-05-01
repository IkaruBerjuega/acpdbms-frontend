"use client";

import { useCallback } from "react";
import DataTableHeader from "../../general/data-table-components/table-header";
import { usePathname, useRouter } from "next/navigation";
import Tabs from "../../general/tabs";
import { useCheckboxStore } from "@/hooks/states/create-store";
import { AccountsTableType } from "@/lib/definitions";
import { useAccountActions } from "@/hooks/api-calls/admin/use-account";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AddBtn } from "../../button";
import { titleCase } from "@/lib/utils";
import { useQueryParams } from "@/hooks/use-query-params";
import { BtnGenerateCSVReport } from "../../general/btn-reports";
import { requestAPI } from "@/hooks/tanstack-query";

export default function AccountsTableHeaderActions({
  roleValue,
}: {
  roleValue: "employee" | "client";
}) {
  const { params, paramsKey } = useQueryParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const tabParameter = "role";
  const role = roleValue || "employee";
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

      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
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
  const { archiveAcc } = useAccountActions({ userId: "" });
  const { mutate } = archiveAcc;

  const generateReportConfig = {
    employee: {
      title: isArchived
        ? "Archived Employees Account"
        : "Active Employees Account",
      url: isArchived ? "/employees-archived" : "/employees-list",
    },
    client: {
      title: isArchived ? "Archived Clients Account" : "Active Clients Account",
      url: isArchived ? "/clients-archived" : "/clients-list",
    },
  };

  return (
    <DataTableHeader
      tableName={tableName}
      onArchive={{
        fn: () => {
          const userIds = (data as AccountsTableType[]).map(
            (account) => account.user_id
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
            {(data as AccountsTableType[]).map(
              (account: AccountsTableType, index) => (
                <p key={index} className="text-xs">
                  - {account.full_name}
                </p>
              )
            )}
          </div>
        ),
      }}
      onShowArchive={true}
      onGenerateReportElement={
        <BtnGenerateCSVReport
          onClick={async () => {
            const accounts = await requestAPI({
              url: generateReportConfig[role].url,
              body: null,
              contentType: "application/json",
              auth: true,
              method: "GET",
            });

            return accounts;
          }}
          label={generateReportConfig[role].title}
        />
      }
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
