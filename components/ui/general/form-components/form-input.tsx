import { Label } from "@/components/ui/label";
import React from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CiWarning } from "react-icons/ci";
import { Textarea } from "@/components/ui/textarea";
import { ItemInterface } from "@/lib/filter-types";

interface FormInputType<T extends FieldValues> {
  items?: ItemInterface[];
  control?: Control<T>;
  register?: UseFormRegister<T>;
  validationRules?: object;
  name: Path<T>;
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
  onSelect?: (item: ItemInterface) => void;
  allowedNewValue?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  labelColor?: string;
  fieldBg?: string;
  borderNone?: boolean;
  clearFn?: () => void;
}

export default function FormInput<T extends FieldValues>({
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
}: FormInputType<T>) {
  const isSearch = inputType === "search";
  const isDate = inputType === "date";
  const isDefault = inputType === "default";
  const isTextArea = inputType === "textArea";

  // create a required rule that checks if the field is empty
  const requiredRule = required ? { required: `${label} is required` } : {};

  // combine the required rule with any custom validationRules:
  const finalRules = { ...requiredRule, ...validationRules };

  return (
    <div className={`flex flex-col ${className}`}>
      <Label
        htmlFor={name}
        className={`font-semibold text-xs text-gray-500 ${labelColor}`}
      >
        {label}
        {required !== false && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {isSearch ? (
        <Controller
          rules={finalRules}
          control={control}
          name={name}
          render={({ field: { onChange, value, onBlur } }) => (
            <div className="w-full mt-1">
              <Combobox
                items={items}
                onSelect={(item) =>
                  onSelect ? onSelect(item) : onChange(String(item.value))
                }
                placeholder={placeholder || ""}
                emptyMessage={placeholder || ""}
                value={value || ""}
                onBlur={onBlur}
                allowNewValue={allowedNewValue}
                disabled={disabled}
                clearFn={clearFn}
              />
            </div>
          )}
        />
      ) : isDefault ? (
        <>
          {control ? (
            <Controller
              rules={finalRules} // Validation rules go here
              control={control} // Required for Controller to manage state
              name={name} // Field name in the form
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <div className="w-full">
                  <Input
                    type={dataType}
                    id={name}
                    placeholder={placeholder || ""}
                    value={value} // Controlled value from Controller
                    onChange={onChange} // Controlled onChange from Controller
                    onBlur={onBlur} // Optional: for blur validation
                    min={min}
                    onChangeCapture={onChangeCapture} // Custom prop (if needed)
                    readOnly={readOnly}
                    className={`text-xs sm:text-sm mt-1 ${fieldBg} ${
                      borderNone ? "border-none" : ""
                    }`}
                  />
                </div>
              )}
            />
          ) : (
            <Input
              type={dataType}
              id={name}
              placeholder={placeholder || ""}
              value={value}
              min={min}
              onChangeCapture={onChangeCapture}
              readOnly={readOnly}
              className={`text-xs sm:text-sm mt-1 ${fieldBg} ${
                borderNone ? "border-none" : ""
              }`}
              {...(register && register(name, validationRules))}
            />
          )}
        </>
      ) : isDate ? (
        <Controller
          rules={finalRules}
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
      ) : isTextArea ? (
        <Textarea
          id={name}
          value={value}
          placeholder={placeholder || ""}
          className={`text-xs sm:text-sm flex-grow ${fieldBg} ${
            borderNone ? "border-none" : ""
          }`}
          {...(register && register(name, validationRules))}
        />
      ) : null}

      {errorMessage && (
        <div className="flex items-center h-auto">
          <CiWarning className="text-red-400 text-xs mr-1" />
          <span className="text-red-500 text-xs">{errorMessage as string}</span>
        </div>
      )}
    </div>
  );
}
