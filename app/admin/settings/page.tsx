import type { Breadcrumbs } from "@/lib/definitions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AdminSettings from "@/components/ui/admin/settings/admin-settings-wrapper";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab: "tools" | "contacts" | null }>;
}) {
  const { tab } = await searchParams;

  // Default to 'contacts' if no tab is specified in the URL
  const activeTab = tab ? tab : "contacts";

  const routeMap = [
    {
      href: "/admin/settings/contacts",
      pageName: "Contact Details",
      value: "contacts",
    },
    {
      href: "/admin/settings/tools",
      pageName: "Admin Tools",
      value: "tools",
    },
  ];

  const currentRoute =
    routeMap.find((route) => route.value === activeTab) || routeMap[0];

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "/admin",
      pageName: "Admin",
      active: false,
    },
    {
      href: currentRoute.href,
      pageName: currentRoute.pageName,
      active: true,
    },
  ];

  return (
    <main className="w-full h-full flex-col-start gap-2">
      <div className="flex items-center">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
      </div>

      <AdminSettings activeTab={activeTab} />
    </main>
  );
}
