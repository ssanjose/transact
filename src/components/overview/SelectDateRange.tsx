'use client';

import React from "react";
import { SelectedDateRange, SelectedDateRangeOptions } from "@/services/analytics.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectDateRangeProps {
  className?: string;
  selectedDateRange: SelectedDateRange;
  setSelectedDateRange: (selectedDateRange: SelectedDateRange) => void;
}

const SelectDateRange = ({ className, selectedDateRange, setSelectedDateRange }: SelectDateRangeProps) => {
  return (
    <div className={cn("", className)}>
      <Select defaultValue={`${selectedDateRange}`}
        onValueChange={(value) => setSelectedDateRange(parseInt(value) as SelectedDateRange)}
      >
        <SelectTrigger className="w-fit self-start shadow-none text-left w-[100px] text-secondary-foreground border">
          <SelectValue placeholder={selectedDateRange} />
        </SelectTrigger>
        <SelectContent>
          {SelectedDateRangeOptions.map((option, index) =>
            <SelectItem key={index} value={index.toString()}>
              {SelectedDateRange[index]}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>

  )
};

export default SelectDateRange;