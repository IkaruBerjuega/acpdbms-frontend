import { DragSourceMonitor, useDrag } from "react-dnd";
import { Badge } from "../../badge";
import { Separator } from "../../separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { getInitialsFallback, titleCase } from "@/lib/utils";
import { LuFileCheck, LuFileX, LuMessageSquareMore } from "react-icons/lu";
import { SlPaperClip } from "react-icons/sl";
import { IoIosTimer } from "react-icons/io";
import { IoTimer } from "react-icons/io5";
import { GrNext } from "react-icons/gr";
import Link from "next/link";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useSelectedTaskStatus } from "@/hooks/states/create-store";
import { TaskItem, TaskItemProps, TaskStatuses } from "@/lib/tasks-definitions";
import { ItemTypes } from "@/lib/definitions";
import { Button } from "../../button";
import { CustomDropdownMenu } from "../../dropdown-menu";

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
  moveTask: ({
    id,
    droppedStatus,
    recentStatus,
  }: {
    id: number;
    droppedStatus: TaskStatuses;
    recentStatus: TaskStatuses;
  }) => void;
  className: string;
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
    { isDragging: boolean } // Collected props type
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
  const detailsLink = `tasks/${id}/details`;

  const { params } = useQueryParams();
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

  function onFilesClick() {
    if (isInNeedsReview) {
      goTo(`tasks/${id}/review-files?view_files=true`);
      return;
    }

    createQueryString("sheet", "files");
    createQueryString("taskId", String(id));
  }

  function onMessagesClick() {
    createQueryString("sheet", "comments");
    createQueryString("taskId", String(id));
  }

  const hasMembers = assigned_team_members.length > 0;

  const approvedFiles = approved_files_count !== null;
  const rejectedFiles = rejected_files_count !== null;

  const isStatusNeedsReview = isInNeedsReview && approvedFiles && rejectedFiles;

  const approvedFilesCountText = `${approved_files_count} accepted`;
  const rejectedFilesCountText = `${approved_files_count} rejected`;

  return (
    <div
      className={`bg-white-primary system-padding cursor-grab shadow-md min-h-[250px] transition-all duration-300 rounded-sm flex-col-start gap-2  ${
        isDragging && "hidden"
      } ${className}`}
      ref={drag as any}
    >
      <div className="w-full flex-row-between-center">
        <Badge className={`${phaseColor?.dark} ${phaseColor?.light} `}>
          {phase_category}
        </Badge>
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
            ]}
            btnVariant={"ghost"}
          />
        </div>
      </div>

      <div className="flex-col-start w-full mt-2 space-y-1">
        <h1 className="text-base font-bold">{titleCase(task_name)}</h1>
        <h2 className="text-sm">{task_description}</h2>
      </div>

      <div className="flex-row-start w-full gap-2 text-base mt-4">
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
                const fallbackInitials = getInitialsFallback(member.full_name);
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
                  <Avatar
                    key={index} // Use unique key if possible
                    className="h-8 w-8 rounded-full border-[1px] "
                  >
                    <AvatarImage
                      src={member.profile_picture_url ?? ""}
                      alt={member.full_name}
                    />
                    <AvatarFallback>{fallbackInitials}</AvatarFallback>
                  </Avatar>
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
            onClick={onFilesClick}
          >
            <SlPaperClip />
            {task_files_count}
          </div>
        </div>
      </div>
    </div>
  );
}
