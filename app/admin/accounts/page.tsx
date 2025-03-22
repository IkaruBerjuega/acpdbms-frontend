import AccountsTableHeaderActions from "@/components/ui/admin/accounts/table-header";
import Table from "@/components/ui/admin/accounts/table";
import { AccountsTableType, Breadcrumbs } from "@/lib/definitions";
import serverRequestAPI from "@/hooks/server-request";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Sidepanel from "@/components/ui/admin/accounts/sidepanel";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    role?: "employee" | "client";
    archived?: "true" | "false";
    add?: "true" | "false";
    grant_access?: "true" | "false";
  }>;
}) {
  const { role = "employee", archived, add, grant_access } = await searchParams;
  const isArchived = archived === "true";

  const urlMap = {
    employee: isArchived ? "/employees-archived" : "/employees-list",
    client: isArchived ? "/clients-archived" : "/clients-list",
  };

  const initialData: AccountsTableType[] = await serverRequestAPI({
    url: urlMap[role],
    auth: true,
  });

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
      href: "",
      pageName: "Admin",
      active: false,
    },
    {
      href: routeMap[role].href,
      pageName: routeMap[role].pageName,
      active: true,
    },
  ];

  const isAddOpen = add === "true";
  const isGrant = grant_access === "true";
  const activeKey = isAddOpen ? "add" : "grant_access";
  const isEmployee = role === "employee";
  const isOpen = isAddOpen || isGrant;

  return (
    <main className="w-full h-full flex-col-start gap-2">
      <SidebarTrigger breadcrumbs={breadcrumbs} />
      <AccountsTableHeaderActions<AccountsTableType> />

      <div className="flex-grow flex-row-start gap-2 relative min-w-0">
        <div className="flex-grow rounded-bl-lg bg-white-primary shadow-md system-padding min-w-0">
          <Table<AccountsTableType>
            initialData={initialData}
            role={role}
            isArchived={isArchived}
          />
        </div>
        <Sidepanel
          activeKey={activeKey}
          isEmployee={isEmployee}
          isOpen={isOpen}
        />
      </div>
    </main>
  );
}
