"use client";

import { TaskVersionsResponse } from "@/lib/tasks-definitions";
import SidepanelDrawerComponent from "./sidepanel-drawer";
import TaskFiles from "./tasks/task-files";
import { useCallback, useState } from "react";
import { TaskFile, TaskFilesApprovalRequest } from "@/lib/files-definitions";
import FileViewer from "../file-viewer";
import { usePathname, useRouter } from "next/navigation";
import { useQueryParams } from "@/hooks/use-query-params";
import { Button } from "../button";

export default function FileReview({
  taskId,
  initialData,
  role,
  reviewMode,
}: {
  taskId: string;
  initialData: TaskVersionsResponse;
  role: "manager" | "client";
  reviewMode: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<TaskFile>();

  const { params, paramsKey } = useQueryParams();
  const filePanelIsOpen = paramsKey["view_files"] === "true";

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

  const openFiles = () => {
    createQueryString("view_files", "true");
  };

  const desc =
    role === "manager"
      ? "Approve or reject files as the project manager "
      : "Approve or reject files as the client";

  const [review, setReview] = useState<TaskFilesApprovalRequest["approvals"]>();

  return (
    <div className="flex-1 xl:flex-row-start-center gap-2 min-h-0">
      <div className="h-full flex-grow rounded-md shadow-md flex-col-center bg-white-primary  relative">
        {!filePanelIsOpen && (
          <Button
            className="text-sm absolute right-4 top-4 z-50"
            variant={"outline"}
            size={"sm"}
            onClick={openFiles}
          >
            View Files
          </Button>
        )}
        <FileViewer file={selectedFile} />
      </div>
      <SidepanelDrawerComponent
        paramKey={"view_files"}
        title="Files To Review"
        description={desc}
        content={
          <TaskFiles
            taskId={taskId}
            reviewMode={reviewMode}
            version={undefined}
            initialData={initialData}
            getSelectedFileUrl={({ file }: { file: TaskFile }) => {
              setSelectedFile(file);
            }}
            role={role}
            review={review}
            setReview={setReview}
          />
        }
      />
    </div>
  );
}
