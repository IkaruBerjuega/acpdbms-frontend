"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../../button";
import { AiOutlineMessage, AiOutlineTeam } from "react-icons/ai";
import {
  useGetSpecificTask,
  useGetSpecificTaskVersions,
} from "@/hooks/api-calls/employee/use-tasks";
import { Badge } from "../../../badge";
import { IoTimer } from "react-icons/io5";
import { IoIosTimer } from "react-icons/io";
import { SlPaperClip } from "react-icons/sl";
import { GrNext } from "react-icons/gr";
import { useSelectedTaskStatus } from "@/hooks/states/create-store";

export default function TaskDetailsVersions({ taskId }: { taskId: string }) {
  // setup for adding params when the button for viewing  the phases is the one used
  const { paramsKey, params } = useQueryParams();
  const { replace } = useRouter();

  const pathname = usePathname();

  const { data: taskDetails } = useGetSpecificTask({ taskId: taskId });
  const { data: taskVersions, isLoading } = useGetSpecificTaskVersions({
    taskId: taskId,
  });

  const displayRemaining = taskDetails?.status === "to do";

  const { setData } = useSelectedTaskStatus();

  const versions = taskVersions?.versions.sort((a, b) => b.version - a.version);
  const lastVersionNumber =
    versions && versions.length > 0
      ? versions.reduce(
          (max, version) => Math.max(max, version.version),
          versions[0].version
        )
      : 1;

  const openMember = () => {
    params.set("sheet", "members");
    replace(`${pathname}?${params.toString()}`);
  };

  const openFiles = ({ version }: { version: string }) => {
    params.set("sheet", "files");
    params.set("version", version);
    setData([taskDetails?.status]);
    replace(`${pathname}?${params.toString()}`);
  };

  const openMessages = () => {
    params.set("sheet", "comments");
    replace(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex-grow overflow-y-auto min-h-0 bg-white-primary rounded-md shadow-md system-padding flex-col-start gap-5">
        Loading...
      </div>
    );
  }

  if (!versions) {
    return (
      <div className="flex-grow overflow-y-auto min-h-0 bg-white-primary rounded-md shadow-md system-padding flex-col-start gap-5">
        No Versions Yet
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto min-h-0 bg-white-primary rounded-md shadow-md system-padding flex-col-start gap-5">
      {/* Header */}
      <div className="w-full flex-col-start ">
        <div className="flex-row-between-start w-full">
          <div className="w-full flex-col-start gap-4">
            <div className="flex-row-start gap-2">
              <Badge className="w-auto">{taskDetails?.phase_category}</Badge>
              <Badge className="w-auto">{taskDetails?.status}</Badge>
            </div>
            <div className="w-full text-2xl font-bold">
              {taskDetails?.task_name}
            </div>
            <div></div>
          </div>
          <div className="flex-row-end-center w-full gap-2">
            {/* Members  */}
            <Button
              className="flex-row-center gap-2"
              variant={"outline"}
              onClick={openMember}
            >
              <AiOutlineTeam />
              <span>Members</span>
            </Button>
            {/* Messages */}
            <Button
              className="flex-row-center gap-2"
              variant={"outline"}
              onClick={openMessages}
            >
              <AiOutlineMessage />
              <span>Comments</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-col-start w-full">
        {versions?.map((version, index) => {
          const isLastIndex = lastVersionNumber === version.version;
          const isFirstVersion = version.version === 1;
          const startDate = new Date(version.start_date)
            .toISOString()
            .slice(0, 10);
          const finishDate = version.finish_date
            ? new Date(version.finish_date).toISOString().slice(0, 10)
            : undefined;
          const duration = version.duration;
          const remainingDuration = version.remaining_duration;
          const fileCount = version.task_files.length;

          return (
            <div
              key={index}
              className="w-full flex flex-row  min-h-[100px] px-2 gap-4 "
            >
              <div className="relative flex flex-col items-center pt-1">
                {/* Dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full  ${
                    !isLastIndex ? "bg-gray-300" : "bg-black-secondary"
                  }`}
                />

                {/* Tail (Render when not first version) */}
                {!isFirstVersion && (
                  <div
                    className={`border-l border-[1px] h-full ${
                      !isLastIndex
                        ? "border-gray-300"
                        : "border-black-secondary"
                    }`}
                  />
                )}
              </div>

              <div className="flex-grow flex-col-start gap-2 text-sm  ">
                <div className="w-full flex-row-start gap-1 text-slate-500  leading-tight">
                  {startDate && (
                    <>
                      <span>Started in</span>
                      <span className="font-semibold">{startDate}</span>
                    </>
                  )}
                  {finishDate && (
                    <>
                      <span>-</span>
                      <span>{finishDate}</span>
                    </>
                  )}
                </div>
                <div className="flex-grow flex-row-between-center   p-6 ">
                  <div>
                    <h1 className="text-lg font-semibold">
                      {version.task_description}
                    </h1>
                    <p className="text-sm text-slate-600">
                      Version {version.version}
                    </p>
                  </div>

                  <div className="text-sm flex-row-start gap-4 text-slate-500 ">
                    <div className="flex-row-start-center  gap-1">
                      <IoIosTimer className="text-lg" />
                      <span>{duration} days total</span>
                    </div>
                    {displayRemaining && (
                      <div className="flex-row-start-center  gap-1 ">
                        <IoTimer className="text-lg" />
                        <span>{remainingDuration} day(s) remaining</span>
                      </div>
                    )}
                    <div className="flex-row-start-center  gap-1 ">
                      <SlPaperClip className="text-lg" />
                      <span>{fileCount} files </span>
                    </div>
                    <GrNext
                      className="cursor-pointer hover:text-black-primary text-lg"
                      onClick={() => {
                        openFiles({ version: String(version.version) });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
