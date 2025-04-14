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
import { AddBtn, Button } from "../../button";
import { titleCase } from "@/lib/utils";
import { PiCardsThreeLight } from "react-icons/pi";
import { VscListSelection } from "react-icons/vsc";
import { LuFilter } from "react-icons/lu";
import { File } from "@/lib/files-definitions";

export default function FileListHeaderActions() {
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const tabParameter = "tab";
  const role = paramsKey[tabParameter] || "employee";
  const isClient = role === "client";
  const tableName = isClient ? "Client" : "Employee";
  const isArchived = paramsKey["archived"] === "true";

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  const tabItems = [
    {
      item: "row",
      element: <VscListSelection className="h-5 w-5 text-gray-500 " />,
      action: () => createQueryString(tabParameter, "row"),
    },
    {
      item: "card",
      element: <PiCardsThreeLight className="h-5 w-5 text-gray-500" />,
      action: () => createQueryString(tabParameter, "card"),
    },
  ];

  // Archive accounts logic
  const { data, resetData } = useCheckboxStore();
  const { archiveAcc } = useAccountActions();
  const { mutate } = archiveAcc;

  return (
    <DataTableHeader
      tableName={"Files"}
      onArchive={{
        fn: () => {
          const userIds = (data as File[]).map((file) => file.id);
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
      onGenerateReport={true}
      additionalElement={
        <>
          <Button
            className="h-full "
            variant={"outline"}
            onClick={() => createQueryString("filters", "true")}
          >
            <LuFilter className="text-xs md:text-lg" /> Filters
          </Button>
          <Tabs activeTab={role} tabItems={tabItems} />
        </>
      }
    />
  );
}
