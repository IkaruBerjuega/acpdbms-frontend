import { Badge } from "../../badge";
import { Separator } from "../../separator";
import { titleCase } from "@/lib/utils";
import { LuFileCheck, LuFileX } from "react-icons/lu";
import { SlPaperClip } from "react-icons/sl";
import { IoTimer, IoTimerOutline } from "react-icons/io5";
import { useQueryParams } from "@/hooks/use-query-params";
import { useRouter } from "next/navigation";
import { TaskItemProps, TaskStatuses } from "@/lib/tasks-definitions";

import { Button } from "../../button";

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
  const {
    id = 0, // Default values applied here instead
    phase_category = "",
    status = "to do",
    task_name = "Unnamed Task",
    task_description = "",
    total_duration,
    approved_files_count,
    rejected_files_count,
    phaseColor,
    version,
    task_files_count,
    remaining_duration,
  } = props || {};

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

  const { paramsKey } = useQueryParams();

  const { push: goTo } = useRouter();

  function goToFiles() {
    const projectId = paramsKey["projectId"];
    if (status === "needs review") {
      goTo(
        `/client/approval/${id}/review-files?view_files=true&version=${version}&projectId=${projectId}`
      );

      return;
    }
    goTo(
      `/client/approval/${id}/view-files?view_files=true&version=${version}&projectId=${projectId}`
    );
    localStorage.setItem("selectedTaskStatus", status);
  }

  const isInNeedsReview = status === "needs review";

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
      className={`bg-white-primary system-padding  shadow-md min-h-[250px] transition-all duration-300 h-fit rounded-sm flex-col-start gap-2  `}
    >
      <div className="w-full flex-row-between-center">
        <div className="flex-row-start-center ">
          <Badge className={`${phaseColor?.dark} ${phaseColor?.light} `}>
            {phase_category}
          </Badge>
          {isInNeedsReview && (
            <Badge className={` ${reviewStatus.color} `}>
              {reviewStatus.text}
            </Badge>
          )}
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

      <IconWithTextInfo
        icon={<SlPaperClip />}
        text={`${task_files_count} files`}
        className={"text-slate-500"}
      />
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
      <div className="w-full flex-row-end-center lg:text-base  ">
        <div className="flex-row-start-center gap-2 ">
          <Button
            variant={"outline"}
            onClick={goToFiles}
            size={"sm"}
            className="text-xs"
          >
            View Files
          </Button>
        </div>
      </div>
    </div>
  );
}
