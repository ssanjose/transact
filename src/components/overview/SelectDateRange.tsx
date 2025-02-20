'use client';

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectedDateRange, SelectedDateRangeOptions } from "@/services/analytics/props/date-range.props";

interface SelectDateRangeProps {
  className?: string;
  selectedDateRange: SelectedDateRange;
  setSelectedDateRange: (selectedDateRange: SelectedDateRange) => void;
}

const SelectDateRange = ({ className, selectedDateRange, setSelectedDateRange }: SelectDateRangeProps) => {
  return (
    <Select defaultValue={`${selectedDateRange}`}
      onValueChange={(value) => setSelectedDateRange(parseInt(value) as SelectedDateRange)}
    >
      <SelectTrigger className={cn("w-fit self-start shadow-none text-left w-[100px]", className)} aria-label="Select Date Range">
        <SelectValue placeholder={selectedDateRange} />
      </SelectTrigger>
      <SelectContent>
        {SelectedDateRangeOptions.map((option, index) =>
          <SelectItem key={index} value={index.toString()}>
            {option}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
};

export default SelectDateRange;