"use client";

import AddProject from "@/components/ui/admin/projects/create/add-project";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryParams } from "@/hooks/use-query-params";

export default function Page() {
  const { paramsKey } = useQueryParams();
  const { tab }: { tab?: "new" | "duplicate" } = paramsKey;

  return (
    <>
      <SidebarTrigger
        breadcrumbs={[
          {
            href: "/admin/projects/",
            pageName: "Projects",
            active: false,
          },
          {
            href: "",
            pageName: "Add Project",
            active: true,
          },
        ]}
      />
      <div className="flex-1 min-h-0 overflow-y-auto flex-col-start shadow-md bg-white-primary rounded-md system-padding gap-4">
        <AddProject tab={tab || "new"} />
      </div>
    </>
  );
}
