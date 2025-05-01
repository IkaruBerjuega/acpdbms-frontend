import AccountsTableHeaderActions from "@/components/ui/admin/accounts/table-header";
import Table from "@/components/ui/admin/accounts/table";
import { Breadcrumbs } from "@/lib/definitions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Sidepanel from "@/components/ui/admin/accounts/sidepanel";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    role: "employee" | "client";
    archived: "true" | null;
    add: "true" | "false";
    grant_access: "true" | "false";
  }>;
}) {
  const { role = "employee", archived, add } = await searchParams;
  const isArchived = archived === "true";

  const routeMap = {
    employee: isArchived
      ? {
          href: "/admin/accounts?role=employee&archived=true",
          pageName: "Archived Employee Accounts",
        }
      : {
          href: "/admin/accounts?role=employee",
          pageName: "Employee Accounts",
        },
    client: isArchived
      ? {
          href: "/admin/accounts?role=client&archived=true",
          pageName: "Archived Client Accounts",
        }
      : {
          href: "/admin/accounts?role=client",
          pageName: "Client Accounts",
        },
  };

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: routeMap[role].href,
      pageName: routeMap[role].pageName,
      active: true,
    },
  ];

  const isAddOpen = add === "true";

  const activeKey = isAddOpen ? "add" : "grant_access";
  const isEmployee = role === "employee";

  return (
    <>
      <SidebarTrigger breadcrumbs={breadcrumbs} />
      <AccountsTableHeaderActions roleValue={role} archived={archived} />

      <div className="flex-grow flex-row-start gap-2 relative flex-1  min-h-0  min-w-0">
        <div className="rounded-bl-lg bg-white-primary shadow-md  h-full w-full overflow-hidden min-w-0">
          <div className="overflow-y-auto h-full system-padding">
            <Table role={role} isArchived={isArchived} />
          </div>
        </div>
        <Sidepanel activeKey={activeKey} isEmployee={isEmployee} />
      </div>
    </>
  );
}
