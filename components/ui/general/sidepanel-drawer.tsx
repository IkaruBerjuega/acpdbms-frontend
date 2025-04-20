"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useQueryParams } from "@/hooks/use-query-params";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import Image from "next/image";
import Tabs from "./tabs";
import { CustomTabsProps } from "@/lib/definitions";

interface DrawerProps {
  paramKey: string;
  content: React.JSX.Element;
  title?: string;
  description?: string;
  tabs?: CustomTabsProps;
}

export default function SidepanelDrawerComponent({
  paramKey,
  content,
  title,
  description,
  tabs,
}: DrawerProps) {
  const { paramsKey, params } = useQueryParams();
  const canOpen = paramsKey[paramKey] === "true";

  const closeDrawer = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.delete(paramKey);
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  const isDesktop = useIsDesktop();
  const btnCollapseSrc = "/button-svgs/sidepanel-close.svg";

  return (
    <Drawer open={canOpen} onOpenChange={(isOpen) => !isOpen && closeDrawer()}>
      {isDesktop ? (
        <div
          className={`h-full hidden flex-col-start-center p-4 space-y-4 ${
            canOpen &&
            "w-1/3 lg:flex bg-white-primary shadow-md rounded-md system-padding overflow-y-auto"
          }`}
        >
          <div className="flex-1 min-h-0 w-full flex-col-start gap-2 overflow-hidden">
            <div className="w-full flex-row-between-start">
              <div className="flex-col-start">
                {tabs && (
                  <Tabs activeTab={tabs.activeTab} tabItems={tabs.tabItems} />
                )}
                <div className={`flex-col-start ${tabs && "mt-4"}`}>
                  <h1 className="text-base font-bold">{title}</h1>
                  <h2 className="text-sm text-slate-500">{description}</h2>
                </div>
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

            <div className="flex-1 w-full overflow-y-auto min-h-0 pb-4 ">
              {content}
            </div>
          </div>
        </div>
      ) : (
        <>
          <DrawerTrigger className="hidden" asChild />
          <DrawerContent className="xl:hidden system-padding ">
            <DrawerHeader className="w-full">
              {tabs && (
                <Tabs activeTab={tabs.activeTab} tabItems={tabs.tabItems} />
              )}
              <DrawerTitle className="mt-4">{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>

            {content}
            <DrawerFooter>
              {/* <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={closeDrawer}>
                  Cancel
                </Button>
              </DrawerClose> */}
            </DrawerFooter>
          </DrawerContent>
        </>
      )}
    </Drawer>
  );
}
