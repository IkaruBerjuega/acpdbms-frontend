"use client";

import AccountSettings from "@/components/ui/general/account-settings/account-settings-wrapper";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryParams } from "@/hooks/use-query-params";
import { Breadcrumbs } from "@/lib/definitions";
import { Suspense } from "react";

interface PageProps {
  tab?: "profile" | "security" | "notification";
}

export default function Page() {
  const { paramsKey } = useQueryParams();
  const params: PageProps = paramsKey;
  const { tab = "profile" } = params;

  // Default to 'contacts' if no tab is specified in the URL
  const activeTab = tab ? tab : "profile";

  const routeMap = [
    {
      href: "/employee/settings/profile",
      pageName: "Profile Settings",
      value: "profile",
    },
    {
      href: "/employee/settings/account-security",
      pageName: "Account Security",
      value: "security",
    },
    {
      href: "/employee/settings/notifications",
      pageName: "Notification Settings",
      value: "notification",
    },
  ];

  const currentRoute =
    routeMap.find((route) => route.value === activeTab) || routeMap[0];

  const breadcrumbs: Breadcrumbs[] = [
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
      <Suspense>
        <AccountSettings activeTab={activeTab} role="employee" />
      </Suspense>
    </main>
  );
}
