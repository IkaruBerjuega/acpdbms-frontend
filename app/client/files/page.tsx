import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  const breadcrumbs = [
    { pageName: "Client", href: "", active: false },
    { pageName: "Approval", href: "/client/approval", active: true },
  ];
  return (
    <div className="flex-col-start gap-4 sm:flex-row-between-center sm:gap-0 w-full">
      <SidebarTrigger breadcrumbs={breadcrumbs} />
      <div className="flex-1 sm:flex-none flex-row-start">
        <ProjectSelector />
      </div>
    </div>
  );
}
