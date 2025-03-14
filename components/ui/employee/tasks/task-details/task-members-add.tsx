"use client";

import { useMemo, useState } from "react";
import { useTeamDetailsForDashboard } from "@/hooks/general/use-project";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import {
  useGetTaskAssignedMembers,
  useTaskActions,
} from "@/hooks/api-calls/employee/use-tasks";
import { SearchInput } from "../../../input";
import { IoSearch } from "react-icons/io5";
import { BtnDialog, ButtonIconTooltipDialog } from "../../../button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../avatar";
import { getInitialsFallback } from "@/lib/utils";
import { FaCheck } from "react-icons/fa6";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AssignMembers({ taskId }: { taskId: string }) {
  let { data: projectSelected } = useProjectSelectStore();
  let projectId = projectSelected[0]?.projectId;

  //api calls setup
  const { data: teamMembers } = useTeamDetailsForDashboard(projectId);
  const { data: taskMembers } = useGetTaskAssignedMembers({ taskId: taskId });

  let projectMembers = teamMembers?.team_members;

  const availableMembers = projectMembers?.filter((member) => {
    return !taskMembers?.some(
      (taskMember) => taskMember.team_member_id === member.teammember_id
    );
  });

  const { assignMultipleEmployeesToTask } = useTaskActions({
    projectId: projectId,
    taskId: taskId,
  });

  const { mutate, isLoading } = assignMultipleEmployeesToTask;
  const [selectedTeamMemberIds, setSelectedTeamMemberIds] = useState<number[]>(
    []
  );

  const queryClient = useQueryClient();

  const [nameFilter, setNameFilter] = useState<string | undefined>("");

  const handleAssignTask = async () => {
    //send the form
    mutate(
      { team_member_ids: selectedTeamMemberIds }, // Actual request body
      {
        onSuccess: (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Assign Task",
            description: response.message || "Members Assigned Successfully",
          });
          queryClient.invalidateQueries({ queryKey: ["task-members", taskId] });
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Assign Task",
            description:
              error.message || "There was an error submitting the form",
          });
        },
      }
    );
    setSelectedTeamMemberIds([]);
  };

  const filteredMembers = useMemo(() => {
    if (!availableMembers) return;
    if (!nameFilter) return availableMembers;

    return availableMembers.filter((member) =>
      member.full_name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }, [nameFilter, availableMembers]);

  const handleSelectTeamMember = (isSelected: boolean, memberId: number) => {
    setSelectedTeamMemberIds((prev) => {
      if (!isSelected) {
        return [...prev, memberId]; // Add member to selection
      } else {
        return prev.filter((id) => id !== memberId); // Remove member from selection
      }
    });
  };

  return (
    <div className="w-full h-full space-y-4">
      <SearchInput
        onChange={(e) => {
          let value = e.currentTarget.value;
          setNameFilter(value);
        }}
        icon={<IoSearch />}
        placeholder="Search name"
      />
      <div className="w-full space-y-2">
        {filteredMembers?.map((member, index) => {
          let selected = selectedTeamMemberIds.includes(member.teammember_id);
          return (
            <div
              key={index}
              onClick={() => {
                handleSelectTeamMember(selected, member.teammember_id);
              }}
              className="py-2 px-4 flex-row-start-center rounded-md border-[1px] hover:bg-white-secondary cursor-pointer gap-4 transition-all duration-300"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={member.profile_picture_url}
                  alt={member.full_name}
                />
                <AvatarFallback className="rounded-full text-black-primary text-sm">
                  {getInitialsFallback(member.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-col-start">
                <span className="text-sm">{member.full_name}</span>
                <span className="text-xs text-slate-500">{member.role}</span>
                <span className="text-xs">
                  {member.has_task && "-has task"}
                </span>
              </div>
              <div className="flex-grow flex-row-end-center">
                <FaCheck
                  className={`text-green-600 ${selected ? "flex" : "hidden"}`}
                />
              </div>
            </div>
          );
        })}
        <div className="w-full flex-row-end-center">
          <BtnDialog
            btnTitle={"Submit"}
            isLoading={isLoading}
            alt={"Submit Button"}
            dialogTitle={"Assign Task"}
            dialogDescription={
              "Do you confirm to assign the selected project members to this task?"
            }
            onClick={handleAssignTask}
            submitType={"submit"}
            submitTitle="Confirm"
          />
        </div>
      </div>
    </div>
  );
}
