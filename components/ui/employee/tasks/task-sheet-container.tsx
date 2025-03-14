"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import ReusableSheet from "../../general/sheet-component";
import { PhasesActive, PhasesArchived } from "./phases-actions";
import TaskComments from "./task-comments";
import TaskFiles from "./task-files";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

interface TaskSheetContainerProps {
  sheetParamValue:
    | "files"
    | "comments"
    | "phases"
    | "phases_archived"
    | undefined;
  taskId: string | undefined;
}

export default function TaskSheetContainer({
  sheetParamValue,
  taskId,
}: TaskSheetContainerProps) {
  const paramKey = "sheet";

  const config = {
    comments: {
      title: "Comments",
      desc: "Comments about attached files are displayed here",
      content: <TaskComments taskId={taskId} />,
    },
    files: {
      title: "Files",
      desc: "See attached files or attach a file",
      content: <TaskFiles taskId={taskId} />,
    },
    phases: {
      title: "Phases",
      desc: "Finish, Cancel, Archive Phases",
      content: <PhasesActive />,
    },
    phases_archived: {
      title: "Phases",
      desc: "Finish, Cancel, Archive Phases",
      content: <PhasesArchived />,
    },
  };

  const { params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  const activeTab =
    sheetParamValue === "phases"
      ? "Phases"
      : sheetParamValue === "phases_archived"
      ? "Archived Phases"
      : null;

  let tabs = {
    activeTab: activeTab,
    tabItems: [
      {
        item: "Phases",
        action: () => {
          createQueryString("sheet", "phases");
        },
      },
      {
        item: "Archived Phases",
        action: () => {
          createQueryString("sheet", "phases_archived");
        },
      },
    ],
  };

  if (!sheetParamValue) return;

  return (
    <ReusableSheet
      title={config[sheetParamValue].title}
      description={config[sheetParamValue].desc}
      content={config[sheetParamValue].content}
      paramKey={paramKey}
      toCompare={sheetParamValue}
      tabs={activeTab && tabs}
    />
  );
}
