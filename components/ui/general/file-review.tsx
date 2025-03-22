"use client";

import { useGetSpecificTaskVersions } from "@/hooks/api-calls/employee/use-tasks";
import { TaskVersionsResponse } from "@/lib/tasks-definitions";
import SidepanelDrawerComponent from "./sidepanel-drawer";
import TaskFiles from "../employee/tasks/task-files";
import { useState } from "react";
import { TaskFile, TaskFilesApprovalRequest } from "@/lib/files-definitions";
import FileViewer from "../file-viewer";

export default function FileReview({
  taskId,
  view_files,
  initialData,
}: { 
  taskId: string;
  view_files: boolean;
  initialData: TaskVersionsResponse;
}) {
  const [selectedFile, setSelectedFile] = useState<TaskFile>();

  return (
    <div className="flex-1 xl:flex-row-start-center gap-2 min-h-0">
      <div className="h-full flex-grow rounded-md shadow-md flex-col-center  relative">
        <FileViewer file={selectedFile} />
      </div>
      <SidepanelDrawerComponent
        paramKey={"view_files"}
        title="Files To Review"
        description="Files to review are displayed here"
        content={
          <TaskFiles
            taskId={taskId}
            reviewMode={true}
            version={undefined}
            initialData={initialData}
            getSelectedFileUrl={({ file }: { file: TaskFile }) => {
              setSelectedFile(file);
            }}
          />
        }
      />
    </div>
  );
}
