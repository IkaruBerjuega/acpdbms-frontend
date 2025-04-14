import AccountSettings from "@/components/ui/components-to-relocate/account-settings-wrapper";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/lib/definitions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab: "profile" | "security" | "notification" | null;
  }>;
}) {
  const { tab } = await searchParams;

  // Default to 'contacts' if no tab is specified in the URL
  const activeTab = tab ? tab : "profile";

  const routeMap = [
    {
      href: "/client/settings/profile",
      pageName: "Profile Settings",
      value: "profile",
    },
    {
      href: "/client/settings/account-security",
      pageName: "Account Security",
      value: "security",
    },
    {
      href: "/client/settings/notifications",
      pageName: "Notification Settings",
      value: "notification",
    },
  ];

  const currentRoute =
    routeMap.find((route) => route.value === activeTab) || routeMap[0];

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "/client",
      pageName: "Client",
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
      <AccountSettings activeTab={activeTab} role="client" />
    </main>
  );
}
