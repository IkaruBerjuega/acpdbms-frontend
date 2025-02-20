import { Label } from "@/components/ui/label";
import React from "react";
import {
  Control,
  Controller,
  FieldError,
  UseFormRegister,
} from "react-hook-form";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CiWarning } from "react-icons/ci";
import { Textarea } from "@/components/ui/textarea";
import { File } from "buffer";
import { ItemInterface } from "@/lib/filter-types";

interface FormInputType {
  items?: ItemInterface[];
  control?: Control<any>;
  register: UseFormRegister<any>;
  validationRules?: object;
  name: string;
  label: string;
  errorMessage?: string | FieldError;
  dataType?: string;
  inputType: "default" | "search" | "file" | "textArea" | "date";
  required?: boolean;
  min?: number;
  readOnly?: boolean;
  value?: string | number;
  fileValue?: File;
  onChangeCapture?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (item: ItemInterface) => void; // Just keep onSelect to set values
  allowedNewValue?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  labelColor?: string;
  fieldBg?: string;
  borderNone?: boolean;
  clearFn?: () => void;
}

export default function FormInput({
  control,
  name,
  label,
  register,
  validationRules,
  items,
  required,
  errorMessage,
  dataType,
  min,
  readOnly = false,
  value,
  onSelect,
  onChangeCapture,
  allowedNewValue,
  disabled,
  placeholder,
  className,
  labelColor,
  fieldBg,
  borderNone,
  clearFn,
  inputType = "default",
}: FormInputType) {
  const isSearch = inputType === "search";
  const isDate = inputType === "date";
  const isDefault = inputType === "default";
  const isFile = inputType === "file";
  const isTextArea = inputType === "textArea";

  return (
    <div className={`flex flex-col  ${className}`}>
      <Label
        htmlFor={name}
        className={`font-semibold text-xs text-darkgray-500 ${labelColor}`}
      >
        {label}
        {required !== false && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {isSearch ? (
        <Controller
          rules={validationRules}
          control={control}
          name={name}
          render={({ field: { onChange, value, onBlur } }) => (
            <div className="w-full">
              <Combobox
                items={items}
                onSelect={(item) => {
                  if (onSelect) {
                    onSelect(item);
                  } else {
                    onChange(String(item.value));
                  }
                }}
                placeholder={placeholder || ""}
                emptyMessage={placeholder || ""}
                value={value || ""} // Ensure the input uses the controlled value
                onBlur={onBlur}
                allowNewValue={allowedNewValue}
                disabled={disabled}
                clearFn={clearFn}
              />
            </div>
          )}
        />
      ) : isDefault ? (
        <Input
          type={dataType}
          id={name}
          placeholder={placeholder || ""}
          value={value}
          min={min}
          onChangeCapture={onChangeCapture}
          readOnly={readOnly}
          className={`text-xs sm:text-sm mt-1 ${fieldBg} ${
            borderNone && "border-none"
          }`}
          {...register(name, validationRules)} // This won't be used with Controller, consider removing it
        />
      ) : isDate ? (
        <Controller
          rules={validationRules}
          control={control}
          name={name}
          render={({ field: { onChange, value, onBlur } }) => (
            <div className="w-full">
              <DatePicker
                placeholder={placeholder || ""}
                onSelect={onChange}
                selectedDate={value ? new Date(value) : undefined}
                onBlur={onBlur}
                side="top"
              />
            </div>
          )}
        />
      ) : isFile ? (
        <Input
          id={name}
          type={dataType}
          value={value}
          placeholder={placeholder || ""}
          className="text-xs sm:text-sm"
          {...register(name, validationRules)} // This won't be used with Controller, consider removing it
        />
      ) : isTextArea ? (
        <Textarea
          id={name}
          value={value}
          placeholder={placeholder || ""}
          className={`text-xs sm:text-sm flex-grow ${fieldBg} ${
            borderNone && "border-none"
          }`}
          {...register(name, validationRules)} // This won't be used with Controller, consider removing it
        />
      ) : null}
      {errorMessage && (
        <div className="flex items-center h-auto">
          <CiWarning className="text-red-400 text-xs mr-1" />{" "}
          <span className="text-red-500 text-xs">{errorMessage as string}</span>
        </div>
      )}
    </div>
  );
}
