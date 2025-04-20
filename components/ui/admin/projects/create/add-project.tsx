"use client";

import Tabs from "@/components/ui/general/tabs";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import AddNewProject from "./create-form";
import DuplicateProject from "./duplicate-project";

export default function AddProject({ tab }: { tab: "new" | "duplicate" }) {
  const { replace } = useRouter();
  const pathname = usePathname();

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      const params = new URLSearchParams();
      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace]
  );

  const isTabInNew = tab === "new";
  const activeTab = isTabInNew ? "New Project" : "Duplicate Project";

  const tabItems = [
    {
      item: "New Project",
      action: () => createQueryString("tab", "new"),
    },
    {
      item: "Duplicate Project",
      action: () => createQueryString("tab", "duplicate"),
    },
  ];

  return (
    <>
      <Tabs
        activeTab={activeTab}
        tabItems={tabItems}
        containerClassName="h-fit"
      />
      <div className="flex-grow overflow-y-auto flex-col-start">
        {isTabInNew ? <AddNewProject /> : <DuplicateProject />}
      </div>
    </>
  );
}
