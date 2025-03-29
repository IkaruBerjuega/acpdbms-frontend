import {
  useGetSpecificTaskVersions,
  useTaskActions,
} from "@/hooks/api-calls/employee/use-tasks";
import Dropbox from "../dropbox";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Separator } from "../../separator";
import { BtnDialog, Button, ButtonIconTooltipDialog } from "../../button";
import { bytesToMb } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  useProjectSelectStore,
  useSelectedTaskStatus,
} from "@/hooks/states/create-store";
import { FileIcon } from "../file-icon";
import { useQueryClient } from "@tanstack/react-query";
import {
  TaskFile,
  TaskFilesApproval,
  TaskFilesApprovalRequest,
} from "@/lib/files-definitions";
import { TaskVersionsResponse } from "@/lib/tasks-definitions";
import { Check, X } from "lucide-react";
import useFileActions from "@/hooks/api-calls/employee/use-files";
import { Badge } from "../../badge";

type viewType = "references" | "deliverables";

type inReviewViewType = "approved" | "rejected" | "to review" | undefined;

function FileView({
  files,
  onFileClick,
  btnSrc,
  btnClassName,
  reviewMode,
  selectedFile,
  review,
  handleSetApproval,
  role,
  tab,
}: {
  files: TaskFile[];
  onFileClick: ({ file }: { file: TaskFile }) => void;
  btnSrc: string;
  btnClassName: string;
  reviewMode?: boolean;
  selectedFile: TaskFile | undefined;
  review: TaskFilesApprovalRequest["approvals"] | undefined;
  handleSetApproval?: ({ task_file_id, approval }: TaskFilesApproval) => void;
  role?: "manager" | "client";
  tab?: inReviewViewType;
}) {
  return (
    <>
      {!files ||
        (files.length === 0 && (
          <div className="text-slate-500 w-full min-h-[100px] flex-row-center text-sm">
            No Files Yet
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

        const isSelected = selectedFile?.id === attachedFile.id;
        const isAccepted = review?.find(
          (task_file) =>
            task_file.task_file_id === attachedFile.id &&
            task_file.approval === true
        );
        const isRejected = review?.find(
          (task_file) =>
            task_file.task_file_id === attachedFile.id &&
            task_file.approval === false
        );

        const reviewedByManagerWithNoClientReview =
          attachedFile.project_manager_approval === true ||
          (attachedFile.project_manager_approval === false &&
            attachedFile.client_approval === null &&
            role === "client");

        const overallReviewStatus = attachedFile.status === "to be reviewed";

        const canReview =
          reviewedByManagerWithNoClientReview || overallReviewStatus;

        return (
          <div
            key={index}
            className={`${reviewMode && "border-[1px] p-2 space-y-2 rounded"} `}
          >
            <div
              className={`rounded-md text-sm p-1 w-full flex-row-between-center ${
                isSelected && "bg-gray-100"
              } `}
            >
              <div
                onClick={() => {
                  onFileClick({ file: attachedFile });
                }}
                className={`flex-row-start-center gap-2 text-[10px] cursor-pointer `}
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
            {canReview && reviewMode && (
              <div className="w-full flex-row-end-center text-xs gap-2 px-2">
                <div className="flex-row-start-center gap-2">
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className={`p-0 px-2 text-xs h-8 ${
                      isAccepted &&
                      "bg-green-600 hover:!bg-green-700 text-white-primary hover:!text-white-secondary"
                    }`}
                    onClick={() => {
                      if (handleSetApproval) {
                        handleSetApproval({
                          task_file_id: attachedFile.id,
                          approval: true,
                        });
                      }
                    }}
                  >
                    <Check /> <>Approve{isAccepted && "d"}</>
                  </Button>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className={`p-0 px-2 text-xs h-8 ${
                      isRejected &&
                      "bg-red-600 hover:!bg-red-700 text-white-primary  hover:!text-white-secondary"
                    }`}
                    onClick={() => {
                      if (handleSetApproval) {
                        handleSetApproval({
                          task_file_id: attachedFile.id,
                          approval: false,
                        });
                      }
                    }}
                  >
                    <X />
                    <>Reject{isRejected && "ed"}</>
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default function TaskFiles({
  taskId,
  version,
  reviewMode,
  initialData,
  getSelectedFileUrl,
  role,
  review,
  setReview,
}: {
  taskId: string | undefined;
  version: string | undefined;
  reviewMode?: boolean;
  initialData?: TaskVersionsResponse;
  getSelectedFileUrl?: ({ file }: { file: TaskFile }) => void;
  role: "manager" | "client";
  review?: TaskFilesApproval[];
  setReview?: Dispatch<SetStateAction<TaskFilesApproval[] | undefined>>;
}) {
  const { data: selectedStatus } = useSelectedTaskStatus();
  const taskStatus = selectedStatus?.[0];

  const [selectedfile, setSelectedfile] = useState<TaskFile>();

  const selectFile = ({ file }: { file: TaskFile }) => {
    setSelectedfile(file);
    if (getSelectedFileUrl) getSelectedFileUrl({ file: file });
  };

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>("");

  const isValidToUploadDeliverables = !reviewMode;

  const defaultView: viewType =
    isValidToUploadDeliverables && taskStatus !== "to do"
      ? "deliverables"
      : "references";

  const [view, setView] = useState<viewType>(defaultView);

  const isTaskDone = taskStatus === "done";

  const defaultReviewView = isTaskDone ? "approved" : "to review";
  const [reviewViewStatus, setreviewViewStatus] =
    useState<inReviewViewType>(defaultReviewView);

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

  const versions = taskVersions?.versions.sort((a, b) => b.version - a.version);
  const lastVersionNumber =
    versions && versions.length > 0
      ? versions.reduce(
          (max, version) => Math.max(max, version.id),
          versions[0].id
        )
      : 1;

  const { uploadDeliverables, uploadReferences } = useTaskActions({
    projectId: projectId,
    taskVersionId: lastVersionNumber,
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

  //for review mode
  const handleSubmitReviewedFiles = async (
    data: TaskFilesApproval[] | undefined
  ) => {
    if (!data) return;

    const actionFn = submitReviewConfig[role].mutate;
    const successMessagePlaceholder =
      submitReviewConfig[role].successMessagePlaceholder;
    const toastTitle = "Review Files";

    const body: TaskFilesApprovalRequest = { approvals: data };

    actionFn(body, {
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

  const { updateProjectManagerApproval, updateClientApproval } = useFileActions(
    { projectId: projectId }
  );

  const submitReviewConfig = {
    manager: {
      mutate: updateProjectManagerApproval.mutate,
      successMessagePlaceholder: "Submitted Successfully",
      isLoading: updateProjectManagerApproval.isLoading,
    },
    client: {
      mutate: updateClientApproval.mutate,
      successMessagePlaceholder: "Submitted Successfully",
      isLoading: updateClientApproval.isLoading,
    },
  };

  if (versionLoading) return null;

  if (!versions || versions.length === 0) {
    return null;
  }

  const lastVersion = versions?.reduce(
    (max, version) => (version.version > max.version ? version : max),
    versions[0]
  );
  const openedVersion =
    versions.find((ver) => ver.version === Number(version)) || lastVersion;

  const isLastVersion = lastVersion.version === openedVersion.version;

  const files = isLastVersion
    ? lastVersion.task_files
    : openedVersion.task_files;

  const filesToReview = files.filter(
    (file) => file.status === "to be reviewed"
  );
  const approvedFiles = files.filter((file) => file.status === "approved");
  const rejectedFiles = files.filter((file) => file.status === "rejected");
  const referencesFiles = files.filter(
    (file) => file.category === "references"
  );
  const deliverablesFiles = files.filter(
    (file) => file.category === "deliverables"
  );

  const filesApprovedByManager = approvedFiles.filter(
    (file) => file.project_manager_approval === true
  );

  const filesApprovedByClient = approvedFiles.filter(
    (file) => file.client_approval === true
  );

  const filesApprovedByBothManagerAndClient = approvedFiles.filter(
    (file) =>
      file.client_approval === true && file.project_manager_approval === true
  );

  const filesRejectedByManager = rejectedFiles.filter(
    (file) => file.project_manager_approval === false
  );

  const filesRejectedByClient = rejectedFiles.filter(
    (file) => file.client_approval === false
  );

  const filesRejectedByBothManagerAndClient = rejectedFiles.filter(
    (file) =>
      file.client_approval === false && file.project_manager_approval === false
  );

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

  const handleSetApproval = ({ task_file_id, approval }: TaskFilesApproval) => {
    if (!setReview) return;
    //check if the task file is already reviewed initially
    const existingReviewedFile = review?.find(
      (file) => file.task_file_id === task_file_id
    );

    if (existingReviewedFile) {
      //now check if the data passed by the event has opposite approval, return null if the approval is the same
      if (approval === existingReviewedFile.approval) return null;

      //if the approval is not the same, transform the approval for the exisiting reviewed file
      setReview((prev) => {
        const newReviewedFiles = prev?.map((file) => {
          if (file.task_file_id === task_file_id) {
            return {
              task_file_id: task_file_id,
              approval: approval,
            };
          }

          return file;
        });

        return newReviewedFiles;
      });
    }

    //if the file is not still reviewed
    const newApproval: TaskFilesApproval = {
      task_file_id: task_file_id,
      approval: approval,
    };

    setReview((prev) => {
      if (!prev) return [newApproval]; // Initialize with the new item if undefined
      return [...prev, newApproval]; // Append to the existing array
    });
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

  //this function resets the state of the accepted/rejected files in the review tab if this component is in review mode
  const resetState = async () => {
    if (!setReview) return;
    setReview(undefined);
  };

  const isViewDeliverables = view === "deliverables";
  const isViewToReview = reviewViewStatus === "to review";
  const isViewAccepted = reviewViewStatus === "approved";
  const isViewRejected = reviewViewStatus === "rejected";

  return (
    <div className="h-full flex-col-start min-h-0 ">
      <div
        className={`${
          isLastVersion && !reviewMode ? "h-1/2" : "h-full"
        } w-full flex-col-start gap-4 min-h-0`}
      >
        <div className="h-full w-full flex-col-start  min-h-0">
          <div className="flex-row-start-center">
            {isValidToUploadDeliverables &&
              (taskStatus !== "to do" || deliverablesFiles.length > 0) && (
                <>
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
                </>
              )}

            {reviewMode && (
              <>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  onClick={() => setreviewViewStatus("to review")}
                  className={`${
                    isViewToReview
                      ? "text-black-primary font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  To Review
                  <span className="rounded-md px-2 py-1 text-xs">
                    {filesToReview.length}
                  </span>
                </Button>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  onClick={() => setreviewViewStatus("approved")}
                  className={`
                    ${
                      isViewAccepted
                        ? "text-black-primary font-semibold"
                        : "text-slate-400"
                    }`}
                >
                  Approved
                  <span className=" rounded-md px-2 py-1 text-xs ">
                    {approvedFiles.length}
                  </span>
                </Button>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  onClick={() => setreviewViewStatus("rejected")}
                  className={`${
                    isViewRejected
                      ? "text-black-primary font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  Rejected
                  <span className="rounded-md px-2 py-1 text-xs ">
                    {rejectedFiles.length}
                  </span>
                </Button>
              </>
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
            {!reviewMode && (
              <>
                {isViewDeliverables && (
                  <FileView
                    files={deliverablesFiles}
                    onFileClick={selectFile}
                    btnSrc={"/button-svgs/table-action-archive-black.svg"}
                    btnClassName={"border-none"}
                    reviewMode={reviewMode}
                    selectedFile={selectedfile}
                    review={undefined}
                    handleSetApproval={undefined}
                  />
                )}
                {!isViewDeliverables && (
                  <FileView
                    files={referencesFiles}
                    onFileClick={selectFile}
                    btnSrc={"/button-svgs/table-action-archive-black.svg"}
                    btnClassName={"border-none"}
                    reviewMode={reviewMode}
                    selectedFile={selectedfile}
                    review={undefined}
                  />
                )}
              </>
            )}

            {reviewMode && (
              <>
                {isViewToReview && (
                  <FileView
                    files={filesToReview}
                    onFileClick={selectFile}
                    btnSrc={"/button-svgs/table-action-archive-black.svg"}
                    btnClassName={"border-none"}
                    reviewMode={reviewMode}
                    selectedFile={selectedfile}
                    review={review}
                    handleSetApproval={handleSetApproval}
                  />
                )}

                {isViewAccepted && (
                  <>
                    <div className="space-y-2">
                      <Badge className="bg-gray-100 text-black-secondary">
                        Manager Approved
                      </Badge>
                      <FileView
                        files={filesApprovedByManager}
                        onFileClick={selectFile}
                        btnSrc={"/button-svgs/table-action-archive-black.svg"}
                        btnClassName={"border-none"}
                        reviewMode={reviewMode}
                        selectedFile={selectedfile}
                        review={review}
                        handleSetApproval={handleSetApproval}
                        role={role}
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-gray-100 text-black-secondary">
                        Client Approved
                      </Badge>
                      <FileView
                        files={filesApprovedByClient}
                        onFileClick={selectFile}
                        btnSrc={"/button-svgs/table-action-archive-black.svg"}
                        btnClassName={"border-none"}
                        reviewMode={reviewMode}
                        selectedFile={selectedfile}
                        handleSetApproval={handleSetApproval}
                        review={review}
                        role={role}
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-gray-100 text-black-secondary">
                        Manager/Client Approved
                      </Badge>
                      <FileView
                        files={filesApprovedByBothManagerAndClient}
                        onFileClick={selectFile}
                        btnSrc={"/button-svgs/table-action-archive-black.svg"}
                        btnClassName={"border-none"}
                        reviewMode={reviewMode}
                        selectedFile={selectedfile}
                        review={undefined}
                      />
                    </div>
                  </>
                )}

                {isViewRejected && (
                  <FileView
                    files={rejectedFiles}
                    onFileClick={selectFile}
                    btnSrc={"/button-svgs/table-action-archive-black.svg"}
                    btnClassName={"border-none"}
                    reviewMode={reviewMode}
                    selectedFile={selectedfile}
                    review={undefined}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isLastVersion && !reviewMode && !isTaskDone && (
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

      <div className="flex-grow"></div>
      {isLastVersion && reviewMode && (
        <div className="w-full flex-row-end-center gap-2">
          <BtnDialog
            btnTitle={"Reset"}
            isLoading={isLoading}
            alt={"Reset the accepted/rejected files state button"}
            dialogTitle={"Reset State"}
            dialogDescription={
              "Do you confirm on resetting the state of the to review files?"
            }
            submitType={"button"}
            submitTitle="Confirm"
            onClick={resetState}
            variant="outline"
          />
          <BtnDialog
            btnTitle={"Submit Review"}
            isLoading={isLoading}
            alt={"submit review button"}
            dialogTitle={"Review Files"}
            dialogDescription={"Do you confirm the accepted or rejected files?"}
            submitType={"button"}
            submitTitle="Confirm"
            onClick={() => handleSubmitReviewedFiles(review)}
            disabled={review?.length === undefined}
          />
        </div>
      )}
    </div>
  );
}
