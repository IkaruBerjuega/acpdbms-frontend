"use client";

import { titleCase } from "@/lib/utils";

interface TabsInterface {
  activeTab: string | null;
  tabItems: {
    item: string;
    action: () => void;
  }[];
}

export default function Tabs({ activeTab, tabItems }: TabsInterface) {
  return (
    <div className="rounded-md flex-row-between-center bg-gray-200 h-8 lg:h-10 px-1.5 py-1 w-fit">
      {tabItems.map(({ item, action }, index) => {
        return (
          <button
            key={index}
            className={`p-1 lg:p-2 rounded-md text-xs  ${
              titleCase(activeTab) === titleCase(item) && "bg-white-primary"
            } `}
            onClick={action}
          >
            {titleCase(item)}
          </button>
        );
      })}
    </div>
  );
}
