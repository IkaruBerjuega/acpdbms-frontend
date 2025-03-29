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
import { useProjectSelectStore } from "@/hooks/states/create-store";

interface TaskSheetContainerProps {
  sheetParamValue:
    | "files"
    | "comments"
    | "phases"
    | "phases_archived"
    | "members"
    | "assign_members"
    | undefined;
  taskId: string | undefined;
  version: string | undefined;
}

const config = {
  comments: {
    title: "Comments",
    desc: "Comments made by team members are displayed here",
    content: ({ taskId }: { taskId?: string }) => (
      <TaskComments taskId={taskId} />
    ),
  },
  files: {
    title: "Files",
    desc: "See attached files or attach a file",
    content: ({ taskId, version }: { taskId?: string; version?: string }) => (
      <TaskFiles taskId={taskId} version={version} role={"manager"} />
    ),
  },
  phases: {
    title: "Phases",
    desc: "Finish, Cancel, Archive Phases",
    content: () => <PhasesActive />,
  },
  phases_archived: {
    title: "Phases",
    desc: "Finish, Cancel, Archive Phases",
    content: () => <PhasesArchived />,
  },
  members: {
    title: "Members",
    desc: "List of members assigned in this task",
    content: ({ taskId }: { taskId?: string }) => <Members taskId={taskId} />,
  },
  assign_members: {
    title: "Members",
    desc: "List of members assigned in this task",
    content: ({ taskId }: { taskId?: string }) => (
      <AssignMembers taskId={taskId} />
    ),
  },
};

export default function TaskSheetContainer({
  sheetParamValue,
  taskId,
  version,
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
    [pathname, replace, params.toString()]
  );

  const { data: projectSelected } = useProjectSelectStore();
  const projectId = projectSelected[0]?.projectId;

  const queryClient = useQueryClient();

  const closeDrawerAdditionalFn = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
  }, []);

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
  }, [activeTab, createQueryString]);

  if (!sheetParamValue) return null;

  return (
    <ReusableSheet
      title={config[sheetParamValue].title}
      description={config[sheetParamValue].desc}
      content={config[sheetParamValue].content({
        taskId: taskId,
        version: version,
      })}
      paramKey="sheet"
      paramsKeyToDelete={["sheet", "taskId", "version"]}
      toCompare={sheetParamValue}
      tabs={tabs}
      closeDrawerAdditionalFn={closeDrawerAdditionalFn}
    />
  );
}
