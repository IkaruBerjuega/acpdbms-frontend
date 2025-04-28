import { DragSourceMonitor, useDrag } from "react-dnd";
import { Badge } from "../../badge";
import { Separator } from "../../separator";
import { Avatar, AvatarFallback } from "../../avatar";
import { titleCase } from "@/lib/utils";
import { LuFileCheck, LuFileX, LuMessageSquareMore } from "react-icons/lu";
import { SlPaperClip } from "react-icons/sl";
import { IoTimer, IoTimerOutline } from "react-icons/io5";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { LegacyRef, useCallback } from "react";
import {
  useProjectSelectStore,
  useSelectedTaskStatus,
  useTaskToUpdateDetails,
} from "@/hooks/states/create-store";
import { TaskItem, TaskItemProps, TaskStatuses } from "@/lib/tasks-definitions";
import { ItemTypes } from "@/lib/definitions";
import { Button } from "../../button";
import { CustomDropdownMenu } from "../../dropdown-menu";
import Profile from "../profile";
import { toast } from "@/hooks/use-toast";

interface IconWithTextInfoProps {
  icon: JSX.Element;
  text: string;
  className: string | undefined;
}

function IconWithTextInfo({ icon, text, className }: IconWithTextInfoProps) {
  return (
    <div className={`flex-row-start-center w-fit gap-1  ${className}`}>
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
}

interface TaskCardProps extends TaskItemProps {
  moveTask?: ({
    id,
    droppedStatus,
    recentStatus,
  }: {
    id: number;
    droppedStatus: TaskStatuses;
    recentStatus: TaskStatuses;
  }) => void;
  className: string;
  clientView?: boolean;
}

export default function TaskCard(props: TaskCardProps) {
  const { setData } = useSelectedTaskStatus();
  const {
    id = 0, // Default values applied here instead
    phase_category = "",
    task_comments_count = 0,
    status = "to do",
    task_name = "Unnamed Task",
    task_description = "",
    total_duration,
    assigned_team_members = [],
    approved_files_count,
    rejected_files_count,
    phaseColor,
    created_at,
    finish_date,
    updated_at,
    version,
    className,
    task_files_count,
    remaining_duration,
    start_date,
    moveTask = () => {},
  } = props || {};

  const [{ isDragging }, drag] = useDrag<
    TaskItemProps, // Dragged item type
    { columnStatus: string }, // Drop result type
    { isDragging: boolean } // Collected props type,
  >(() => {
    const item: TaskItemProps = {
      id,
      phase_category,
      task_comments_count,
      status,
      task_name,
      total_duration,
      task_description,
      assigned_team_members,
      phaseColor,
      approved_files_count,
      rejected_files_count,
      task_files_count,
      finish_date,
      created_at,
      updated_at,
      remaining_duration,
      start_date,
      version,
    };
    return {
      type: ItemTypes.TASK,
      item,
      end: (
        item: TaskItem,
        monitor: DragSourceMonitor<TaskItem, { columnStatus: string }>
      ) => {
        const dropResult = monitor.getDropResult<{
          columnStatus: TaskStatuses;
        }>();
        if (item && dropResult) {
          moveTask({
            id: item.id,
            droppedStatus: dropResult.columnStatus,
            recentStatus: status,
          });
        }
      },
      collect: (
        monitor: DragSourceMonitor<TaskItem, { columnStatus: string }>
      ) => ({
        isDragging: monitor.isDragging(),
      }),
    };
  });

  const totalDuration = total_duration ? total_duration.toFixed(0) : 0;
  const remainingDuration =
    typeof remaining_duration !== "string"
      ? Number(remaining_duration?.toFixed(0))
      : Number(remaining_duration[0]);

  const totalDurationText = `${
    status !== "to do" ? totalDuration : remainingDuration
  } days`;

  const isDaysPlural = Math.abs(remainingDuration) > 1;

  const remainingDurationText =
    remainingDuration < 0
      ? `${Math.abs(remainingDuration)} day${isDaysPlural ? "s" : ""} overdue`
      : `${remainingDuration} day${isDaysPlural ? "s" : ""} remaining`;

  const shouldDisplayRemaining = status !== "done" && status !== "to do";

  const { params, paramsKey } = useQueryParams();
  const pathname = usePathname();
  const { replace, push: goTo } = useRouter();

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      params.set(parameter, value);
      setData([status]);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  const isInNeedsReview = status === "needs review";

  function onMembersClick() {
    createQueryString("sheet", "members");
    createQueryString("taskId", String(id));
  }

  function onAssignMembersClick() {
    createQueryString("sheet", "assign_members");
    createQueryString("taskId", String(id));
  }

  const { setData: setToUpdateDetails } = useTaskToUpdateDetails();

  function onUpdateTaskClick() {
    setToUpdateDetails([props]);
    createQueryString("taskId", String(id));
    createQueryString("sheet", "update_task");
  }

  const { data: projectSelected } = useProjectSelectStore();
  const isUserMember = projectSelected[0]?.userRole === "Member";

  //check if there is projectId url parameter
  const projectId = paramsKey["projectId"];

  function goToFiles() {
    if (status === "needs review") {
      if (isUserMember) {
        toast({
          title: "Warning",
          description: "Only user with manager role can review a task",
          variant: "destructive",
        });
        return;
      }

      goTo(
        `/employee/tasks/${id}/review-files?view_files=true&version=${version}&projectId=${projectId}`
      );
      return;
    }
    goTo(
      `/employee/tasks/${id}/view-files?view_files=true&version=${version}&projectId=${projectId}`
    );
    localStorage.setItem("selectedTaskStatus", status);
  }

  //link to go to task details
  const detailsLink = `tasks/${id}/details?projectId=${projectId}`;

  //function to add open message sheet with adding search parameters
  function onMessagesClick() {
    createQueryString("sheet", "comments");
    createQueryString("taskId", String(id));
  }

  const hasMembers = assigned_team_members.length > 0;

  const approvedFiles = approved_files_count !== null;
  const rejectedFiles = rejected_files_count !== null;

  const isStatusNeedsReview = isInNeedsReview && approvedFiles && rejectedFiles;

  const approvedFilesCountText = `${approved_files_count} accepted`;
  const rejectedFilesCountText = `${rejected_files_count} rejected`;

  const reviewedFilesCount =
    Number(approved_files_count ?? "0") + Number(rejected_files_count ?? "0");

  let reviewStatus: { text: string; color: string } = { text: "", color: "" };

  if (isInNeedsReview) {
    const reviewedAllFiles = task_files_count === reviewedFilesCount;

    if (reviewedAllFiles) {
      const hasRejectedFiles = rejected_files_count ?? 0 > 0;
      const text = hasRejectedFiles ? `Rejected` : `Approved`;

      const color = hasRejectedFiles
        ? "bg-red-100 text-red-600"
        : "bg-green-100 bg-green-600";

      reviewStatus = {
        text: text,
        color: color,
      };
    } else {
      reviewStatus = {
        text: "Review Ongoing",
        color: "bg-yellow-100 text-yellow-600",
      };
    }
  }

  const cannotSetToDo = ["in progress", "paused", "to do", "cancelled"];
  const cannotSetToInProgress = [
    "in progress",
    "needs review",
    "done",
    "cancelled",
  ];
  const cannotSetToPause = [
    "to do",
    "needs review",
    "paused",
    "done",
    "cancelled",
  ];
  const cannotSetToNeedsReview = ["needs review", "to do", "done", "cancelled"];
  const cannotSetToDone = [
    "to do",
    "in progress",
    "paused",
    "cancelled",
    "done",
  ];

  const taskName =
    version > 0 ? (
      <div>
        {titleCase(`${task_name} `)}{" "}
        <span className=" text-xs text-slate-500">(v{version})</span>
      </div>
    ) : (
      <div>{titleCase(task_name)}</div>
    );

  return (
    <div
      className={`bg-white-primary system-padding cursor-grab shadow-md min-h-[250px] transition-all duration-300 rounded-sm flex-col-start gap-2  ${
        isDragging && "hidden"
      } ${className}`}
      ref={drag as unknown as LegacyRef<HTMLDivElement> | undefined}
    >
      <div className="w-full flex-row-between-center">
        <div className="flex-row-start-center">
          <Badge className={`${phaseColor?.dark} ${phaseColor?.light} `}>
            {titleCase(phase_category)}
          </Badge>
          {isInNeedsReview && (
            <Badge className={` ${reviewStatus.color}`}>
              {reviewStatus.text}
            </Badge>
          )}
        </div>

        <div className="rotate-90">
          <CustomDropdownMenu
            menuLabel={"Actions"}
            btnSrc="/button-svgs/table-action-threedot.svg"
            btnSrcAlt="Task Menu"
            items={[
              {
                label: "View Task",
                iconSrc: "/button-svgs/table-action-view.svg",
                className: "",
                alt: "View Task Button",
                isDialog: false,
                href: detailsLink,
              },
              {
                label: "Update Task",
                iconSrc: "/button-svgs/table-action-edit.svg",
                className: "",
                alt: "Edit Task Button",
                isDialog: false,
                onClick: () => onUpdateTaskClick(),
              },

              ...(!cannotSetToDo.includes(status)
                ? [
                    {
                      label: "Create New Version",
                      iconSrc: "/button-svgs/checklist.svg",
                      className: "",
                      alt: "Set to To do  Task Button",
                      isDialog: false,
                      onClick: () => {
                        moveTask({
                          id: id,
                          droppedStatus: "to do",
                          recentStatus: status,
                        });
                      },
                    },
                  ]
                : []),

              ...(!cannotSetToInProgress.includes(status)
                ? [
                    {
                      label: "Set to ongoing",
                      iconSrc: "/button-svgs/table-action-continue.svg",
                      className: "",
                      alt: "Continue/Set to Ongoing Task Button",
                      isDialog: false,
                      onClick: () => {
                        moveTask({
                          id: id,
                          droppedStatus: "in progress",
                          recentStatus: status,
                        });
                      },
                    },
                  ]
                : []),

              ...(!cannotSetToPause.includes(status)
                ? [
                    {
                      label: "Set To On-hold",
                      iconSrc: "/button-svgs/table-action-onhold.svg",
                      className: "",
                      alt: "Set to Onhold Task Button",
                      isDialog: false,
                      onClick: () => {
                        moveTask({
                          id: id,
                          droppedStatus: "paused",
                          recentStatus: status,
                        });
                      },
                    },
                  ]
                : []),

              ...(!cannotSetToNeedsReview.includes(status)
                ? [
                    {
                      label: "Set To Review",
                      iconSrc: "/button-svgs/review.svg",
                      className: "",
                      alt: "Set to Review Task Button",
                      isDialog: false,
                      onClick: () => {
                        moveTask({
                          id: id,
                          droppedStatus: "needs review",
                          recentStatus: status,
                        });
                      },
                    },
                  ]
                : []),

              ...(!cannotSetToDone.includes(status)
                ? [
                    {
                      label: "Finish",
                      iconSrc: "/button-svgs/table-action-finish.svg",
                      className: "",
                      alt: "Set to Done or Finish Task Button",
                      isDialog: false,
                      onClick: () => {
                        moveTask({
                          id: id,
                          droppedStatus: "done",
                          recentStatus: status,
                        });
                      },
                    },
                  ]
                : []),
              ...(status === "to do"
                ? [
                    {
                      label: "Cancel",
                      iconSrc: "/button-svgs/table-action-cancel.svg",
                      className: "",
                      alt: "Set to Cancel  Task Button",
                      isDialog: false,
                      onClick: () => {
                        moveTask({
                          id: id,
                          droppedStatus: "cancelled",
                          recentStatus: status,
                        });
                      },
                    },
                  ]
                : []),
            ]}
            btnVariant={"ghost"}
          />
        </div>
      </div>

      <div className="flex-col-start w-full mt-2 space-y-1">
        {taskName}
        <h2 className="text-sm">{task_description}</h2>
      </div>

      <div className="flex-row-start w-full gap-2 text-base mt-4">
        {status === "done" && (
          <IconWithTextInfo
            icon={<IoTimerOutline />}
            text={totalDurationText}
            className={"text-slate-500"}
          />
        )}

        {shouldDisplayRemaining && (
          <IconWithTextInfo
            icon={<IoTimer />}
            text={remainingDurationText}
            className={"text-slate-500"}
          />
        )}
      </div>

      {isStatusNeedsReview && (
        <div className="flex-row-start w-full gap-2 text-gray-400 text-base">
          <IconWithTextInfo
            icon={<LuFileCheck />}
            text={approvedFilesCountText}
            className={"text-green-700"}
          />
          <IconWithTextInfo
            icon={<LuFileX />}
            text={rejectedFilesCountText}
            className={"text-red-700"}
          />
        </div>
      )}
      <div className="flex-grow" />

      <Separator className="mt-2" />

      <div className="w-full flex-row-between-center lg:text-base  ">
        <div>
          <div
            onClick={onMembersClick}
            className="flex-row-start-center gap-1 cursor-pointer"
          >
            {hasMembers &&
              assigned_team_members.map((member, index) => {
                {
                  if (index > 2) {
                    return;
                  }
                  if (index === 2) {
                    return (
                      <Avatar
                        key={index} // Use unique key if possible
                        className="h-8 w-8 rounded-full border-[1px]"
                      >
                        <AvatarFallback className="bg-transparent text-xs">
                          + {assigned_team_members.length - 2}
                        </AvatarFallback>
                      </Avatar>
                    );
                  }
                }
                return (
                  <Profile
                    key={index}
                    profileName={member.full_name}
                    profileSrc={member.profile_picture_url}
                    variant={"sm"}
                  />
                );
              })}
          </div>

          {!hasMembers && (
            <Button
              variant={"outline"}
              size={"sm"}
              className="text-xs"
              onClick={onAssignMembersClick}
            >
              Assign
            </Button>
          )}
        </div>

        <div className="flex-row-start-center gap-2 text-gray-400">
          <div
            className="flex-row-start-center gap-1 cursor-pointer "
            onClick={onMessagesClick}
          >
            <LuMessageSquareMore />
            {task_comments_count}
          </div>
          <div
            className="flex-row-start-center gap-1 cursor-pointer"
            onClick={goToFiles}
          >
            <SlPaperClip />
            {task_files_count}
          </div>
        </div>
      </div>
    </div>
  );
}
