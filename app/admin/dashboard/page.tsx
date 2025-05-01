"use client";

import Dashboard from "@/components/ui/admin/dashboard/dashboard";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  const breadCrumbs = [
    {
      href: "",
      pageName: "Dashboard",
      active: true,
    },
  ];

  return (
    <>
      <SidebarTrigger breadcrumbs={breadCrumbs} />
      <Dashboard />
    </>
  );
}
