import EmpAccView from "@/components/ui/admin/accounts/view-edit-contents.tsx/employee-account-view";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import { UserDetailsResponse } from "@/lib/definitions";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit: "true" | null }>;
}) {
  // await the route parameters before using them
  const { id } = await params;
  const { edit } = await searchParams;

  const initialData: UserDetailsResponse = await serverRequestAPI({
    auth: true,
    url: `/users/${id}`,
  });

  const isEditMode = edit === "true" ? true : false;
  return (
    <>
      <SidebarTrigger
        breadcrumbs={[
          {
            pageName: "Employee Accounts",
            href: "/admin/accounts?tab=Employee",
            active: false,
          },
          {
            pageName: "View Account Details",
            href: `/admin/accounts/employee/${id}/view`,
            active: true,
          },
        ]}
      />

      <div className="flex-1 overflow-y-auto min-h-0">
        <EmpAccView
          id={id}
          isEdit={isEditMode}
          detailsInitialData={initialData}
        />
      </div>
    </>
  );
}
