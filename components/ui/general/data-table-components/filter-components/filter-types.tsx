import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdOutlineFilterList } from "react-icons/md";
import { DatePicker } from "@/components/ui/date-picker";
import { SelectInput } from "../../transformed-select";
import { useToast } from "@/hooks/use-toast";

// Button Component
const BtnApplyFilter = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Button
      variant="outline"
      className="flex gap-2 hover:bg-white-300 hover:opacity-80 p-2"
      onClick={onClick}
    >
      <MdOutlineFilterList className="hover:text-white" />
      Apply Filter
    </Button>
  );
};

// Text Filter Component
export const TextFilter = ({ columnName }: { columnName: string }) => {
  const [value, setValue] = useState("");
  const { toast } = useToast();

  const handleApplyFilter = () => {
    if (!value) return;

    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Get current values and append new value
    const currentValues = params.getAll(columnName);
    if (currentValues.includes(value)) {
      toast({
        title: "Duplicate Value",
        description: `The value "${value}" is already applied.`,
        variant: "destructive",
      });
      setValue("");
      return;
    }

    const updatedValues = [...currentValues, value];
    params.delete(columnName); // Remove existing values
    updatedValues.forEach((val) => params.append(columnName, val)); // Add new values

    // Update the URL in the browser history
    window.history.pushState(
      {},
      "",
      `${currentUrl.pathname}?${params.toString()}`
    );
    setValue("");
  };

  return (
    <div className="space-y-6">
      <Input
        type="text"
        placeholder="Enter Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-end w-full">
        <BtnApplyFilter onClick={handleApplyFilter} />
      </div>
    </div>
  );
};

// Number Filter Component
export const NumberFilter = ({ columnName }: { columnName: string }) => {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const handleApplyFilter = () => {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Combine min and max values as a range
    params.set(columnName, `${minValue}-${maxValue}`);

    // Update the URL in the browser history
    window.history.pushState(
      {},
      "",
      `${currentUrl.pathname}?${params.toString()}`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Input
          type="number"
          placeholder="Enter min value"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Enter max value"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          className="mt-2"
        />
      </div>
      <div className="flex justify-end w-full">
        <BtnApplyFilter onClick={handleApplyFilter} />
      </div>
    </div>
  );
};

// Date Filter Component
export const DateFilter = ({ columnName }: { columnName: string }) => {
  const [date, setSelectedDate] = useState("");
  const { toast } = useToast();

  const handleApplyFilter = () => {
    if (!date) return;

    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Get current values and append new value
    const currentValues = params.getAll(columnName);
    if (currentValues.includes(date)) {
      toast({
        title: "Duplicated filter",
        description: `The date selected "${date}" is already applied.`,
        variant: "destructive",
      });
      setSelectedDate("");
      return;
    }

    const updatedValues = [...currentValues, date];
    params.delete(columnName); // Remove existing values
    updatedValues.forEach((val) => params.append(columnName, val));

    // Update the URL in the browser history
    window.history.pushState(
      {},
      "",
      `${currentUrl.pathname}?${params.toString()}`
    );
    setSelectedDate("");
  };

  const handleDateSelect = (selectedDate: Date) => {
    // Adjust for timezone offset
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000; // offset in milliseconds
    const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset);
    setSelectedDate(adjustedDate.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      <DatePicker
        placeholder="Pick a date"
        onSelect={handleDateSelect}
        selectedDate={date ? new Date(date) : undefined}
      />
      <div className="flex justify-end w-full">
        <BtnApplyFilter onClick={handleApplyFilter} />
      </div>
    </div>
  );
};

// Select Filter Component
export const SelectFilter = ({
  options,
  columnName,
}: {
  options: string[] | undefined;
  columnName: string;
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const { toast } = useToast();

  const handleApplyFilter = () => {
    if (!selectedOption) return;

    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Get current values and append new value
    const currentValues = params.getAll(columnName);
    if (currentValues.includes(selectedOption)) {
      toast({
        title: "Duplicate Value",
        description: `The option "${selectedOption}" is already applied.`,
        variant: "destructive",
      });
      setSelectedOption("");
      return;
    }

    const updatedValues = [...currentValues, selectedOption];
    params.delete(columnName); // Remove existing values
    updatedValues.forEach((val) => params.append(columnName, val)); // Add new values

    // Update the URL in the browser history
    window.history.pushState(
      {},
      "",
      `${currentUrl.pathname}?${params.toString()}`
    );
    setSelectedOption("");
  };

  return (
    <div className="space-y-6">
      <SelectInput
        items={options || []}
        onSelect={(value) => setSelectedOption(value)}
        value={selectedOption}
      />
      <div className="flex justify-end w-full">
        <BtnApplyFilter onClick={handleApplyFilter} />
      </div>
    </div>
  );
};
