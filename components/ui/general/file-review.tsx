"use client";

import { TaskVersionsResponse } from "@/lib/tasks-definitions";
import SidepanelDrawerComponent from "./sidepanel-drawer";
import TaskFiles from "./tasks/task-files";
import { useCallback, useState } from "react";
import { TaskFile, TaskFilesApprovalRequest } from "@/lib/files-definitions";
import FileViewer from "../file-viewer";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../button";

export default function FileReview({
  taskId,
  version,
  initialData,
  role,
  reviewMode,
  projectId,
  view_files,
}: {
  taskId: string;
  version: string | null;
  initialData: TaskVersionsResponse;
  role: "manager" | "client";
  reviewMode: boolean;
  projectId: string;
  view_files: string | null;
}) {
  const [selectedFile, setSelectedFile] = useState<TaskFile>();

  const params = new URLSearchParams();
  const filePanelIsOpen = view_files === "true";

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

  //(projectId, 1)

  const openFiles = () => {
    createQueryString("view_files", "true");
  };

  const sidepanelConfig = {
    true: {
      title: "Files to review",
      desc:
        role === "manager"
          ? "Approve or reject files as the project manager"
          : "Approve or reject files as the client",
    },
    false: {
      title: "Files",
      desc:
        role === "manager"
          ? "View files and manage files"
          : "View files as the client",
    },
  };

  const isInReviewMode = reviewMode === true ? "true" : "false";

  const [review, setReview] = useState<TaskFilesApprovalRequest["approvals"]>();

  if (!version) {
    return (
      <div className="flex-grow bg-white-primary rounded-md shadow-md">
        There was an error
      </div>
    );
  }

  return (
    <div className="flex-1 xl:flex-row-start-center gap-2 min-h-0">
      <div className="h-full flex-grow rounded-md shadow-md flex-col-center bg-white-primary  relative">
        {!filePanelIsOpen && (
          <Button
            className="text-sm absolute bottom-4 right-4 z-50"
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
        title={sidepanelConfig[isInReviewMode].title}
        description={sidepanelConfig[isInReviewMode].desc}
        content={
          <TaskFiles
            taskId={taskId}
            reviewMode={reviewMode}
            version={version}
            initialData={initialData}
            getSelectedFileUrl={({ file }: { file: TaskFile }) => {
              setSelectedFile(file);
            }}
            role={role}
            review={review}
            setReview={setReview}
            projectId={projectId}
          />
        }
      />
    </div>
  );
}
