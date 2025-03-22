import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/lib/definitions";

export default function Page() {
  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "",
      pageName: "Project Name",
      active: false,
    },
    {
      href: "/employee/tasks",
      pageName: "Tasks",
      active: false,
    },
    {
      href: "/employee/tasks/add",
      pageName: "Add Tasks",
      active: true,
    },
  ];
  return (
    <>
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector />
      </div>
    </>
  );
}
