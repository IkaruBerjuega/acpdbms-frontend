"use client";

import { useCallback } from "react";
import DataTableHeader from "../../general/data-table-components/table-header";
import { usePathname, useRouter } from "next/navigation";
import { useQueryParams } from "@/hooks/use-query-params";
import { useQueryClient } from "@tanstack/react-query";
import { AddBtn, Button } from "../../button";

export default function TasksHeaderActions() {
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const isArchived = paramsKey["archived"] === "true";

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  //dnd name
  const dndName = "Tasks";

  return (
    <DataTableHeader
      tableName={dndName}
      onGenerateReport={true}
      additionalElement={
        <>
          <Button
            variant={"outline"}
            onClick={() => createQueryString("sheet", "phases")}
          >
            Phases
          </Button>
          <AddBtn
            label="Add Task"
            href="/employee/tasks/add?show_phases=true"
            dark={true}
          />
        </>
      }
    />
  );
}
