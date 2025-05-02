"use client";

import useNotificationActions, {
  useGetNotifications,
} from "@/hooks/general/use-notifications";
import { NotificationFilters } from "@/lib/notification-definitions";
import { useMemo, useState } from "react";
import NotificationItem from "./notification-item";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CustomDropdownMenu } from "../../dropdown-menu";
import Image from "next/image";
import { Button } from "../../button";

interface NotificationComponentProps extends NotificationFilters {
  setIntervalFilter: (interval: NotificationFilters["filter"]) => void;
  setPageIndex: (pageIndex: string) => void;
}

export default function NotificationsComponent({
  filter,
  page,
  role,
  setIntervalFilter,
  setPageIndex,
}: NotificationComponentProps) {
  const { data: notificationsResponse, isPending } = useGetNotifications({
    filter: filter || "all",
    page: page,
    role,
  });

  const [id, setId] = useState<string>();

  const { markAllSeen, markAsSeen } = useNotificationActions({
    id: id,
    role,
  });

  //for refetching
  const queryClient = useQueryClient();

  const setIdStates = ({ id }: { id: string | undefined }) => {
    setId(id);
  };

  const onSuccess = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["notifications", role] }),
      queryClient.invalidateQueries({
        queryKey: ["unseen-notifications-count", role],
      }),
    ]);
  };

  const handleMarkAsSeen = () => {
    markAsSeen.mutate(null, {
      onSuccess: onSuccess,
      onError: () => {
        toast({
          title: "Error",
          description: "There was an error processing the request",
          variant: "destructive",
        });
      },
    });
  };

  const handleMarkAllAsSeen = () => {
    markAllSeen.mutate(null, {
      onSuccess: onSuccess,
      onError: () => {
        toast({
          title: "Error",
          description: "There was an error processing the request",
          variant: "destructive",
        });
      },
    });
  };

  const notifications = notificationsResponse?.data || [];

  const pagination = notificationsResponse?.pagination;

  const recentAndNextPageIndexes = useMemo(() => {
    const currentPageIndex = Number(page);

    const recentPageIndex = currentPageIndex - 1;
    const nextPageIndex = currentPageIndex + 1;

    const canRecent = recentPageIndex >= 1;
    const canNext = nextPageIndex <= Number(pagination?.last_page);

    const lastAndNextPage = {
      recent: canRecent ? String(recentPageIndex) : undefined,
      next: canNext ? String(nextPageIndex) : undefined,
    };

    return lastAndNextPage;
  }, [page, pagination]);

  const canMarkAllAsSeen =
    useMemo(() => {
      return notifications.find((notification) => !notification.seen);
    }, [notifications]) || false;

  const filterLabelMap = {
    all: "All",
    today: "Today",
    last_3_days: "Last 3 Days",
    last_7_days: "Last 7 Days",
    last_30_days: "Last 30 Days",
  };

  return (
    <div className="flex-grow flex-col-start min-h-0 gap-2 overflow-y-auto">
      <div className="flex-row-end-center gap-2">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={handleMarkAllAsSeen}
          disabled={!canMarkAllAsSeen}
          className={`w-auto text-sm text-slate-600 flex-row-center gap-2 h-8 p-0 px-2`}
        >
          <Image
            src={"/button-svgs/check.svg"}
            alt={""}
            width={14}
            height={14}
          />

          {canMarkAllAsSeen
            ? "  Mark all as read"
            : "All notifications are read"}
        </Button>
        <CustomDropdownMenu
          btnSrc="/button-svgs/arrow-down.svg"
          btnLabel={filterLabelMap[filter]}
          btnSrcAlt={"notification interval dropdown"}
          items={[
            {
              label: "All",
              onClick: () => setIntervalFilter("all"),
            },
            {
              label: "Today",
              onClick: () => setIntervalFilter("today"),
            },
            {
              label: "Last 3 Days",
              onClick: () => setIntervalFilter("last_3_days"),
            },
            {
              label: "Last 7 Days",
              onClick: () => setIntervalFilter("last_7_days"),
            },
            {
              label: "Last 30 Days",
              onClick: () => setIntervalFilter("last_30_days"),
            },
          ]}
          className="w-auto px-2"
          btnVariant={"outline"}
        />
      </div>

      <div className="flex-grow flex-col-start gap-2">
        {!isPending ? (
          <>
            {notifications.length > 0 ? (
              <>
                {notifications?.map((notification, index) => {
                  return (
                    <NotificationItem
                      key={index}
                      notification={notification}
                      markAsSeen={handleMarkAsSeen}
                      setIdStates={setIdStates}
                    />
                  );
                })}
              </>
            ) : (
              <div className="flex-col-center text-slate-400  mt-10">
                No Notifications
              </div>
            )}
          </>
        ) : (
          <div className="flex-col-center text-slate-400  mt-10">
            Loading...
          </div>
        )}
      </div>

      <div className="w-full flex-row-end-center gap-2">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            if (recentAndNextPageIndexes.recent) {
              setPageIndex(recentAndNextPageIndexes.recent);
            }
          }}
          disabled={recentAndNextPageIndexes.recent === undefined}
          className="w-auto px-2 text-sm text-slate-600 flex-row-center gap-2 border-[1px] rounded-md py-1 hover:bg-slate-100"
        >
          Recent
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            if (recentAndNextPageIndexes.next) {
              setPageIndex(recentAndNextPageIndexes.next);
            }
          }}
          disabled={recentAndNextPageIndexes.next === undefined}
          className="w-auto px-2 text-sm text-slate-600 flex-row-center gap-2 border-[1px] rounded-md py-1 hover:bg-slate-100"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
