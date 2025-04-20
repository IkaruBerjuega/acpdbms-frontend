"use client";

import { titleCase } from "@/lib/utils";

interface TabsInterface {
  activeTab: string | null;
  tabItems: {
    item: string;
    element?: JSX.Element;
    action: () => void;
  }[];
  containerClassName?: string;
}

export default function Tabs({
  activeTab,
  tabItems,
  containerClassName,
}: TabsInterface) {
  return (
    <div
      className={`rounded-md flex-row-between-center bg-gray-200 px-1 py-1 w-fit ${containerClassName}`}
    >
      {tabItems.map(({ item, element, action }, index) => {
        return (
          <button
            key={index}
            className={`p-2 rounded-sm text-xs h-full w-fit ${
              titleCase(activeTab) === titleCase(item) && "bg-white-primary"
            } `}
            onClick={action}
          >
            {element ? element : titleCase(item)}
          </button>
        );
      })}
    </div>
  );
}
