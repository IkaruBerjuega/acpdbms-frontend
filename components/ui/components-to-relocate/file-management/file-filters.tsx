"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useQueryParams } from "@/hooks/use-query-params";
import { useQueryClient } from "@tanstack/react-query";
import { FilesPageProps } from "@/lib/files-definitions";
import { useCallback } from "react";
import { Combobox } from "../../combobox";
import { useProjectList } from "@/hooks/general/use-project";
import { ItemInterface } from "@/lib/filter-types";

interface FileFiltersProps extends FilesPageProps {
  phases: ItemInterface[] | undefined;
  tasks: ItemInterface[] | undefined;
  taskVersionItems: ItemInterface[] | undefined;
  isAdmin: boolean;
}

export default function FileFilters({
  phases,
  tasks,
  taskVersionItems,
  projectId,
  phaseId,
  taskId,
  taskVersionId,
  isAdmin,
}: FileFiltersProps) {
  const { params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  //project filter items/options
  const { data: projects } = useProjectList({ isArchived: false });
  const projectItems = projects?.map((project) => {
    return { value: project.id, label: project.project_title };
  });

  const removeFilter = useCallback(
    (filter: "projectId" | "phaseId" | "taskId" | "taskVersionId") => {
      if (filter === "projectId") {
        params.delete("projectId");
      }

      if (filter === "phaseId" || filter === "projectId") {
        params.delete("phaseId");
      }

      if (
        filter === "taskId" ||
        filter === "phaseId" ||
        filter === "projectId"
      ) {
        params.delete("taskId");
      }

      if (
        filter === "taskVersionId" ||
        filter === "taskId" ||
        filter === "phaseId" ||
        filter === "projectId"
      ) {
        params.delete("taskVersionId");
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (
      parameter: "projectId" | "phaseId" | "taskId" | "taskVersionId",
      value: string
    ) => {
      removeFilter(parameter);
      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  return (
    <div className={cn("w-full h-full space-y-4 py-4")}>
      {isAdmin && (
        <div className="flex-col-start gap-1">
          <p className="text-xs text-slate-500 font-semibold">Project</p>
          <Combobox
            placeholder={"Select Project"}
            emptyMessage={"No Available Projects"}
            items={projectItems}
            onSelect={(item) =>
              createQueryString("projectId", item.value + "_" + item.label)
            }
            value={projectId?.split("_")[1] ?? ""}
            clearFn={() => removeFilter("projectId")}
          />
        </div>
      )}

      <div className="flex-col-start gap-1">
        <p className="text-xs text-slate-500 font-semibold">Phase</p>
        <Combobox
          placeholder={"Select Phase"}
          emptyMessage={"No Available Phase"}
          items={phases}
          onSelect={(item) =>
            createQueryString("phaseId", item.value + "_" + item.label)
          }
          value={phaseId?.split("_")[1] ?? ""}
          clearFn={() => removeFilter("phaseId")}
        />
      </div>
      <div className="flex-col-start gap-1">
        <p className="text-xs text-slate-500 font-semibold">Task</p>
        <Combobox
          placeholder={"Select Task"}
          emptyMessage={"No Available Task"}
          items={tasks}
          onSelect={(item) =>
            createQueryString("taskId", item.value + "_" + item.label)
          }
          value={taskId?.split("_")[1] ?? ""}
          clearFn={() => removeFilter("taskId")}
        />
      </div>

      <div className="flex-col-start gap-1">
        <p className="text-xs text-slate-500 font-semibold">Version</p>
        <Combobox
          placeholder={"Select Task Version"}
          emptyMessage={"No Available Task Version"}
          items={taskVersionItems}
          onSelect={(item) =>
            createQueryString("taskVersionId", item.value + "_" + item.label)
          }
          value={taskVersionId?.split("_")[1] ?? ""}
          clearFn={() => removeFilter("taskVersionId")}
        />
      </div>
    </div>
  );
}
