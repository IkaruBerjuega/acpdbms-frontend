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
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

interface ReusableSheetProps {
  title: string;
  description: string;
  content: JSX.Element;
  paramKey: string;
  paramsKeyToDelete: string[];
  toCompare: string;
  tabs: CustomTabsProps | null;
  closeDrawerAdditionalFn?: () => void;
}

export default function ReusableSheet({
  title,
  description,
  content,
  paramKey,
  paramsKeyToDelete,
  toCompare,
  tabs,
  closeDrawerAdditionalFn,
}: ReusableSheetProps) {
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const closeDrawer = useCallback(() => {
    paramsKeyToDelete.forEach((key) => {
      params.delete(key);
    });

    if (closeDrawerAdditionalFn) {
      closeDrawerAdditionalFn();
    }

    // Now replace the URL with updated params

    replace(`${pathname}?${params.toString()}`);
  }, [params, replace, pathname, paramsKeyToDelete, closeDrawerAdditionalFn]);

  const canOpen = useMemo(() => {
    return paramsKey[paramKey] === toCompare;
  }, [paramsKey, paramKey, toCompare]);

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
          isDesktop ? "w-[40vw]" : "min-w-full h-[90%]"
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

        {content}
        <SheetFooter className="hidden">
          <SheetClose className="hidden" asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
