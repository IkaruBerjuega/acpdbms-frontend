"use client";

import { useCallback } from "react";
import DataTableHeader from "../../general/data-table-components/table-header";
import { usePathname, useRouter } from "next/navigation";
import Tabs from "../../general/tabs";
import { Button } from "../../button";
import { VscListSelection } from "react-icons/vsc";
import { LuFilter } from "react-icons/lu";
import { PiCardsThreeLight } from "react-icons/pi";
import { useQueryParams } from "@/hooks/use-query-params";

export default function FileListHeaderActions({
  tab,
}: {
  tab: "row" | "card";
}) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { params } = useQueryParams();

  const tabParameter = "tab";

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

  return (
    <DataTableHeader
      tableName={"Files"}
      onShowArchive={true}
      onGenerateReportElement={<></>}
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
