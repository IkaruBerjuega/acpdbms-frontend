"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../button";
import { IoFilterSharp } from "react-icons/io5";
import { useCallback, useMemo } from "react";
import {
  usePhases,
  useTeamDetailsForDashboard,
} from "@/hooks/general/use-project";
import { AiOutlineTeam } from "react-icons/ai";
import { Checkbox } from "../../checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { getInitialsFallback, titleCase } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import Image from "next/image";
import { phasesIconSrc } from "@/lib/srcs";
import { Calendar, X } from "lucide-react";

type TaskFilters = "member_filters" | "phases_filters" | "date_filter";

export function TaskFilters() {
  const { params, paramsKey } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createQueryString = useCallback(
    ({ filter_type, value }: { filter_type: TaskFilters; value: string }) => {
      const canMultipleFilters = ["member_filters", "phases_filters"];
      let newFilterParams = "";

      if (canMultipleFilters.includes(filter_type)) {
        const existingValue = paramsKey[filter_type] ?? "";
        const filterValues = existingValue.split("_").filter(Boolean);

        // Avoid adding duplicate values
        if (!filterValues.includes(value)) {
          filterValues.push(value);
        }

        newFilterParams = filterValues.join("_");
      } else {
        newFilterParams = value;
      }

      params.set(filter_type, newFilterParams);
      replace(`${pathname}?${params.toString()}`);
    },
    [params, paramsKey, pathname]
  );

  const removeFilter = useCallback(
    ({ filter_type, value }: { filter_type: TaskFilters; value: string }) => {
      const canMultipleFilters = ["member_filters", "phases_filters"];
      let newFilterParams = "";

      if (canMultipleFilters.includes(filter_type)) {
        const existingValue = paramsKey[filter_type] ?? "";
        const filterValues = existingValue.split("_").filter(Boolean);

        // Catch if value is existing
        if (filterValues.includes(value)) {
          const indexToRemove = filterValues.findIndex(
            (existinVal) => value === existinVal
          );

          //remove the value from the existing filter values as it is already checked included
          filterValues.splice(indexToRemove, 1);
        }

        newFilterParams = filterValues.join("_");

        if (newFilterParams.length > 0) {
          params.set(filter_type, newFilterParams);
        } else {
          params.delete(filter_type);
        }
      } else {
        params.delete(filter_type);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [params, paramsKey, pathname]
  );

  const addOrRemoveFilterByCheckbox = (
    filterType: TaskFilters,
    checkedState: CheckedState,
    value: string
  ) => {
    if (checkedState) {
      createQueryString({
        filter_type: filterType,
        value: value,
      });

      return;
    }

    removeFilter({ filter_type: filterType, value: value });
  };

  //for checked state
  const filteredMembers = useMemo(() => {
    const filteredMembersArray = paramsKey["member_filters"]?.split("_");

    return filteredMembersArray || [];
  }, [paramsKey]);

  const isMemberFiltered = (memberName: string) => {
    return filteredMembers?.includes(memberName);
  };

  const filteredPhases = useMemo(() => {
    const filteredPhasesArr = paramsKey["phases_filters"]?.split("_");

    return filteredPhasesArr || [];
  }, [paramsKey]);

  const isPhaseFiltered = (phase: string) => {
    return filteredPhases?.includes(phase);
  };

  const date = useMemo(() => {
    return paramsKey["date_filter"] ?? "";
  }, [paramsKey]);

  const isDateFilterDueToday = date === "due_today";
  const isDateFilterThreeDays = date === "due_in_3_days";
  const isDateFilterWeek = date === "due_in_7_days";
  const isDateFilterTwoWeeks = date === "due_in_14_days";
  const isDateFilterMonth = date === "due_in_30_days";

  const projectId = paramsKey["projectId"]?.split("_")[0] ?? "";

  //team
  const { data: teamResponse } = useTeamDetailsForDashboard(projectId);
  const team = teamResponse?.team_members;

  //project id based phases
  const { data: phasesResponse } = usePhases(projectId);

  const isTasksViewAssigned = paramsKey["view"] === "assigned";

  return (
    <div className="flex-grow overflow-y-auto min-h-0 flex-col-start gap-6 text-slate-600 mt-2">
      {/* Members */}

      {!isTasksViewAssigned && (
        <div className="flex-col-start gap-4">
          <div className="flex-row-start-center gap-2">
            <AiOutlineTeam className="h-5 w-5 text-maroon-600 mr-1" />
            <p className="text-base">Members</p>
          </div>
          <div className="flex-col-start gap-2">
            {team?.map((member) => {
              return (
                <div
                  className="flex-row-start-center p-1 space-x-4"
                  key={member.user_id}
                >
                  <Checkbox
                    checked={isMemberFiltered(member.full_name)}
                    onCheckedChange={(value) =>
                      addOrRemoveFilterByCheckbox(
                        "member_filters",
                        value,
                        member.full_name
                      )
                    }
                  />
                  <div className="flex-row-start-center gap-3">
                    <div className="flex-row-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profile_picture_url} />
                        <AvatarFallback className="text-xs">
                          {getInitialsFallback(member.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-col-start">
                      <p className="text-sm">{member.full_name}</p>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phases */}
      <div className="flex-col-start gap-4">
        <div className="flex-row-start-center gap-2">
          <Image width={20} height={20} alt="phases-icon" src={phasesIconSrc} />
          <p className="text-base">Phases</p>
        </div>
        <div className="flex-col-start gap-2">
          {phasesResponse?.map((phase) => {
            return (
              <div
                className="flex-row-start-center p-1 space-x-4"
                key={phase.id}
              >
                <Checkbox
                  checked={isPhaseFiltered(phase.category)}
                  onCheckedChange={(value) =>
                    addOrRemoveFilterByCheckbox(
                      "phases_filters",
                      value,
                      phase.category
                    )
                  }
                />
                <p className="text-sm">{phase.category}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date */}
      <div className="flex-col-start gap-4">
        <div className="flex-row-start-center gap-2">
          <Calendar className="h-5 w-5" />
          <p className="text-base">Due Date</p>
        </div>
        <div className="flex-col-start gap-2">
          <div className="flex-row-start-center p-1 space-x-4">
            <Checkbox
              checked={isDateFilterDueToday}
              onCheckedChange={(value) =>
                addOrRemoveFilterByCheckbox("date_filter", value, "due_today")
              }
            />
            <p className="text-sm">Due Today</p>
          </div>
          <div className="flex-row-start-center p-1 space-x-4">
            <Checkbox
              checked={isDateFilterThreeDays}
              onCheckedChange={(value) =>
                addOrRemoveFilterByCheckbox(
                  "date_filter",
                  value,
                  "due_in_3_days"
                )
              }
            />
            <p className="text-sm">Due in three days</p>
          </div>
          <div className="flex-row-start-center p-1 space-x-4">
            <Checkbox
              checked={isDateFilterWeek}
              onCheckedChange={(value) =>
                addOrRemoveFilterByCheckbox(
                  "date_filter",
                  value,
                  "due_in_7_days"
                )
              }
            />
            <p className="text-sm">Due in a week</p>
          </div>
          <div className="flex-row-start-center p-1 space-x-4">
            <Checkbox
              checked={isDateFilterTwoWeeks}
              onCheckedChange={(value) =>
                addOrRemoveFilterByCheckbox(
                  "date_filter",
                  value,
                  "due_in_14_days"
                )
              }
            />
            <p className="text-sm">Due in two weeks</p>
          </div>
          <div className="flex-row-start-center p-1 space-x-4">
            <Checkbox
              checked={isDateFilterMonth}
              onCheckedChange={(value) =>
                addOrRemoveFilterByCheckbox(
                  "date_filter",
                  value,
                  "due_in_30_days"
                )
              }
            />
            <p className="text-sm">Due in a month</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ButtonTasksDndFilter() {
  const { params, paramsKey } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const filteredMembersCount = useMemo(() => {
    const filteredMembersArray = paramsKey["member_filters"]?.split("_");

    return filteredMembersArray?.length;
  }, [paramsKey]);

  const filteredPhasesCount = useMemo(() => {
    const filteredPhasesArr = paramsKey["phases_filters"]?.split("_");

    return filteredPhasesArr?.length;
  }, [paramsKey]);

  const date = useMemo(() => {
    return titleCase(paramsKey["date_filter"]?.split("_").join(" ")) ?? "";
  }, [paramsKey]);

  const hasFilterParams = useMemo(() => {
    if (
      paramsKey?.["date_filter"] != null ||
      paramsKey?.["member_filters"] != null ||
      paramsKey?.["phases_filters"] != null
    ) {
      return true;
    }
    return false;
  }, [paramsKey]);

  const openFilterSheet = useCallback(() => {
    params.set("sheet", "filters");
    replace(`${pathname}?${params.toString()}`);
  }, [params, pathname, replace]);

  const clearAllFilters = useCallback(() => {
    params.delete("date_filter");
    params.delete("member_filters");
    params.delete("phases_filters");
    replace(`${pathname}?${params.toString()}`);
  }, [params, pathname, replace]);

  return (
    <div className="flex-row-start-center gap-1">
      <Button
        variant={"outline"}
        className={`text-sm w-fit transition-all duration-100`}
        onClick={openFilterSheet}
      >
        <IoFilterSharp className={`text-xs `} />
        Filters
        {hasFilterParams && (
          <>
            {!!filteredMembersCount && (
              <span className="text-xs p-1 bg-white-secondary rounded-md border-[1px] w-fit flex-row-start-center gap-2">
                Members
                <span className="rounded-full h-[15px] w-[15px] bg-blue-500 text-white-primary text-xs">
                  {filteredMembersCount}
                </span>
              </span>
            )}
            {!!filteredPhasesCount && (
              <span className="text-xs p-1 bg-white-secondary rounded-md border-[1px] w-fit flex-row-start-center gap-2">
                Phases
                <span className="rounded-full h-[15px] w-[15px] bg-blue-500 text-white-primary text-xs">
                  {filteredPhasesCount}
                </span>
              </span>
            )}
            {!!date && (
              <span className="text-xs p-1 bg-white-secondary rounded-md border-[1px] w-fit flex-row-start-center gap-2">
                Date
                <span className=" rounded-md px-1  bg-blue-500 text-white-primary text-xs">
                  {date}
                </span>
              </span>
            )}
          </>
        )}
      </Button>
      {hasFilterParams && (
        <Button
          variant={"ghost"}
          size={"sm"}
          className={`text-xs gap-1 p-0 px-2 border-[1px] h-8`}
          onClick={clearAllFilters}
        >
          <X className="h-3 w-3" />
          Clear All
        </Button>
      )}
    </div>
  );
}
