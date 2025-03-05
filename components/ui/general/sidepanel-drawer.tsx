"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useQueryParams } from "@/hooks/use-query-params";
import { useIsDesktop } from "@/hooks/use-is-desktop";

interface DrawerProps {
  paramKey: string;
  content: React.JSX.Element;
  title: string;
  description: string;
}
import Image from "next/image";

export default function SidepanelDrawerComponent({
  paramKey,
  content,
  title,
  description,
}: DrawerProps) {
  const { paramsKey, params } = useQueryParams();
  const canOpen = paramsKey[paramKey] === "true";

  const closeDrawer = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.delete(paramKey);
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  const isDesktop = useIsDesktop();
  const btnCollpaseSrc = "/button-svgs/sidepanel-collapse.svg";

  return (
    <Drawer open={canOpen} onOpenChange={(isOpen) => !isOpen && closeDrawer()}>
      {isDesktop ? (
        <div
          className={`h-full hidden flex-col-start-center p-4 ${
            canOpen &&
            "w-1/4 lg:flex bg-white-primary shadow-md rounded-br-lg system-padding"
          }`}
        >
          <div className="w-full flex-row-between-start">
            <div className="flex-col-start">
              <h1 className="text-base font-bold">{title}</h1>
              <h2 className="text-sm ">{description}</h2>
            </div>

            <Button
              onClick={closeDrawer}
              className="p-0 h-8 w-8"
              variant={"ghost"}
            >
              <Image
                src={btnCollpaseSrc}
                width={16}
                height={16}
                alt={"collapse sidebar button"}
                onClick={closeDrawer}
              />
            </Button>
          </div>
          {content}
        </div>
      ) : (
        <>
          <DrawerTrigger className="hidden" asChild />
          <DrawerContent className="xl:hidden system-padding">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
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
