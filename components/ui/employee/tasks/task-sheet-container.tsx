"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import ReusableSheet from "../../general/sheet-component";
import { PhasesActive, PhasesArchived } from "./phases-actions";
import TaskComments from "./task-comments";
import TaskFiles from "../../general/tasks/task-files";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Members from "./task-details/task-members-view";
import AssignMembers from "./task-details/task-members-add";
import { useQueryClient } from "@tanstack/react-query";
import { TaskFilters } from "./tasks-dnd-filters";
import UpdateTaskForm from "../../general/tasks/update-task";

interface TaskSheetContainerProps {
  sheetParamValue:
    | "files"
    | "comments"
    | "phases"
    | "phases_archived"
    | "members"
    | "assign_members"
    | "update_task"
    | undefined;
  taskId: string | undefined;
  version: string;
  projectId: string;
}

export default function TaskSheetContainer({
  sheetParamValue,
  taskId,
  version,
  projectId,
}: TaskSheetContainerProps) {
  const { params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Function to update query parameters
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      const newParams = new URLSearchParams(params);
      newParams.set(parameter, value);
      replace(`${pathname}?${newParams.toString()}`);
    },
    [pathname, replace, params]
  );

  const queryClient = useQueryClient();

  const closeDrawerAdditionalFn = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
  }, [projectId, queryClient]);

  const archivedPhases = sheetParamValue === "phases_archived";
  const viewPhases = sheetParamValue === "phases";
  const viewMembers = sheetParamValue === "members";
  const assignMembers = sheetParamValue === "assign_members";

  const isInPhase = archivedPhases || viewPhases;
  const isInMembers = viewMembers || assignMembers;

  const activeTab = archivedPhases
    ? "Archived Phases"
    : viewPhases
    ? "Phases"
    : viewMembers
    ? "Members"
    : assignMembers
    ? "Assign Members"
    : null;

  const tabs = useMemo(() => {
    if (!activeTab) return null;

    if (isInPhase) {
      return {
        activeTab,
        tabItems: [
          {
            item: "Phases",
            action: () => createQueryString("sheet", "phases"),
          },
          {
            item: "Archived Phases",
            action: () => createQueryString("sheet", "phases_archived"),
          },
        ],
      };
    }

    if (isInMembers) {
      return {
        activeTab,
        tabItems: [
          {
            item: "Members",
            action: () => {
              createQueryString("sheet", "members");
            },
          },
          {
            item: "Assign Members",
            action: () => {
              createQueryString("sheet", "assign_members");
            },
          },
        ],
      };
    }

    return null;
  }, [activeTab, createQueryString, isInMembers, isInPhase]);

  const config = {
    comments: {
      title: "Comments",
      desc: "Comments made by team members are displayed here",
      content: <TaskComments taskId={taskId} projectId={projectId} />,
    },
    files: {
      title: "Files",
      desc: "See attached files or attach a file",
      content: (
        <TaskFiles
          taskId={taskId}
          version={version}
          role={"manager"}
          projectId={projectId}
          reviewMode={false}
        />
      ),
    },
    phases: {
      title: "Phases",
      desc: "Finish, Cancel, Archive Phases",
      content: <PhasesActive projectId={projectId} />,
    },
    phases_archived: {
      title: "Phases",
      desc: "Finish, Cancel, Archive Phases",
      content: <PhasesArchived projectId={projectId} />,
    },
    members: {
      title: "Members",
      desc: "List of members assigned in this task",
      content: <Members taskId={taskId} projectId={projectId} />,
    },
    assign_members: {
      title: "Members",
      desc: "List of members assigned in this task",
      content: <AssignMembers taskId={taskId} projectId={projectId} />,
    },
    filters: {
      title: "Filters",
      desc: "Task Filters are set here",
      content: <TaskFilters />,
    },
    update_task: {
      title: "Update Task",
      desc: "Update Task Details here",
      content: <UpdateTaskForm projectId={projectId} taskId={taskId} />,
    },
  };

  if (!sheetParamValue) return null;

  return (
    <ReusableSheet
      title={config[sheetParamValue].title}
      description={config[sheetParamValue].desc}
      content={config[sheetParamValue].content}
      paramKey="sheet"
      paramsKeyToDelete={["sheet", "taskId", "version"]}
      toCompare={sheetParamValue}
      tabs={tabs}
      closeDrawerAdditionalFn={closeDrawerAdditionalFn}
    />
  );
}
