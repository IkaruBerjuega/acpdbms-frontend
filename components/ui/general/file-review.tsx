"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../button";
import FileViewer from "../file-viewer";
import TaskComments from "../employee/tasks/task-comments";
import TaskFiles from "./tasks/task-files";
import SidepanelDrawerComponent from "./sidepanel-drawer";

import { useQueryParams } from "@/hooks/use-query-params";
import { TaskVersionsResponse } from "@/lib/tasks-definitions";
import { TaskFile, TaskFilesApprovalRequest } from "@/lib/files-definitions";
import { LiaFileSolid } from "react-icons/lia";
import { LuMessageSquareMore } from "react-icons/lu";

const sidepanelConfig = {
  true: {
    title: "Files to review",
    descManager: "Approve or reject files as the project manager",
    descClient: "Approve or reject files as the client",
  },
  false: {
    title: "Files",
    descManager: "View files and manage files",
    descClient: "View files as the client",
  },
};

export default function FileReview({
  taskId,
  version,
  initialData,
  role,
  reviewMode,
  projectId,
  view_files,
  view_comments,
}: {
  taskId: string;
  version: string | null;
  initialData: TaskVersionsResponse;
  role: "admin" | "manager" | "client";
  reviewMode: boolean;
  projectId: string;
  view_files: string | null;
  view_comments: string | null;
}) {
  const [selectedFile, setSelectedFile] = useState<TaskFile>();
  const [review, setReview] = useState<TaskFilesApprovalRequest["approvals"]>();
  const { params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const filePanelIsOpen = !!view_files;
  const commentsIsOpen = !!view_comments;

  const activeTab = useMemo(
    () => (filePanelIsOpen ? "view_files" : "view_comments"),
    [filePanelIsOpen]
  );

  const isInReviewMode = useMemo(
    () => (reviewMode ? "true" : "false"),
    [reviewMode]
  );

  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      const newParams = new URLSearchParams(params.toString());
      if (parameter === "view_files") {
        newParams.delete("view_comments");
      } else {
        newParams.delete("view_files");
      }
      newParams.set(parameter, value);
      replace(`${pathname}?${newParams.toString()}`);
    },
    [params, pathname, replace]
  );

  const openFiles = useCallback(() => {
    createQueryString("view_files", "true");
  }, [createQueryString]);

  const openComments = useCallback(() => {
    createQueryString("view_comments", "true");
  }, [createQueryString]);

  const sidePanelTitle = useMemo(() => {
    return filePanelIsOpen ? sidepanelConfig[isInReviewMode].title : "Comments";
  }, [filePanelIsOpen, isInReviewMode]);

  const sidePanelDesc = useMemo(() => {
    if (filePanelIsOpen) {
      return role === "manager"
        ? sidepanelConfig[isInReviewMode].descManager
        : sidepanelConfig[isInReviewMode].descClient;
    }
    return "Comments made by team members and client are displayed here";
  }, [filePanelIsOpen, isInReviewMode, role]);

  const sidePanelContent = useMemo(() => {
    return filePanelIsOpen ? (
      <TaskFiles
        taskId={taskId}
        reviewMode={reviewMode}
        version={version!}
        initialData={initialData}
        getSelectedFileUrl={({ file }: { file: TaskFile }) => {
          setSelectedFile(file);
        }}
        role={role}
        review={review}
        setReview={setReview}
        projectId={projectId}
      />
    ) : (
      <TaskComments taskId={taskId} projectId={projectId} />
    );
  }, [
    filePanelIsOpen,
    taskId,
    reviewMode,
    version,
    initialData,
    role,
    review,
    projectId,
  ]);

  if (!version) {
    return (
      <div className="flex-grow bg-white-primary rounded-md shadow-md">
        There was an error
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 xl:flex-row-start-center gap-2 min-h-0">
        <div className="h-full flex-grow relative flex-col-start gap-2">
          <div className="w-full flex-row-end-center gap-2">
            <Button
              className={` shadow-md flex-row-center gap-2 ${
                !filePanelIsOpen && "bg-gray-100"
              } bg-white-primary hover:bg-white-primary`}
              variant="outline"
              onClick={openFiles}
            >
              <LiaFileSolid />
              <span>View Files</span>
            </Button>
            <Button
              className={` shadow-md flex-row-center gap-2 ${
                !commentsIsOpen && "bg-gray-100"
              } bg-white-primary hover:bg-white-primary`}
              variant="outline"
              onClick={openComments}
            >
              <LuMessageSquareMore />
              <span>Comments</span>
            </Button>
          </div>
          <FileViewer file={selectedFile} />
        </div>

        <SidepanelDrawerComponent
          paramKey={activeTab}
          title={sidePanelTitle}
          description={sidePanelDesc}
          content={sidePanelContent}
        />
      </div>
    </>
  );
}
