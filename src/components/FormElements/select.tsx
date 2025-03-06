"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";

type PropsType = {
  label: string;
  items: { value: string; label: string }[];
  prefixIcon?: React.ReactNode;
  className?: string;
  name?: string;
  value?: string;
  isLoading?: boolean;
  onChange?: ((e: React.ChangeEvent<HTMLSelectElement>) => void) | ((value: string) => void);
} & (
  | { placeholder?: string; defaultValue: string }
  | { placeholder: string; defaultValue?: string }
  );

export function Select({
                         items,
                         label,
                         defaultValue,
                         value,
                         placeholder,
                         prefixIcon,
                         className,
                         name,
                         onChange,
                         isLoading = false,
                       }: PropsType) {
  const id = useId();

  const [isOptionSelected, setIsOptionSelected] = useState(!!value || !!defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOptionSelected(true);
    if (onChange) {
      if (onChange.length === 1) {
        (onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void)(e);
      } else {
        (onChange as (value: string) => void)(e.target.value);
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          id={id}
          value={value !== undefined ? value : defaultValue || ""}
          onChange={handleChange}
          name={name}
          disabled={isLoading}
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
            isOptionSelected && "text-dark dark:text-white",
            prefixIcon && "pl-11.5",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {isLoading ? "Loading..." : placeholder}
            </option>
          )}

          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />

        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}