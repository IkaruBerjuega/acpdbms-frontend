import { ProjectListResponseInterface } from "@/lib/definitions";
import { CustomDropdownMenu } from "../../dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckboxStore } from "@/hooks/states/create-store";
import { toast } from "@/hooks/use-toast";
import { useProjectActions } from "@/hooks/general/use-project";
import { ProjectActionSchema } from "@/lib/form-constants/form-constants";
import { useQueryParams } from "@/hooks/use-query-params";
import { ProjectActions as Actions } from "@/lib/definitions";

interface ProjectActionsProps<T> {
  attrs: T;
}

export default function ProjectActions<T extends ProjectListResponseInterface>({
  attrs,
}: ProjectActionsProps<T>): JSX.Element {
  const { id, status, project_title } = attrs;

  const isOngoing = status === "ongoing";
  const isArchived = status === "archived";
  const isFinished = status === "finished";
  const isPending = status === "pending";
  const isCancelled = status === "cancelled";

  const canCancel = !isArchived && !isFinished && !isCancelled;
  const canArchive = isFinished && !isArchived;
  const canDestroy = isPending || isCancelled;
  const canUnarchive = isArchived;

  const DialogContent = () => (
    <div className="w-full text-sm">
      <div>Project Title: {project_title} </div>
    </div>
  );

  // Get QueryClient from the context
  const queryClient = useQueryClient();
  const { resetData } = useCheckboxStore();

  const onSuccess = (
    response: { message?: string },
    title: string,
    placeholderMessage: string,
    queryKey: string
  ) => {
    toast({
      variant: "default",
      title: title,
      description: response.message || placeholderMessage,
    });
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  };

  const onError = (
    error: { message?: string },
    title: string,
    placeholderMessage: string,
    queryKey: string
  ) => {
    toast({
      variant: "destructive",
      title: title,
      description: error.message || placeholderMessage,
    });
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  };

  const { cancelProject, archiveUnarchiveProject, removeProject } =
    useProjectActions<ProjectActionSchema>(id);

  const actions = {
    cancel: {
      action: cancelProject,
      title: "Cancel Project",
      successMessage: "The selected project is now cancelled",
      queryKey: "projects",
    },
    remove: {
      action: removeProject,
      title: "Remove Project",
      successMessage: "The selected project is now removed",
      queryKey: "projects-archived",
    },
    archive: {
      action: archiveUnarchiveProject,
      title: "Archive Project",
      successMessage: "The selected project is now archived",
      queryKey: "projects",
    },
    unarchive: {
      action: archiveUnarchiveProject,
      title: "Unarchive Project",
      successMessage: "The selected project is now unarchived",
      queryKey: "projects-archived",
    },
    undefined: null,
  };

  const onClick = ({ action }: { action: Actions }) => {
    if (!action) return;

    const actionFn = actions[action].action;
    const title = actions[action].title;
    const placeholderSuccessMessage = actions[action].successMessage;
    const queryKey = actions[action].queryKey;

    const body = { project_ids: [id] };

    actionFn.mutate(body, {
      onSuccess: (response: {
        message?: string;
        skipped_clients?: { message: string };
      }) => {
        onSuccess(response, title, placeholderSuccessMessage, queryKey);
      },
      onError: (error: { message?: string }) =>
        onError(error, title, placeholderSuccessMessage, queryKey),
    });
    resetData();
  };

  return (
    <CustomDropdownMenu
      menuLabel={"Project Actions"}
      btnVariant={"ghost"}
      btnSrc={"/button-svgs/table-action-threedot.svg"}
      btnSrcAlt="dropdown menu button trigger for project actions "
      items={[
        {
          label: "View Project",
          onClick: () => {},
          iconSrc: "/button-svgs/table-action-view.svg",
          alt: "view project button",
        },
        {
          label: "Edit Project",
          onClick: () => {},
          iconSrc: "/button-svgs/table-action-edit.svg",
          alt: "edit project button",
        },
        ...(canCancel
          ? [
              {
                dialogTitle: "Cancel Project",
                label: "Cancel",
                onClick: () => onClick({ action: "cancel" }),
                iconSrc: "/button-svgs/table-action-cancel-black.svg",
                alt: "cancel project button",
                dialogContent: <DialogContent />,
                dialogBtnSubmitLabel: "Confirm",
                dialogDescription:
                  "Are you sure you want to cancel this project?",
                isDialog: true,
              },
            ]
          : []),
        ...(canArchive
          ? [
              {
                dialogTitle: "Archive Project",
                label: "Archive",
                onClick: () => onClick({ action: "archive" }),
                iconSrc: "/button-svgs/table-action-archive-black.svg",
                alt: "archive project button",
                dialogContent: <DialogContent />,
                dialogBtnSubmitLabel: "Confirm",
                dialogDescription:
                  "Are you sure you want to archive this finished project?",
                // className:
                //   "bg-gray-400 hover:!bg-gray-600 text-white-primary hover:!text-white-secondary",
                isDialog: true,
              },
            ]
          : []),
        ...(canDestroy
          ? [
              {
                dialogTitle: "Remove Project",
                label: "Remove",
                onClick: () => onClick({ action: "remove" }),
                iconSrc: "/button-svgs/table-action-remove.svg",
                alt: "remove project button",
                dialogContent: <DialogContent />,
                dialogBtnSubmitLabel: "Confirm",
                dialogDescription:
                  "Are you sure you want to remove this project?",
                // className:
                //   "bg-gray-400 hover:!bg-gray-600 text-white-primary hover:!text-white-secondary",
                isDialog: true,
              },
            ]
          : []),
        ...(canUnarchive
          ? [
              {
                dialogTitle: "Unarchive Project",
                label: "Unarchive",
                onClick: () => onClick({ action: "unarchive" }),
                iconSrc: "/button-svgs/table-action-unarchive.svg",
                alt: "unarchive project button",
                dialogContent: <DialogContent />,
                dialogBtnSubmitLabel: "Confirm",
                dialogDescription:
                  "Are you sure you want to remove this project?",
                className:
                  "bg-green-500 hover:!bg-green-600 text-white-primary hover:!text-white-secondary",
                isDialog: true,
              },
            ]
          : []),
      ]}
    />
  );
}
