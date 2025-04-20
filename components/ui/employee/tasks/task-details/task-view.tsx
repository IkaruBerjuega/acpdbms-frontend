"use client";

import TaskDetailsVersions from "./task-details-with-versions";
import TaskSheetContainer from "../task-sheet-container";

export default function Tasks({
  taskId,
  activeSheet,
  version,
  projectId,
}: {
  taskId: string;
  activeSheet: "files" | "comments" | undefined;
  version: string | null;
  projectId: string;
}) {
  return (
    <div className="w-full flex flex-row gap-2 flex-1 min-h-0">
      <TaskDetailsVersions taskId={taskId} />
      <>
        <TaskSheetContainer
          sheetParamValue={activeSheet ?? undefined}
          taskId={taskId ?? ""}
          version={version || ""}
          projectId={projectId}
        />
      </>
    </div>
  );
}
