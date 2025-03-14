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

export default function TaskDetailsVersions({
  taskId,
  paramKey,
}: {
  taskId: string;
  paramKey: "members" | "assign_members";
}) {
  // setup for adding params when the button for viewing  the phases is the one used
  const { paramsKey, params } = useQueryParams();
  const { replace } = useRouter();

  const isOpen = paramsKey[paramKey] === "true";
  const pathname = usePathname();

  const openMember = () => {
    params.set(paramKey, "true");
    replace(`${pathname}?${params.toString()}`);
  };

  const openFiles = () => {
    params.set("sheet", "files");
    replace(`${pathname}?${params.toString()}`);
  };

  const openMessages = () => {
    params.set("sheet", "comments");
    replace(`${pathname}?${params.toString()}`);
  };

  const { data: taskDetails } = useGetSpecificTask({ taskId: taskId });
  const { data: taskVersions, isLoading } = useGetSpecificTaskVersions({
    taskId: taskId,
  });

  let versions = taskVersions?.versions;
  let indexOfLastVersion = versions ? versions?.length - 1 : null;

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
          const isLastIndex = indexOfLastVersion === index;
          const isFirstIndex = index === 0;
          const startDate = new Date(version.start_date)
            .toISOString()
            .slice(0, 10);
          const finishDate = version.finish_date
            ? new Date(version.finish_date).toISOString().slice(0, 10)
            : undefined;
          const duration = version.duration;
          const remainingDuration = version.remaining_duration[0];
          const fileCount = version.task_files.length;

          return (
            <div
              key={index}
              className="w-full flex flex-row  min-h-[100px] px-2 gap-4 "
            >
              <div className="flex-row-center-start relative ">
                <div
                  className={`h-2.5 w-2.5 rounded-full  absolute mt-1 ${
                    isLastIndex ? "bg-gray-300" : "bg-black-secondary"
                  }`}
                />

                {/* render tail when not first version */}

                {!isFirstIndex && (
                  <div
                    className={`border-[1px] h-full absolute ${
                      isLastIndex ? "border-gray-300" : "border-black-secondary"
                    }`}
                  />
                )}
              </div>
              <div className="flex-grow flex-col-start gap-2 text-sm ">
                <div className="w-full flex-row-start gap-1 text-slate-500  ">
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
                <div className="flex-grow flex-row-between-center border-b-[1px]  p-6 ">
                  <div>
                    <h1 className="text-lg font-semibold">
                      {version.task_description}
                    </h1>
                    <p className="text-sm text-slate-600">
                      Version {version.version}
                    </p>
                  </div>

                  <div className="text-sm flex-row-start gap-2 text-slate-500 ">
                    <div className="flex-row-start-center  gap-2 ">
                      <IoIosTimer className="text-lg" />
                      <span>{duration} days total</span>
                    </div>
                    <div className="flex-row-start-center  gap-2 ">
                      <IoTimer className="text-lg" />
                      <span>{remainingDuration} days remaining</span>
                    </div>
                    <div className="flex-row-start-center  gap-2 ">
                      <SlPaperClip className="text-lg" />
                      <span>{fileCount} files </span>
                    </div>

                    <GrNext
                      className="cursor-pointer hover:text-black-primary text-lg"
                      onClick={openFiles}
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
