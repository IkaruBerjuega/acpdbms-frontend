import ClientAccView from "@/components/ui/admin/accounts/view-edit-contents.tsx/client-account-view";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

  const isEditMode = edit === "true" ? true : false;

  return (
    <>
      <SidebarTrigger
        breadcrumbs={[
          {
            pageName: "Client Accounts",
            href: "/admin/accounts?tab=Client",
            active: false,
          },
          {
            pageName: "View Account Details",
            href: `/admin/accounts/client/${id}/view`,
            active: true,
          },
        ]}
      />

      <div className="flex-1 overflow-y-auto min-h-0">
        <ClientAccView id={id} isEdit={isEditMode} />
      </div>
    </>
  );
}
