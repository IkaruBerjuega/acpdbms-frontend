import { ItemTypes, TaskItem, TaskItemProps } from "@/lib/definitions";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { Badge } from "../../badge";
import { Separator } from "../../separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { getInitialsFallback } from "@/lib/utils";
import { LuMessageSquareMore } from "react-icons/lu";
import { SlPaperClip } from "react-icons/sl";
import { IoIosTimer } from "react-icons/io";
import { IoTimer } from "react-icons/io5";
import { GrNext } from "react-icons/gr";
import Link from "next/link";

interface TaskCardProps extends TaskItemProps {
  moveTask: ({
    id,
    droppedStatus,
  }: {
    id: number;
    droppedStatus: string;
  }) => void;
  className: string;
}

export default function TaskCard(props: TaskCardProps) {
  const {
    id = 0, // Default values applied here instead
    phase_category = "",
    task_comments_count = 0,
    versions = [],
    status = "to do",
    task_name = "Unnamed Task",
    task_description = "",
    total_duration,
    assigned_team_members = [],
    phaseColor,
    className,
    moveTask = () => {},
  } = props || {};

  let lastIndex = versions.length - 1;
  let latestVer = versions[lastIndex];

  const [{ isDragging }, drag] = useDrag<
    TaskItem, // Dragged item type
    { columnStatus: string }, // Drop result type
    { isDragging: boolean } // Collected props type
  >(() => {
    const item: TaskItemProps = {
      id,
      phase_category,
      task_comments_count,
      versions,
      status,
      task_name,
      total_duration,
      task_description,
      assigned_team_members,
      phaseColor,
    };
    return {
      type: ItemTypes.TASK,
      item,
      end: (
        item: TaskItem,
        monitor: DragSourceMonitor<TaskItem, { columnStatus: string }>
      ) => {
        const dropResult = monitor.getDropResult<{ columnStatus: string }>();
        if (item && dropResult) {
          moveTask({ id: item.id, droppedStatus: dropResult.columnStatus });
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
    typeof latestVer.remaining_duration !== "string"
      ? Number(latestVer.remaining_duration?.toFixed(0))
      : Number(latestVer.remaining_duration[0]);

  let totalDurationText = `${totalDuration} days`;
  let remainingDurationText =
    remainingDuration < 0
      ? `${Math.abs(remainingDuration)} day(s) overdue`
      : `${remainingDuration} days remaining`;

  let isDone = status !== "done";
  const detailsLink = `tasks/${id}/details`;

  return (
    <div
      className={`bg-white-primary system-padding cursor-grab shadow-md transition-all duration-300 rounded-sm flex-col-start gap-2 ${
        isDragging && "hidden"
      } ${className}`}
      ref={drag as any}
    >
      <div className="w-full flex-row-between-center">
        <Badge className={`${phaseColor?.dark} ${phaseColor?.light} `}>
          {phase_category}
        </Badge>
      </div>
      <div className="flex-col-start w-full mt-2 space-y-1">
        <h1 className="text-sm font-bold">{task_name}</h1>
        <h2 className="text-sm">{task_description}</h2>
      </div>
      <div className="flex-col-start w-full gap-1 text-gray-400 text-sm">
        <div className="flex-row-start-center w-full gap-2 ">
          <IoIosTimer />
          <span>{totalDurationText}</span>
        </div>
        {isDone && (
          <div className="flex-row-start-center w-full gap-2 ">
            <IoTimer />
            <span>{remainingDurationText}</span>
          </div>
        )}
      </div>

      <Separator className="mt-2" />
      <div className="w-full flex-row-between-center lg:text-base  ">
        <div className="flex-row-start-center gap-[2px] cursor-pointer">
          {assigned_team_members?.length > 0 ? (
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
            })
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>

        <div className="flex-row-start-center gap-1 text-gray-400">
          <div className="flex-row-start-center gap-1 cursor-pointer ">
            <LuMessageSquareMore />
            {task_comments_count}
          </div>
          <div className="flex-row-start-center gap-1 cursor-pointer">
            <SlPaperClip />
            {latestVer.task_files_count}
          </div>
          <Link href={detailsLink}>
            <GrNext className="cursor-pointer hover:text-black-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
