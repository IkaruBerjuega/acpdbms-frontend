"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import SidepanelDrawerComponent from "../../../general/sidepanel-drawer";
import AssignMembers from "./task-members-add";
import Members from "./task-members-view";

export default function TaskMembers({
  taskId,
  activeTab,
  activeParamKey,
}: {
  taskId: string;
  activeTab: "Assign Members" | "Members";
  activeParamKey: "assign_members" | "members";
}) {
  const { params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      if (parameter === "members") {
        params.delete("assign_members");
      } else {
        params.delete("members");
      }

      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  let tabs = {
    activeTab: activeTab,
    tabItems: [
      {
        item: "Members",
        action: () => {
          createQueryString("members", "true");
        },
      },
      {
        item: "Assign Members",
        action: () => {
          createQueryString("assign_members", "true");
        },
      },
    ],
  };

  let titleAndDescription = {
    members: {
      title: "Members",
      description: "List of members assigned in this task",
      content: <Members taskId={taskId} />,
    },
    assign_members: {
      title: "Assign Members",
      description: "Assign multiple members in this task",
      content: <AssignMembers taskId={taskId} />,
    },
  };

  return (
    <SidepanelDrawerComponent
      paramKey={activeParamKey}
      content={titleAndDescription[activeParamKey].content}
      title={titleAndDescription[activeParamKey].title}
      description={titleAndDescription[activeParamKey].description}
      tabs={tabs}
    />
  );
}
