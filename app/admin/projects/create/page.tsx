import Breadcrumbs from "@/components/ui/admin/projects/create/breadcrumbs";
import CreateForm from "@/components/ui/admin/projects/create/create-form";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <main className="flex flex-col gap-2">
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
      <CreateForm />
    </main>
  );
}
