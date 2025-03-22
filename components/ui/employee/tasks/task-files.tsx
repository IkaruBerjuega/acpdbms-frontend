import {
  useGetSpecificTask,
  useGetSpecificTaskVersions,
  useTaskActions,
} from "@/hooks/api-calls/employee/use-tasks";
import Dropbox from "../../general/dropbox";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Separator } from "../../separator";
import { BtnDialog, Button, ButtonIconTooltipDialog } from "../../button";
import { bytesToMb } from "@/lib/utils";
import { Checkbox } from "../../checkbox";
import { toast } from "@/hooks/use-toast";
import {
  useProjectSelectStore,
  useSelectedTaskStatus,
} from "@/hooks/states/create-store";
import { FileIcon } from "../../general/file-icon";
import { useQueryClient } from "@tanstack/react-query";
import { TaskFile, TaskFilesApprovalRequest } from "@/lib/files-definitions";
import { TaskVersionsResponse } from "@/lib/tasks-definitions";

function FileView({
  files,
  onFileClick,
  btnSrc,
  btnClassName,
  reviewMode,
}: {
  files: TaskFile[];
  onFileClick: ({ file }: { file: TaskFile }) => void;
  btnSrc: string;
  btnClassName: string;
  reviewMode?: boolean;
}) {
  return (
    <>
      {!files ||
        (files.length === 0 && (
          <div className="text-slate-500 w-full min-h-[100px] flex-row-center text-sm">
            No Uploaded Files Yet
          </div>
        ))}
      {files.map((attachedFile, index) => {
        function DialogDesc() {
          return (
            <div className="flex-col-start text-sm ">
              <span>File Name: {attachedFile.name}</span>
            </div>
          );
        }
        return (
          <div
            key={index}
            className=" rounded-md text-sm p-1 w-full flex-row-between-center  "
          >
            <div
              onClick={() => {
                onFileClick({ file: attachedFile });
              }}
              className="flex-row-start-center gap-2 text-[10px] cursor-pointer"
            >
              <div className="h-full p-1 text-2xl">
                <FileIcon fileType={attachedFile.type} />
              </div>
              <div className="flex-col-start leading-tight">
                <div className=" text-black-primary text-xs">
                  {attachedFile.name}
                </div>
                <div className="text-slate-500 flex-row-start-center gap-2">
                  <span>{bytesToMb(attachedFile.size)} mb</span>
                  <span>•</span>
                  <span>
                    Uploaded by: {attachedFile.uploaded_by} at{" "}
                    {attachedFile.uploaded_at}
                  </span>
                </div>
                <div className="text-slate-400 "></div>
              </div>
            </div>
            {!reviewMode && (
              <div className="h-full flex-row-center min-w-10">
                <ButtonIconTooltipDialog
                  tooltipContent={"Remove file"}
                  iconSrc={btnSrc}
                  className={btnClassName}
                  onClick={() => {}}
                  alt={"remove uploaded file button"}
                  dialogTitle={"Remove Uploaded File"}
                  dialogDescription={
                    "Do you confirm on removing this uploaded file?"
                  }
                  dialogContent={<DialogDesc />}
                  submitType={"button"}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

type viewType = "references" | "deliverables";

export default function TaskFiles({
  taskId,
  version,
  reviewMode,
  initialData,
  getSelectedFileUrl,
}: {
  taskId: string | undefined;
  version: string | undefined;
  reviewMode?: boolean;
  initialData?: TaskVersionsResponse;
  getSelectedFileUrl?: ({ file }: { file: TaskFile }) => void;
}) {
  const { data: selectedStatus } = useSelectedTaskStatus();
  const taskStatus = selectedStatus?.[0];
  const isValidToUploadDeliverables =
    taskStatus !== "to do" && taskStatus !== "done";
  const [selectedfile, setSelectedfile] = useState<TaskFile>();
  const [review, setReviewFiles] =
    useState<TaskFilesApprovalRequest["approvals"]>();

  const selectFile = ({ file }: { file: TaskFile }) => {
    setSelectedfile(file);
    console.log(file);
    if (getSelectedFileUrl) getSelectedFileUrl({ file: file });
  };

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>("");

  const defaultView: viewType = isValidToUploadDeliverables
    ? "deliverables"
    : "references";

  const [view, setView] = useState<viewType>(defaultView);

  const attachedFileSize: number = useMemo(() => {
    let size = 0; //in kb
    attachedFiles.map((attachedFileSize) => (size += attachedFileSize.size));
    return size;
  }, [attachedFiles]);

  const { data: projectSelected } = useProjectSelectStore();
  const projectId = projectSelected[0]?.projectId;
  if (!taskId) return null;

  const { data: taskVersions, isLoading: versionLoading } =
    useGetSpecificTaskVersions({
      taskId: taskId,
      initialData: initialData,
    });

  const versions = taskVersions?.versions;

  const { uploadDeliverables, uploadReferences } = useTaskActions({
    projectId: projectId,
    taskVersionId:
      versions && versions.length > 0 ? versions[versions.length - 1].id : 0,
  });

  //for refetching
  const queryClient = useQueryClient();

  const {
    mutate: uploadDeliverablesMutate,
    isLoading: uploadDeliverablesIsLoading,
  } = uploadDeliverables;
  const {
    mutate: uploadReferencesMutate,
    isLoading: uploadReferencesIsLoading,
  } = uploadReferences;

  if (versionLoading) return <div>Loading...</div>;

  if (!versions || versions.length === 0) {
    return <div>No versions available</div>;
  }

  const lastIndex = versions?.length - 1;

  const lastVersion = versions[lastIndex];
  const versionIndex = Number(version);

  const openedVersion =
    Number.isNaN(versionIndex) ||
    versionIndex < 0 ||
    versionIndex >= versions.length
      ? versions[lastIndex]
      : versions[versionIndex];

  const isLastVersion = lastVersion.version === openedVersion.version;

  const files = lastVersion.task_files;

  const references = files.filter((file) => file.category === "references");
  const deliverables = files.filter((file) => file.category === "deliverables");

  const maxSizeInMb = 100;

  const isLoading = uploadDeliverablesIsLoading || uploadReferencesIsLoading;

  const actionConfig = {
    deliverables: {
      title: !reviewMode ? "Upload Deliverables" : "Review Files",
      mutate: uploadDeliverablesMutate,
      successMessagePlaceholder: !reviewMode
        ? "Deliverables Successfully Uploaded"
        : "Review successfully submitted",
      isLoading: uploadDeliverablesIsLoading,
      dragAndDropDesc: !reviewMode
        ? "Drag and drop to upload deliverable files"
        : "Do you confirm the files that you accepted/rejected?",
    },
    references: {
      title: "Upload Reference",
      mutate: uploadReferencesMutate,
      successMessagePlaceholder: "References Successfully Uploaded",
      isLoading: uploadReferencesIsLoading,
      dragAndDropDesc: "Drag and drop to upload reference files",
    },
  };

  const handleUploadFiles = async () => {
    const attachedFileSizeMb = bytesToMb(attachedFileSize);
    if (attachedFileSizeMb > maxSizeInMb) {
      setMessage("Attached file size should not exceed 100mb");
      return;
    }

    const actionFn = actionConfig[view].mutate;
    const successMessagePlaceholder =
      actionConfig[view].successMessagePlaceholder;
    const toastTitle = actionConfig[view].title;

    //setup form data
    const formData = new FormData();
    for (let i = 0; i < attachedFiles.length; i++) {
      formData.append("files[]", attachedFiles[i]);
    }

    setAttachedFiles([]);

    actionFn(formData, {
      onSuccess: async (response: { message?: string }) => {
        toast({
          variant: "default",
          title: toastTitle,
          description: response.message || successMessagePlaceholder,
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
          queryClient.invalidateQueries({
            queryKey: ["task-versions", taskId],
          }),
        ]);
      },
      onError: (error: { message?: string }) => {
        toast({
          variant: "destructive",
          title: toastTitle,
          description:
            error.message || "There was an error submitting the form",
        });
      },
    });
  };

  const isViewDeliverables = view === "deliverables";

  return (
    <div className="flex-grow flex-col-start min-h-0">
      <div
        className={`${
          isLastVersion && !reviewMode ? "h-1/2" : "h-full"
        } w-full flex-col-start gap-4 min-h-0`}
      >
        <div className="h-full w-full flex-col-start  min-h-0">
          <div className="flex-row-start-center">
            {isValidToUploadDeliverables && (
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => setView("deliverables")}
                className={`${
                  isViewDeliverables
                    ? "text-black-primary font-semibold"
                    : "text-slate-400"
                }`}
              >
                Deliverables
              </Button>
            )}

            {!reviewMode && (
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => setView("references")}
                className={`${
                  !isViewDeliverables
                    ? "text-black-primary font-semibold"
                    : "text-slate-400"
                }`}
              >
                References
              </Button>
            )}
          </div>
          <Separator />
          <div className="flex-1 overflow-y-auto space-y-2 py-4">
            {isViewDeliverables && (
              <FileView
                files={deliverables}
                onFileClick={selectFile}
                btnSrc={"/button-svgs/table-action-archive-black.svg"}
                btnClassName={"border-none"}
                reviewMode={reviewMode}
              />
            )}
            {!isViewDeliverables && (
              <FileView
                files={references}
                onFileClick={selectFile}
                btnSrc={"/button-svgs/table-action-archive-black.svg"}
                btnClassName={"border-none"}
                reviewMode={reviewMode}
              />
            )}
          </div>
        </div>
      </div>
      {isLastVersion && !reviewMode && (
        <>
          <Separator className="w-full my-4 bg-slate-500" />
          <div className="w-full flex-col-start gap-2 h-1/2 overflow-y-auto">
            <div className="w-full">
              <Dropbox
                state={{
                  attachedFiles: attachedFiles,
                  setAttachedFiles: setAttachedFiles,
                }}
                description={actionConfig[view].dragAndDropDesc}
              />
              {message && <div className="text-xs text-red-600">{message}</div>}
            </div>

            <div className="w-full flex-row-end-center">
              <BtnDialog
                btnTitle={"Submit"}
                isLoading={isLoading}
                alt={"Submit attached or uploaded files"}
                dialogTitle={actionConfig[view].title}
                dialogDescription={
                  "Do you confirm on uploading the attached files?"
                }
                submitType={"button"}
                submitTitle="Confirm"
                onClick={handleUploadFiles}
              />
            </div>
          </div>
        </>
      )}

      {isLastVersion && reviewMode && (
        <div className="w-full flex-row-end-center">
          <BtnDialog
            btnTitle={"Review Files"}
            isLoading={isLoading}
            alt={"submit button"}
            dialogTitle={actionConfig[view].title}
            dialogDescription={actionConfig[view].dragAndDropDesc}
            submitType={"button"}
            submitTitle="Confirm"
            onClick={handleUploadFiles}
          />
        </div>
      )}
    </div>
  );
}
