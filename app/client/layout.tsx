import React, { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/general/sidebar/app-sidebar";
import AutomaticallyLoggedOutNotice from "@/components/ui/general/logged-out-notice";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white-secondary">
        <AppSidebar role={"client"} />
        <main className="flex-grow flex-col-start m-4 gap-2">
          <Suspense>{children}</Suspense>
        </main>
        <Suspense>
          <AutomaticallyLoggedOutNotice />
        </Suspense>
      </div>
    </SidebarProvider>
  );
}
