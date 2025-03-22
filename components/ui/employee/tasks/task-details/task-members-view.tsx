import {
  useGetTaskAssignedMembers,
  useTaskActions,
} from "@/hooks/api-calls/employee/use-tasks";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonIconTooltipDialog } from "../../../button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../avatar";
import { getInitialsFallback } from "@/lib/utils";
import { SearchInput } from "@/components/ui/input";
import { IoSearch } from "react-icons/io5";
import { useMemo, useState } from "react";

export default function Members({ taskId }: { taskId?: string }) {
  if (!taskId) return;

  const { data: membersAssigned } = useGetTaskAssignedMembers({
    taskId: taskId,
  });

  const { data: projectSelected } = useProjectSelectStore();
  const projectId = projectSelected[0]?.projectId;

  const queryClient = useQueryClient();

  const { cancelTaskAssignment } = useTaskActions({
    projectId: projectId,
    taskId: taskId,
  });

  const handleCancelTaskAssignment = (assignment_id: number) => {
    cancelTaskAssignment.mutate(
      {
        assignment_id: assignment_id,
      },
      {
        onSuccess: async (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Cancel Task Assigment",
            description:
              response.message || "Successfully cancelled task assignment",
          });
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["task-members", taskId],
            }),
            queryClient.invalidateQueries({
              queryKey: ["tasks", projectId],
            }),
          ]);
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Cancel Task Assigment",
            description:
              error.message || "There was an error submitting the form",
          });
        },
      }
    );
  };

  const [nameFilter, setNameFilter] = useState<string | undefined>("");

  const filteredMembers = useMemo(() => {
    if (!membersAssigned) return;
    if (!nameFilter) return membersAssigned;

    return membersAssigned.filter((member) =>
      member.team_member_name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }, [nameFilter, membersAssigned]);

  if (filteredMembers?.length === 0 || !filteredMembers) {
    return (
      <div className="flex-grow  flex-col-center text-sm text-slate-500">
        No assigned members
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex-col-start gap-4 min-h-0 overflow-y-auto">
      <SearchInput
        onChange={(e) => {
          const value = e.currentTarget.value;
          setNameFilter(value);
        }}
        icon={<IoSearch />}
        placeholder="Search name "
      />
      <div className="w-full flex-col-start gap-2">
        {" "}
        {filteredMembers?.map((member, index) => {
          return (
            <div
              key={index}
              className="py-2 px-4 flex-row-start-center rounded-md border-[1px]  cursor-pointer gap-4 transition-all duration-300"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={member.profile_picture_url}
                  alt={member.team_member_name}
                />
                <AvatarFallback className="rounded-full text-black-primary text-sm">
                  {getInitialsFallback(member.team_member_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-col-start">
                <span className="text-sm">{member.team_member_name}</span>
                <span className="text-xs text-slate-500">{member.role}</span>
              </div>
              <div className="flex-grow flex-row-end-center">
                <ButtonIconTooltipDialog
                  iconSrc={"/button-svgs/table-action-remove.svg"}
                  alt={"Deactivate account button"}
                  tooltipContent={"Remove Task Member"}
                  dialogTitle={"Remove Task Member"}
                  dialogDescription={
                    "Are you sure you want to remove this task member?"
                  }
                  dialogContent={
                    <div className="flex-col-start text-sm">
                      <span>Name: {member.team_member_name}</span>
                      <span>Role: {member.role}</span>
                    </div>
                  }
                  submitType={"button"}
                  submitTitle="Confirm"
                  onClick={() => handleCancelTaskAssignment(member.id)}
                  className="border-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
