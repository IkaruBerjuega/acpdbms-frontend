"use client";
import useFileActions from "@/hooks/api-calls/employee/use-files";
import { ReusableContextMenu } from "../../context-menu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useCheckboxStore } from "@/hooks/states/create-store";

export function FileActionWrapper({
  elementTrigger,
  projectId,
  isArchived,
}: {
  elementTrigger: JSX.Element;
  projectId: string;
  isArchived: boolean;
}) {
  const { resetData } = useCheckboxStore();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetData();
    }
  };

  const { deleteFiles, downloadFiles } = useFileActions({
    projectId: projectId,
  });
  const { data: selectedFiles } = useCheckboxStore();

  const queryClient = useQueryClient();

  const handleDownloadFiles = () => {
    downloadFiles.mutate(
      { file_ids: selectedFiles as string[] },
      {
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

  const handleDeleteFile = () => {
    deleteFiles.mutate(
      { file_ids: selectedFiles as string[] },
      {
        onSuccess: async (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Delete File",
            description: response.message || "File successfully deleted",
          });

          console.log("fetching projectId based files " + projectId);
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

  return (
    <ReusableContextMenu
      menuLabel={"File Actions"}
      elementTrigger={elementTrigger}
      handleOpenChange={handleOpenChange}
      items={[
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
                  "Are you sure you want to delete the selected files?",
                dialogTitle: "Delete Files",
              },
            ]
          : []),
      ]}
    />
  );
}
