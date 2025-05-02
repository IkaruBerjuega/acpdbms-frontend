"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import ReusableSheet from "../sheet-component";
import NotificationsComponent from "../notifications/notifications";
import { NotificationFilters } from "@/lib/notification-definitions";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUnseenNotificationsCount } from "@/hooks/general/use-notifications";

export function Notifications({
  role,
}: {
  role: "admin" | "employee" | "client";
}) {
  const { params, paramsKey } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { data } = useGetUnseenNotificationsCount({ role: role });
  const unseenNotificationCount = data?.count;

  const filter = paramsKey["filter"] as NotificationFilters["filter"];
  const page = paramsKey["page"] || "1";

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  const queryClient = useQueryClient();

  const openNotifs = () => {
    createQueryString("notifications", "open");
    createQueryString("filter", "all");
    createQueryString("page", "1");
  };

  const setIntervalFilter = (interval: NotificationFilters["filter"]) => {
    createQueryString("filter", interval);
  };

  const setPageIndex = (pageIndex: string) => {
    createQueryString("page", pageIndex);
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications", role] });
  }, [filter, page]);

  const canOpenNotifs = filter !== undefined && page !== undefined;

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="relative">
          <SidebarMenuButton
            asChild
            tooltip={"Notifications"}
            size="lg"
            className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:ml-1 cursor-pointer"
          >
            <div className={`flex rounded-md `} onClick={openNotifs}>
              <IoIosNotificationsOutline className="text-xl" />
              <span>Notifications</span>
            </div>
          </SidebarMenuButton>
          <div className="bg-red-600 p-1 text-[10px]  absolute top-0 h-4 w-4 flex-col-center right-[-2px] leading-none rounded-full">
            {unseenNotificationCount}
          </div>
        </SidebarMenuItem>
      </SidebarMenu>

      {canOpenNotifs && (
        <ReusableSheet
          title={"Notifications"}
          description={"View your latest updates and alerts."}
          content={
            <NotificationsComponent
              filter={filter}
              page={page}
              role={role}
              setIntervalFilter={setIntervalFilter}
              setPageIndex={setPageIndex}
            />
          }
          paramKey={"notifications"}
          paramsKeyToDelete={["notifications", "filter", "page"]}
          toCompare={"open"}
          tabs={null}
        />
      )}
    </>
  );
}
