import CreateForm from "@/components/ui/admin/projects/create/create-form";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <>
      <SidebarTrigger
        breadcrumbs={[
          {
            href: "",
            pageName: "Admin",
            active: false,
          },
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
      <div className="flex-1 min-h-0 overflow-y-auto">
        <CreateForm />
      </div>
    </>
  );
}
