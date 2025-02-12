"use client";

import { Button } from "@/components/ui/button";
import {
  TextFilter,
  NumberFilter,
  DateFilter,
  SelectFilter,
} from "./filter-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import { FilterType } from "@/lib/types";

interface FilterPopOverProps {
  width: string;
  content: FilterType[]; // Adjusted to match the structure of filterType
  tableName: string;
  popoverName: string;
  icon: ReactNode;
}

function Filter({ filterType }: { filterType: FilterType }) {
  switch (filterType.type) {
    case "text":
      return <TextFilter columnName={filterType.columnAccessor} />;
    case "date":
      return <DateFilter columnName={filterType.columnAccessor} />;
    case "number":
      return <NumberFilter columnName={filterType.columnAccessor} />;
    case "select":
      return (
        <SelectFilter
          options={filterType.options}
          columnName={filterType.columnAccessor}
        />
      );
    default:
      return null; // or a default filter component
  }
}

export default function FilterPopOver({
  width,
  content,
  popoverName,
  icon,
}: FilterPopOverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex gap-2 p-2 md:p-4">
          {icon}
          <p className="text-xs md:text-sm">{popoverName}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${width} h-auto p-2 shadow-xl`}>
        <div className="flex flex-col ">
          <div>
            {content.map((option, index) => (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex gap-2 p-2 w-full justify-start rounded-md"
                  >
                    {option.name}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={`${width} h-auto p-4 shadow-xl`}
                  sideOffset={10}
                >
                  <div className="grid gap-4 w-full">
                    <div className="space-y-8">
                      <p className="text-sm">{option.name}</p>
                      <div className="w-full space-y-2">
                        <Filter filterType={option} />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
