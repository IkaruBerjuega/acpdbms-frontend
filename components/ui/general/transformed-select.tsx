import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectInput({
  items,
  onSelect,
  value,
}: {
  items: string[];
  onSelect: (value: string) => void;
  value: string | undefined;
}) {
  return (
    <Select onValueChange={onSelect} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Value" className="text-darkgray-500" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
