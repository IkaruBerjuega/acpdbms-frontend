import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/general/sidebar/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white-secondary">
        <AppSidebar role={"admin"} />
        <main className="flex-1 flex-col-start m-4 gap-2 min-w-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
