"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../button";
import Image from "next/image";
import { useQueryParams } from "@/hooks/use-query-params";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { CustomTabsProps } from "@/lib/definitions";
import Tabs from "./tabs";

interface ReusableSheetProps {
  title: string;
  description: string;
  content: JSX.Element;
  paramKey: string;
  toCompare: string;
  tabs: CustomTabsProps | null;
}

export default function ReusableSheet({
  title,
  description,
  content,
  paramKey,
  toCompare,
  tabs,
}: ReusableSheetProps) {
  const { paramsKey, params } = useQueryParams();
  const canOpen = paramsKey[paramKey] === toCompare;

  const closeDrawer = () => {
    params.delete(paramKey);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  const isDesktop = useIsDesktop();
  const btnCollapseSrc = "/button-svgs/sidepanel-close.svg";

  return (
    <Sheet open={canOpen} onOpenChange={(isOpen) => !isOpen && closeDrawer()}>
      <SheetTrigger className="hidden" asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={`flex-col-start gap-4   ${
          isDesktop ? "w-[40vw]" : "min-w-full min-h-[90vh]"
        }`}
      >
        <div className="flex-row-between-start">
          <div className="flex-col-start gap-2">
            {tabs && (
              <Tabs activeTab={tabs.activeTab} tabItems={tabs.tabItems} />
            )}
            <SheetHeader className="flex-col-start">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
          </div>

          <Button
            onClick={closeDrawer}
            className="p-0 h-8 px-2"
            variant="ghost"
          >
            <Image
              src={btnCollapseSrc}
              width={16}
              height={16}
              alt="collapse sidebar button"
            />
          </Button>
        </div>
        {/* Ensure content fills space and allows scrolling */}
        <div className="flex-1 w-full overflow-y-auto min-h-0 pb-4">
          {content}
        </div>
        <SheetFooter className="hidden">
          <SheetClose className="hidden" asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
