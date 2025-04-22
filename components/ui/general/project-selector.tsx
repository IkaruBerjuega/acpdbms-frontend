"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAssociatedProjects } from "@/hooks/general/use-assigned-projects";
import Card from "../project-card";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import {
  ProjectSelector as ProjectSelectorProps,
  ProjectListResponseInterface,
} from "@/lib/definitions";
import { useCallback, useEffect, useState } from "react";
import { useCheckViceManagerPermission } from "@/hooks/general/use-project";
import { useQueryParams } from "@/hooks/use-query-params";

export function ProjectSelector({
  role,
  projId,
}: {
  role: "employee" | "client";
  projId: string | null;
}) {
  const { data: projects } = useAssociatedProjects({ role: role });
  const { data: projectSelected, setData, resetData } = useProjectSelectStore();
  // const [projectVersions, setprojectVersions] = useState<RevisionInterface[]>(
  //   []
  // );

  const [projectId, setProjectId] = useState<string>("");

  const { data } = useCheckViceManagerPermission(projectId);
  const hasVicePermission = data?.vice_manager_permission === true;

  const { params } = useQueryParams();

  const hasProjectId = !!projId;
  const pathname = usePathname();
  const { replace } = useRouter();

  const createQueryString = useCallback(
    (value: string) => {
      params.set("projectId", value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  useEffect(() => {
    const savedProject = localStorage.getItem("projectSelected");
    if (savedProject) {
      const parsedProject: ProjectSelectorProps = JSON.parse(savedProject);
      setData([{ ...parsedProject }]);
      setProjectId(parsedProject.projectId);

      if (!hasProjectId) {
        const projectQueryParam = `${parsedProject.projectId}_${parsedProject.projectName}`;
        createQueryString(projectQueryParam);
      }
    }
  }, [hasProjectId]);

  function onSelect(project: ProjectListResponseInterface) {
    if (project.id && project.project_title) {
      const userRole = project.user_role;
      const data = {
        projectId: project.id,
        projectName: project.project_title,
        userRole,
        hasVicePermission,
      };
      setProjectId(projectId); // Updates asynchronously
      localStorage.setItem("projectSelected", JSON.stringify(data));
      setData([{ ...data }]); // Sync store with localStorage
      createQueryString(project.id + "_" + project.project_title);

      return;
    }
  }

  return (
    <Sheet
      open={!projectSelected[0]}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          resetData();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex-row-between-center p-0 h-5">
          {projectSelected[0]?.projectName || "Select A Project"}
          <MdOutlineKeyboardArrowUp
            className={`${
              projectSelected[0] ? "-rotate-180" : "rotate-0"
            } transition-all duration-500`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="h-[90vh] overflow-y-auto">
        <SheetHeader className="w-full">
          <SheetTitle className="text-2xl font-bold w-full">
            Your Projects
          </SheetTitle>
          <SheetDescription className="text-base w-full">
            Select a project.
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mt-10">
          {projects?.map((project, index) => {
            return <Card key={index} data={project} fn={onSelect} />;
          })}
        </div>

        <SheetFooter className="hidden">
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
