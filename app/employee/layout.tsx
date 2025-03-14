import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/general/sidebar/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white-secondary">
        <AppSidebar role="employee" />
        <main className="flex-grow flex-col-start m-4 gap-4">
          <div className="flex-1 flex-col-start gap-2 ">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
