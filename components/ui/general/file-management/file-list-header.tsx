"use client";

import { useCallback } from "react";
import DataTableHeader from "../../general/data-table-components/table-header";
import { usePathname, useRouter } from "next/navigation";
import Tabs from "../../general/tabs";
import { Button } from "../../button";
import { VscListSelection } from "react-icons/vsc";
import { LuFilter } from "react-icons/lu";
import { PiCardsThreeLight } from "react-icons/pi";

export default function FileListHeaderActions({
  tab,
}: {
  tab: "row" | "card";
}) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const tabParameter = "tab";

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      const params = new URLSearchParams();
      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace]
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

  return (
    <DataTableHeader
      tableName={"Files"}
      onArchive={{
        fn: () => {
          // const userIds = (data as File[]).map((file) => file.file_id);
          // mutate(
          //   { user_ids: userIds },
          //   {
          //     onSuccess: (response: { message: string }) => {
          //       toast({
          //         title: "Archive Accounts",
          //         description:
          //           response?.message ||
          //           "Successfully archived the selected accounts.",
          //       });
          //       queryClient.invalidateQueries({
          //         queryKey: [
          //           isClient
          //             ? !isArchived
          //               ? "clients"
          //               : "clients-archived"
          //             : !isArchived
          //             ? "employees"
          //             : "employees-archived",
          //         ],
          //       });
          //       resetData();
          //     },
          //     onError: (error: { message: string }) => {
          //       toast({
          //         title: "Archive Accounts",
          //         description:
          //           error?.message ||
          //           "An error occurred while processing the request.",
          //       });
          //     },
          //   }
          // );
        },
        archiveDialogContent: (
          <div className="flex-col-center-start max-h-[200px] overflow-y-auto">
            {/* {(data as AccountsTableType[]).map(
              (account: AccountsTableType, index) => (
                <p key={index} className="text-xs">
                  - {account.full_name}
                </p>
              )
            )} */}
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
          <Tabs activeTab={tab} tabItems={tabItems} />
        </>
      }
    />
  );
}
