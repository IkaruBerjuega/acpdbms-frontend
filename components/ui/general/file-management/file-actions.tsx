"use client";

import useFileActions from "@/hooks/api-calls/employee/use-files";
import { ReusableContextMenu } from "../../context-menu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useSelectFiles, useTaskSelectFile } from "@/hooks/states/create-store";
import { useMemo } from "react";
import { FileUIProps } from "@/lib/files-definitions";
import { useRouter } from "next/navigation";

export function FileActionWrapper({
  elementTrigger,
  projectId,
  isArchived,
  role,
}: {
  elementTrigger: JSX.Element;
  projectId: string;
  isArchived: boolean;
  role: FileUIProps["role"];
}) {
  const { data: selectedFiles, resetData } = useSelectFiles();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetData();
    }
  };

  const _projectId = projectId.split("_")[0];

  const { deleteFiles, downloadFiles, archiveFiles } = useFileActions({
    projectId: _projectId,
    taskVersionId: selectedFiles[0]?.task_version_id,
  });

  const queryClient = useQueryClient();

  const fileIds: string[] = useMemo(() => {
    return selectedFiles.map((file) => file?.file_id) as string[];
  }, [selectedFiles]);

  const handleDownloadFiles = () => {
    if (selectedFiles.length === 1 && selectedFiles[0]?.path) {
      window.open(selectedFiles[0]?.path);
    } else {
      downloadFiles.mutate(
        { file_ids: fileIds },
        {
          onSuccess: async (response: { download_url?: string }) => {
            if (response.download_url) {
              window.open(response.download_url);
              resetData();
            }
          },
          onError: (error: { message?: string }) => {
            toast({
              variant: "destructive",
              title: "Download File",
              description:
                error.message || "There was an error submitting the request",
            });
          },
        }
      );
    }
  };

  const handleDeleteFile = () => {
    deleteFiles.mutate(
      { file_ids: fileIds },
      {
        onSuccess: async (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Delete File",
            description: response.message || "File successfully deleted",
          });

          queryClient.invalidateQueries({ queryKey: ["files", projectId] });
          resetData();
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Delete File",
            description:
              error.message || "There was an error submitting the request",
          });
        },
      }
    );
  };

  const handleUnarchiveFiles = () => {
    archiveFiles.mutate(
      { file_ids: fileIds },
      {
        onSuccess: async (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Unarchive Files",
            description:
              response.message || "Files Are Successfully Unarchived",
          });
          queryClient.invalidateQueries({ queryKey: ["files", projectId] });
          resetData();
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Unarchive File",
            description:
              error.message || "There was an error submitting the request",
          });
        },
      }
    );
  };

  const { setData } = useTaskSelectFile();

  const { push } = useRouter();

  const handleViewFile = () => {
    let viewPath = "";
    const taskId = selectedFiles[0]?.task_id;
    const taskVersionNumber = selectedFiles[0]?.task_version_number;
    const fileId = selectedFiles[0]?.file_id;

    if (role === "admin") {
      viewPath = `/admin/files/${taskId}/view-files?version=${taskVersionNumber}&projectId=${_projectId}&view_files=true`;
    }

    if (role === "employee") {
      viewPath = `/employee/tasks/${taskId}/view-files?version=${taskVersionNumber}&projectId=${_projectId}&view_files=true`;
    }

    if (role === "client") {
      viewPath = `/client/approval/${taskId}/view-files?version=${taskVersionNumber}&projectId=${_projectId}&view_files=true`;
    }

    setData([fileId]);

    push(viewPath);
  };

  return (
    <ReusableContextMenu
      menuLabel={"File Actions"}
      elementTrigger={elementTrigger}
      handleOpenChange={handleOpenChange}
      items={[
        ...(!isArchived && selectedFiles.length === 1
          ? [
              {
                actionName: "View",
                onClick: handleViewFile,
                btnSrc: "/button-svgs/table-action-view.svg",
                isDialog: false,
              },
            ]
          : []),
        {
          actionName: "Download",
          onClick: handleDownloadFiles,
          btnSrc: "/button-svgs/download.svg",
          isDialog: false,
        },
        ...(isArchived
          ? [
              {
                actionName: "Delete",
                onClick: handleDeleteFile,
                btnSrc: "/button-svgs/trash.svg",
                isDialog: true,
                dialogBtnSubmitLabel: "Confirm",
                dialogDescription:
                  "Do you confirm to deleting all the selected files?",
                dialogTitle: "Delete Files",
              },
              ...(selectedFiles.length === 1
                ? [
                    {
                      actionName: "Unarchive",
                      onClick: handleUnarchiveFiles,
                      btnSrc: "/button-svgs/table-header-unarchive.svg",
                      isDialog: true,
                      dialogBtnSubmitLabel: "Confirm",
                      className:
                        "bg-green-600 text-white-primary hover:text-white-secondary hover:bg-green-700",
                      dialogDescription:
                        "Do you confirm to unarchive the selected file?",
                      dialogTitle: "Unarchive File",
                    },
                  ]
                : []),
            ]
          : []),
      ]}
    />
  );
}
