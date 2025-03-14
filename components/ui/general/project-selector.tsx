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
import { useRouter } from "next/navigation";

export function ProjectSelector({
  dynamicPage,
}: {
  dynamicPage?: "project-details";
}) {
  const { data: projects } = useAssociatedProjects();
  const { data: projectSelected, setData, resetData } = useProjectSelectStore();

  let btnText = projectSelected[0]?.projectName || "Select A Project";
  let isSelected = !!projectSelected[0];

  const router = useRouter();

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
          {btnText}
          <MdOutlineKeyboardArrowUp
            className={`${
              isSelected ? "rotate-180" : "rotate-0"
            } transition-all duration-500`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="h-[90vh] overflow-y-auto ">
        <SheetHeader className=" w-full">
          <SheetTitle className="text-2xl font-bold w-full">
            Your Projects
          </SheetTitle>
          <SheetDescription className="text-base w-full">
            Select a project.
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-2 mt-10">
          {projects?.map((project, index) => {
            return (
              <Card
                key={index}
                data={project}
                fn={(projectId, projectSelected) => {
                  if (projectId && projectSelected)
                    setData([
                      { projectId: projectId, projectName: projectSelected },
                    ]);

                  if (projectId) {
                    if (dynamicPage === "project-details") {
                      router.push(
                        `/employee/project-details/${projectId}/view`
                      );
                    }
                  }
                }}
              />
            );
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
