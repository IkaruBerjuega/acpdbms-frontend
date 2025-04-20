import { NotificationItem as NotificationItemObject } from "@/lib/notification-definitions";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { CustomDropdownMenu } from "../../dropdown-menu";
import { getInitialsFallback, getRelativeTime, titleCase } from "@/lib/utils";

interface NotificationItemProps {
  notification: NotificationItemObject;
  setIdStates: ({ id }: { id: string | undefined }) => void;
  markAsSeen: () => void;
}

export default function NotificationItem({
  notification,
  setIdStates,
  markAsSeen,
}: NotificationItemProps) {
  return (
    <div className={`rounded-md border-[1px] p-3 w-full flex-row-start gap-3 `}>
      <div className="h-full">
        <Avatar className="rounded-w-full h-8 w-8 border-[1px]">
          <AvatarImage src={notification.profile_picture_url} />
          <AvatarFallback>
            {getInitialsFallback(notification.user_name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-col-start gap-2">
        <div className="flex-col-start">
          <p
            className={`${
              notification.seen === true ? "text-slate-600" : "text-slate-700"
            } text-sm  font-semibold`}
          >
            {notification.user_name}
          </p>
          <p
            className={`${
              notification.seen === true ? "text-slate-500" : "text-slate-700"
            } text-sm`}
          >
            {notification.content}
          </p>
        </div>

        <p
          className={`${
            notification.seen === true
              ? "text-slate-500 font-normal"
              : "text-blue-500 font-semibold"
          } text-xs   flex-row-start gap-2`}
        >
          <span> {getRelativeTime(notification.date)}</span>
          <span>•</span>
          <span>{titleCase(notification.category)}</span>
          {/* If notif is seen */}
          {notification.seen && (
            <>
              <span>•</span>
              <span>Seen at {notification.date_seen}</span>
            </>
          )}
        </p>
      </div>
      <div className="flex-1 flex-row-end-center min-w-10">
        <CustomDropdownMenu
          btnVariant={"ghost"}
          btnSrc={"/button-svgs/table-action-threedot.svg"}
          btnSrcAlt="dropdown menu button trigger for project actions "
          items={[
            ...(notification.seen !== true
              ? [
                  {
                    label: "Mark as read",
                    onClick: () => {
                      setIdStates({ id: notification.id });
                      markAsSeen();
                    },
                    iconSrc: "/button-svgs/check.svg",
                    alt: "seen notification",
                  },
                ]
              : []),
            {
              label: "Archive",
              onClick: () => {},
              iconSrc: "/button-svgs/table-action-archive-black.svg",
              alt: "archive notification",
            },
          ]}
        />
      </div>
    </div>
  );
}
