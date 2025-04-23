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
  ViceManagerPermissionResponse,
} from "@/lib/definitions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryParams } from "@/hooks/use-query-params";
import { requestAPI } from "@/hooks/tanstack-query";

export function ProjectSelector({
  role,
  projId,
}: {
  role: "employee" | "client";
  projId: string | null;
}) {
  const { data: projects } = useAssociatedProjects({ role: role });
  const { setData } = useProjectSelectStore();

  const projectId = projId?.split("_")[0];

  const { params } = useQueryParams();

  const hasProjectId = !!projectId;

  const pathname = usePathname();

  const { replace } = useRouter();

  const createQueryString = useCallback(
    (value: string) => {
      params.set("projectId", value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  const deleteProjectIdQuery = useCallback(() => {
    params.delete("projectId");
    replace(`${pathname}?${params.toString()}`);
  }, [pathname, params, replace]);

  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    const savedProject = localStorage.getItem("projectSelected");
    if (savedProject) {
      const parsedProject: ProjectSelectorProps = JSON.parse(savedProject);
      setData([{ ...parsedProject }]);

      if (!hasProjectId) {
        const projectQueryParam = `${parsedProject.projectId}_${parsedProject.projectName}`;
        createQueryString(projectQueryParam);
      }
    }
  }, [hasProjectId]);

  const mustOpen = useMemo(() => {
    return !projectId && open;
  }, [projectId, open]);

  async function onSelect(project: ProjectListResponseInterface) {
    if (project.id && project.project_title) {
      const userRole = project.user_role;

      const vicePermissionResponse = await requestAPI({
        url: `/projects/${project.id}/vice-permission`,
        body: null,
        contentType: "application/json",
        auth: true,
        method: "GET",
      });

      const data = {
        projectId: project.id,
        projectName: project.project_title,
        userRole,
        hasVicePermission: vicePermissionResponse.vice_manager_permission,
      };

      localStorage.setItem("projectSelected", JSON.stringify(data));
      setData([{ ...data }]);
      createQueryString(project.id + "_" + project.project_title);

      return;
    }
  }

  const projectName = projId?.split("_")[1];

  return (
    <Sheet
      open={mustOpen}
      onOpenChange={(isOpen) => {
        //reset data if opening and set open to true as secondary basis for opening the sheet
        if (isOpen) {
          localStorage.removeItem("projectSelected");
          deleteProjectIdQuery();
          setOpen(true);
          return;
        }
        //if the user closes the sheet
        setOpen(false);
      }}
    >
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex-row-between-center p-0 h-5">
          {projectName || "Select A Project"}
          <MdOutlineKeyboardArrowUp
            className={`${
              projId ? "-rotate-180" : "rotate-0"
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
