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
    <div className="rounded-md flex-row-between-center bg-gray-200 h-full px-1.5 py-1 ">
      {tabItems.map(({ item, action }, index) => (
        <button
          key={index}
          className={`p-2 rounded-md text-xs  ${
            activeTab === item && "bg-white-primary"
          } `}
          onClick={action}
        >
          {titleCase(item)}
        </button>
      ))}
    </div>
  );
}
