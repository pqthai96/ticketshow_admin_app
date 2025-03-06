'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/use-components/dashboard/ui/select";


type PropsType = {
  defaultValue?: string;
  sectionKey: string;
};

export function PeriodPicker({ defaultValue = 'monthly', sectionKey }: PropsType) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  // Update the URL with the selected time frame
  const updateTimeFrame = (value: string) => {
    setSelectedValue(value);

    // Create a new URLSearchParams object with the current params
    const params = new URLSearchParams(searchParams.toString());

    // Update or add the selected time frame parameter
    params.set(`selected_time_frame`, value);

    // Update the URL with the new search parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      value={selectedValue}
      onValueChange={updateTimeFrame}
    >
      <SelectTrigger className="w-36 h-10 px-3 text-sm font-medium bg-white border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
      </SelectContent>
    </Select>
  );
}