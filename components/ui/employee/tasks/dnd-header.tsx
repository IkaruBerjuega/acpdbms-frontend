"use client";

import { useCallback } from "react";
import DataTableHeader from "../../general/data-table-components/table-header";
import { usePathname, useRouter } from "next/navigation";
import { useQueryParams } from "@/hooks/use-query-params";
import { useQueryClient } from "@tanstack/react-query";
import { AddBtn, Button } from "../../button";
import Image from "next/image";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import Tabs from "../../general/tabs";

export default function TasksHeaderActions({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const queryClient = useQueryClient();

  const tabValue = paramsKey["view"];
  const activeTab =
    tabValue === "assigned"
      ? "My Tasks"
      : tabValue === "general"
      ? "All Tasks"
      : tabValue === "to review"
      ? "To Review"
      : tabValue === "done"
      ? "Done"
      : null;

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

  const btnPhasesSrc = "/button-svgs/tasks-header-phases.svg";

  //check from project select store if the user is manager, if not, phases and add task/phases button will not be rendered

  const { data: projectSelected } = useProjectSelectStore();

  const projectId = projectSelected[0]?.projectId;
  const role = projectSelected[0]?.userRole;
  const hasVicePermission =
    projectSelected[0]?.hasVicePermission && role === "Vice Manager";

  const hasManagerPermission = role === "Project Manager" || hasVicePermission;

  return (
    <DataTableHeader
      tableName={dndName}
      onGenerateReport={true}
      additionalElement={
        <>
          {hasManagerPermission && (
            <>
              <Button
                variant={"outline"}
                onClick={() => createQueryString("sheet", "phases")}
                className="h-full"
              >
                <Image
                  src={btnPhasesSrc}
                  alt={"phases button image"}
                  width={16}
                  height={16}
                />
                Phases
              </Button>
              <AddBtn
                label="Add Task/Phases"
                href={`/employee/tasks/add?show_phases=true&${
                  "projectId=" + projectId
                } `}
                dark={true}
                className="h-full"
              />
            </>
          )}

          <div className="w-full sm:w-fit flex-row-end">
            <Tabs
              activeTab={activeTab}
              tabItems={
                isEmployee
                  ? [
                      {
                        item: "My Tasks",
                        action: () => {
                          createQueryString("view", "assigned");
                          queryClient.invalidateQueries({
                            queryKey: ["my-tasks", projectId],
                          });
                        },
                      },
                      {
                        item: "All Tasks",
                        action: () => {
                          createQueryString("view", "general");
                          queryClient.invalidateQueries({
                            queryKey: ["tasks", projectId],
                          });
                        },
                      },
                    ]
                  : [
                      {
                        item: "To Review",
                        action: () => {
                          createQueryString("view", "to review");
                        },
                      },
                      {
                        item: "Done",
                        action: () => {
                          createQueryString("view", "done");
                        },
                      },
                    ]
              }
            />
          </div>
        </>
      }
    />
  );
}
