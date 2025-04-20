"use client";
import {
  useGetActivePhases,
  useGetArchivedPhases,
} from "@/hooks/general/use-project";
import { useMemo, useState } from "react";
import { SearchInput } from "../../input";
import { IoSearch } from "react-icons/io5";
import { useTaskActions } from "@/hooks/api-calls/employee/use-tasks";
import { toast } from "@/hooks/use-toast";
import { ButtonIconTooltipDialog } from "../../button";
import { Badge } from "../../badge";
import { Phase } from "@/lib/definitions";
import { useQueryClient } from "@tanstack/react-query";

interface Actions {
  id: string;
  action: "cancel" | "finish" | "archive";
}

const RenderPhasesByStatus = ({
  status,
  phases,
  handleAction,
  enableEmptyMessage = false,
}: {
  status: Phase["status"];
  phases: Phase[] | undefined;
  handleAction: ({ id, action }: Actions) => void | undefined;
  enableEmptyMessage?: boolean;
}) => {
  function getStatusBgColor(status: string) {
    if (status === "to do") return "bg-orange-100 text-orange-600";
    if (status === "in progress") return "bg-yellow-100 text-yellow-600";
    if (status === "paused") return "bg-gray-100 text-gray-600";
    if (status === "archived") return "bg-black-secondary text-white-primary";
    if (status === "finished") return "bg-green-100 text-green-600";
    if (status === "cancelled") return "bg-red-100 text-red-600";
  }

  if (!phases) return;

  const phasesLength = phases.length;

  if (phasesLength === 0) {
    if (enableEmptyMessage) {
      return <div className="text-slate-500 text-sm">No {status} phases</div>;
    }

    return;
  }

  if (!status) return;

  return (
    <div className="w-full flex-col-start gap-2 ">
      <div className="text-sm flex-col-start">
        <div>
          <Badge className={`${getStatusBgColor(status)}`}>{status}</Badge>
        </div>
      </div>
      {phases?.map((phase, index) => {
        const createdAt = new Date(phase.created_at as Date)
          .toISOString()
          .slice(0, 10);
        const finishDate = phase.finish_date
          ? new Date(phase.finish_date as Date).toISOString().slice(0, 10)
          : "";
        const DialogContent = () => {
          return <div className="text-sm">Category: {phase.category}</div>;
        };

        const isArchived = status == "archived";
        const isCancelled = status == "cancelled";
        const isFinished = status == "finished";
        const canArchive = !isCancelled && !isFinished && !isArchived;
        const canCancel = status === "to do";
        const canFinish = status === "in progress";

        return (
          <div
            key={index}
            className="p-4 flex-col-start rounded-md border-[1px]  gap-4 transition-all duration-300"
          >
            <div className="flex-row-between-center gap-1">
              <div className="flex-col-start gap-2">
                <span className="text-sm">{phase.category}</span>
                <div className="text-slate-500 flex-col-start">
                  <span className="text-xs">Created at: {createdAt}</span>
                  {finishDate && (
                    <span className="text-xs">Finished at: {finishDate}</span>
                  )}
                </div>
              </div>
              <div className="flex-row-center gap-1">
                {canArchive ? (
                  <>
                    {canCancel && (
                      <ButtonIconTooltipDialog
                        iconSrc={"/button-svgs/table-action-cancel-black.svg"}
                        alt={"cancel phase button"}
                        tooltipContent={"Cancel Phase"}
                        dialogTitle={"Cancel Phase"}
                        dialogDescription={
                          "Do you confirm to cancel this phase?"
                        }
                        dialogContent={<DialogContent />}
                        submitType={"button"}
                        submitTitle="Confirm"
                        className="border-none"
                        onClick={() =>
                          handleAction({ id: phase.id, action: "cancel" })
                        }
                      />
                    )}
                    {canFinish && (
                      <ButtonIconTooltipDialog
                        iconSrc={"/button-svgs/table-action-finish.svg"}
                        alt={"finish phase button"}
                        tooltipContent={"Finish Phase"}
                        dialogTitle={"Finish Phase"}
                        dialogDescription={
                          "Do you confirm to finish this phase?"
                        }
                        dialogContent={<DialogContent />}
                        submitType={"button"}
                        submitTitle="Confirm"
                        className="border-none"
                        onClick={() =>
                          handleAction({ id: phase.id, action: "finish" })
                        }
                      />
                    )}
                  </>
                ) : !isArchived && !isFinished ? (
                  <ButtonIconTooltipDialog
                    iconSrc={"/button-svgs/table-action-archive-black.svg"}
                    alt={"archive phase button"}
                    tooltipContent={"Archive Phase"}
                    dialogTitle={"Archive Phase"}
                    dialogDescription={"Do you confirm to archive this phase?"}
                    dialogContent={<DialogContent />}
                    submitType={"button"}
                    submitTitle="Confirm"
                    className="border-none"
                    onClick={() =>
                      handleAction({ id: phase.id, action: "archive" })
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export function PhasesArchived({ projectId }: { projectId: string }) {
  const [filter, setFilter] = useState<string | undefined>("");

  //active phases
  const { data: archivedPhases, isLoading } = useGetArchivedPhases(
    projectId,
    []
  );

  const filteredPhases = useMemo(() => {
    if (!archivedPhases) return;
    if (!filter) return archivedPhases;
    return archivedPhases.filter((phase) =>
      Object.values(phase).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, archivedPhases]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex-grow flex-col-start gap-4 w-full">
      <SearchInput
        onChange={(e) => {
          const value = e.currentTarget.value;
          setFilter(value);
        }}
        icon={<IoSearch />}
        placeholder="Search Phase"
      />
      <div className="flex-col-start gap-4 w-full ">
        <RenderPhasesByStatus
          status={"archived"}
          phases={filteredPhases}
          handleAction={() => {}}
          enableEmptyMessage={true}
        />
      </div>
    </div>
  );
}

export function PhasesActive({ projectId }: { projectId: string }) {
  const [filter, setFilter] = useState<string | undefined>("");
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | undefined>();

  //active phases
  const { data: activePhases, isLoading } = useGetActivePhases(projectId, []);

  const filteredPhases = useMemo(() => {
    if (!activePhases) return;
    if (!filter) return activePhases;
    return activePhases.filter((phase) =>
      Object.values(phase).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, activePhases]);

  //by status
  const toDo = filteredPhases?.filter((phase) => phase.status === "to do");
  const inProgress = filteredPhases?.filter(
    (phase) => phase.status === "in progress"
  );
  const cancelled = filteredPhases?.filter(
    (phase) => phase.status === "cancelled"
  );
  const paused = filteredPhases?.filter((phase) => phase.status === "paused");
  const archived = filteredPhases?.filter(
    (phase) => phase.status === "archived"
  );
  const finished = filteredPhases?.filter(
    (phase) => phase.status === "finished"
  );

  //api actions
  const { cancelPhase, finishPhase, archivePhase } = useTaskActions({
    phaseId: selectedPhaseId,
    projectId: projectId,
  });

  const actionConfig = {
    cancel: {
      title: "Cancel Phase",
      action: cancelPhase,
      successMessagePlaceholder: "Phase successfully cancelled",
    },
    finish: {
      title: "Finish Phase",
      action: finishPhase,
      successMessagePlaceholder: "Phase successfully set to finished",
    },
    archive: {
      title: "Archive Phase",
      action: archivePhase,
      successMessagePlaceholder: "Phase successfully archived",
    },
  };

  const queryClient = useQueryClient();

  const handleAction = ({ id, action }: Actions) => {
    setSelectedPhaseId(id);
    const actionFn = actionConfig[action].action;
    const successMessagePlaceholder =
      actionConfig[action].successMessagePlaceholder;
    const toastTitle = actionConfig[action].title;

    actionFn.mutate(null, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: "default",
          title: toastTitle,
          description: response.message || successMessagePlaceholder,
        });
        queryClient.invalidateQueries({
          queryKey: ["phases-active", projectId],
        });
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: toastTitle,
          description:
            response.message || "There was an error processing the request",
        });
      },
    });
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex-grow flex-col-start gap-4 w-full overflow-y-auto">
      <SearchInput
        onChange={(e) => {
          const value = e.currentTarget.value;
          setFilter(value);
        }}
        icon={<IoSearch />}
        placeholder="Search Phase"
      />

      {filteredPhases?.length === 0 ? (
        <div className="w-full mt-10 flex-col-center text-slate-500">
          No phases
        </div>
      ) : (
        <div className="flex-col-start gap-4 w-full ">
          <RenderPhasesByStatus
            status={"to do"}
            phases={toDo}
            handleAction={handleAction}
          />
          <RenderPhasesByStatus
            status={"in progress"}
            phases={inProgress}
            handleAction={handleAction}
          />
          <RenderPhasesByStatus
            status={"cancelled"}
            phases={cancelled}
            handleAction={handleAction}
          />
          <RenderPhasesByStatus
            status={"paused"}
            phases={paused}
            handleAction={handleAction}
          />
          <RenderPhasesByStatus
            status={"archived"}
            phases={archived}
            handleAction={handleAction}
          />
          <RenderPhasesByStatus
            status={"finished"}
            phases={finished}
            handleAction={handleAction}
          />
        </div>
      )}
    </div>
  );
}
